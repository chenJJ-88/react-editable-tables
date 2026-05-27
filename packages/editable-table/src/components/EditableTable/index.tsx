import { useVirtualizer } from '@tanstack/react-virtual';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  EditableTableInstance,
  EditableTableProps,
} from '../../types/table';
import { validateRow, validateValue } from '../../utils/validate';
import TableCell from './TableCell';
import './EditableTable.css';

function EditableTable<T extends object = Record<string, unknown>>(
  {
    rowKey,
    columns,
    dataSource,
    editableMode = 'all',
    onSubmit,
    onChange,
    validateTrigger = 'submit',
    scrollY,
    emptyText = '暂无数据',
    className,
    style,
    bordered = false,
  }: EditableTableProps<T>,
  ref: React.Ref<EditableTableInstance<T>>,
) {
  // ===== 内部状态 =====
  const [data, setData] = useState<T[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const originalDataRef = useRef<Map<string, T>>(new Map());
  const dataRef = useRef<T[]>([]);
  dataRef.current = data;

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  // ===== 通过 ref 暴露操作方法 =====
  useImperativeHandle(
    ref,
    () => ({
      addRow: (defaults) => {
        const newRow = { ...defaults } as T;
        setData((prev) => {
          const next = [...prev, newRow];
          onChange?.(next);
          return next;
        });
      },
      removeRow: (rowIndex) => {
        setData((prev) => {
          const next = prev.filter((_, i) => i !== rowIndex);
          // 重新映射错误索引
          setErrors((errs) => {
            const nextErrs: Record<string, string> = {};
            for (const [k, v] of Object.entries(errs)) {
              const dashIdx = k.indexOf('-');
              const ri = Number(k.slice(0, dashIdx));
              const rest = k.slice(dashIdx);
              if (ri < rowIndex) nextErrs[k] = v;
              else if (ri > rowIndex) nextErrs[`${ri - 1}${rest}`] = v;
            }
            return nextErrs;
          });
          onChange?.(next);
          return next;
        });
      },
      moveUp: (rowIndex) => {
        if (rowIndex <= 0) return;
        setData((prev) => {
          const next = [...prev];
          [next[rowIndex - 1], next[rowIndex]] = [
            next[rowIndex],
            next[rowIndex - 1],
          ];
          onChange?.(next);
          return next;
        });
        setErrors((prev) => {
          const next: Record<string, string> = {};
          for (const [k, v] of Object.entries(prev)) {
            const dashIdx = k.indexOf('-');
            const ri = Number(k.slice(0, dashIdx));
            const rest = k.slice(dashIdx);
            if (ri === rowIndex - 1) next[`${rowIndex}${rest}`] = v;
            else if (ri === rowIndex) next[`${rowIndex - 1}${rest}`] = v;
            else next[k] = v;
          }
          return next;
        });
      },
      moveDown: (rowIndex) => {
        if (rowIndex >= dataRef.current.length - 1) return;
        setData((prev) => {
          const next = [...prev];
          [next[rowIndex], next[rowIndex + 1]] = [
            next[rowIndex + 1],
            next[rowIndex],
          ];
          onChange?.(next);
          return next;
        });
        setErrors((prev) => {
          const next: Record<string, string> = {};
          for (const [k, v] of Object.entries(prev)) {
            const dashIdx = k.indexOf('-');
            const ri = Number(k.slice(0, dashIdx));
            const rest = k.slice(dashIdx);
            if (ri === rowIndex) next[`${rowIndex + 1}${rest}`] = v;
            else if (ri === rowIndex + 1) next[`${rowIndex}${rest}`] = v;
            else next[k] = v;
          }
          return next;
        });
      },
      getData: () => dataRef.current,
    }),
    [onChange],
  );

  // ===== 更新单元格（含异步联动） =====
  const updateCell = useCallback(
    (rowIndex: number, dataIndex: string, value: unknown) => {
      setData((prev) => {
        const next = [...prev];
        next[rowIndex] = { ...next[rowIndex], [dataIndex]: value };
        onChange?.(next);
        return next;
      });

      const col = columns.find((c) => String(c.dataIndex) === dataIndex);
      if (col?.onFieldChange) {
        const currentRow = data[rowIndex];
        const updatedRow = { ...currentRow, [dataIndex]: value };
        const linkedResult = col.onFieldChange(value, updatedRow);
        if (linkedResult instanceof Promise) {
          linkedResult.then((updates) => {
            if (updates) {
              setData((prev) => {
                const next = [...prev];
                next[rowIndex] = { ...next[rowIndex], ...updates };
                onChange?.(next);
                return next;
              });
            }
          });
        } else if (linkedResult) {
          setData((prev) => {
            const next = [...prev];
            next[rowIndex] = { ...next[rowIndex], ...linkedResult };
            onChange?.(next);
            return next;
          });
        }
      }

      if (validateTrigger === 'change') {
        if (col?.rules?.length) {
          const row = data[rowIndex];
          const updatedRow = { ...row, [dataIndex]: value };
          const err = validateValue(value, updatedRow, col.rules);
          const key = `${rowIndex}-${dataIndex}`;
          setErrors((prev) => {
            const next = { ...prev };
            if (err) next[key] = err;
            else delete next[key];
            return next;
          });
        }
      }
    },
    [columns, data, onChange, validateTrigger],
  );

  // ===== 校验 =====
  const validateAll = useCallback((): boolean => {
    const allErrors: Record<string, string> = {};
    data.forEach((row, rowIndex) => {
      const rowErrors = validateRow(row, columns);
      for (const [dataIndex, msg] of Object.entries(rowErrors)) {
        allErrors[`${rowIndex}-${dataIndex}`] = msg;
      }
    });
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [data, columns]);

  const handleSubmit = useCallback(() => {
    if (validateAll()) onSubmit?.(data);
  }, [validateAll, onSubmit, data]);

  // ===== 行编辑 =====
  const handleEdit = useCallback(
    (id: string) => {
      const row = data.find((r) => String(r[rowKey]) === id);
      if (row) originalDataRef.current.set(id, { ...row });
      setEditingRows((prev) => new Set(prev).add(id));
    },
    [data, rowKey],
  );

  const handleSaveRow = useCallback(
    (id: string) => {
      const rowIndex = data.findIndex((r) => String(r[rowKey]) === id);
      if (rowIndex === -1) return;
      const rowErrors = validateRow(data[rowIndex], columns);
      const rowKeyErrors: Record<string, string> = {};
      for (const [dataIndex, msg] of Object.entries(rowErrors)) {
        rowKeyErrors[`${rowIndex}-${dataIndex}`] = msg;
      }
      setErrors((prev) => {
        const next: Record<string, string> = {};
        for (const [k, v] of Object.entries(prev)) {
          if (!k.startsWith(`${rowIndex}-`)) next[k] = v;
        }
        Object.assign(next, rowKeyErrors);
        return next;
      });
      if (Object.keys(rowKeyErrors).length === 0) {
        setEditingRows((prev) => {
          const n = new Set(prev);
          n.delete(id);
          return n;
        });
        originalDataRef.current.delete(id);
      }
    },
    [data, columns, rowKey],
  );

  const handleCancelEdit = useCallback(
    (id: string) => {
      const original = originalDataRef.current.get(id);
      if (original) {
        const rowIndex = data.findIndex((r) => String(r[rowKey]) === id);
        if (rowIndex !== -1) {
          setData((prev) => {
            const n = [...prev];
            n[rowIndex] = original;
            return n;
          });
        }
        originalDataRef.current.delete(id);
      }
      const rowIndex = data.findIndex((r) => String(r[rowKey]) === id);
      if (rowIndex !== -1) {
        setErrors((prev) => {
          const n: Record<string, string> = {};
          for (const [k, v] of Object.entries(prev)) {
            if (!k.startsWith(`${rowIndex}-`)) n[k] = v;
          }
          return n;
        });
      }
      setEditingRows((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    },
    [data, rowKey],
  );

  // ===== 虚拟滚动 =====
  const enableVirtual = scrollY != null;
  const parentRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
    enabled: enableVirtual,
  });

  // ===== 列宽 + 横向滚动 =====
  const columnWidths = useMemo(() => {
    return columns.map((col) => {
      if (col.width)
        return typeof col.width === 'number' ? `${col.width}px` : col.width;
      return '150px';
    });
  }, [columns]);

  // ===== 列固定偏移量 =====
  const fixedOffsets = useMemo(() => {
    const offsets: { left?: number; right?: number }[] = new Array(
      columns.length,
    ).fill({});
    const widths = columns.map((col) =>
      typeof col.width === 'number' ? col.width : 150,
    );

    // 从左往右累计 left fixed
    let leftAcc = 0;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].fixed === 'left') {
        offsets[i] = { left: leftAcc };
      }
      leftAcc += widths[i];
    }

    // 从右往左累计 right fixed
    let rightAcc = 0;
    for (let i = columns.length - 1; i >= 0; i--) {
      if (columns[i].fixed === 'right') {
        offsets[i] = { right: rightAcc };
      }
      rightAcc += widths[i];
    }

    return offsets;
  }, [columns]);

  // 行编辑模式需要操作列
  const opsWidth = editableMode === 'row' ? '120px' : undefined;
  const gridTemplate = useMemo(() => {
    const cols = columnWidths.join(' ');
    return opsWidth ? `${cols} ${opsWidth}` : cols;
  }, [columnWidths, opsWidth]);

  const tableMinWidth = useMemo(() => {
    const colTotal = columns.reduce((sum, col) => {
      if (!col.width) return sum + 150;
      return sum + (typeof col.width === 'number' ? col.width : 0);
    }, 0);
    const ops = opsWidth ? 120 : 0;
    return colTotal + ops;
  }, [columns, opsWidth]);

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement | null>(null);
  const syncScroll = useCallback((source: 'header' | 'body') => {
    if (
      source === 'header' &&
      headerScrollRef.current &&
      bodyScrollRef.current
    ) {
      bodyScrollRef.current.scrollLeft = headerScrollRef.current.scrollLeft;
    }
    if (source === 'body' && headerScrollRef.current && bodyScrollRef.current) {
      headerScrollRef.current.scrollLeft = bodyScrollRef.current.scrollLeft;
    }
  }, []);

  return (
    <div
      className={`et-wrapper${className ? ` ${className}` : ''}`}
      style={style}
    >
      {editableMode === 'all' && (
        <div className="et-toolbar">
          <button
            type="button"
            className="et-btn et-btn-primary"
            onClick={handleSubmit}
          >
            提交
          </button>
        </div>
      )}

      <div className={`et-table${bordered ? ' et-bordered' : ''}`}>
        <div
          ref={headerScrollRef}
          className="et-scroll-x"
          onScroll={() => syncScroll('header')}
        >
          <div className="et-inner" style={{ minWidth: `${tableMinWidth}px` }}>
            <div
              className="et-header"
              style={{ display: 'grid', gridTemplateColumns: gridTemplate }}
            >
              {columns.map((col, colIndex) => {
                const offset = fixedOffsets[colIndex];
                const isFixed = col.fixed === 'left' || col.fixed === 'right';
                return (
                  <div
                    key={String(col.dataIndex)}
                    className={`et-header-cell${isFixed ? ` et-fixed et-fixed-${col.fixed}` : ''}`}
                    style={{
                      ...(isFixed
                        ? {
                            position: 'sticky',
                            ...(offset.left !== undefined
                              ? { left: offset.left }
                              : {}),
                            ...(offset.right !== undefined
                              ? { right: offset.right }
                              : {}),
                          }
                        : {}),
                    }}
                  >
                    {col.title}
                  </div>
                );
              })}
              {editableMode === 'row' && (
                <div className="et-header-cell et-ops-column">操作</div>
              )}
            </div>
          </div>
        </div>

        <div
          ref={(el) => {
            parentRef.current = el;
            bodyScrollRef.current = el;
          }}
          className="et-body"
          style={scrollY ? { height: scrollY, overflowY: 'auto', overflowX: 'auto' } : undefined}
          onScroll={() => syncScroll('body')}
        >
          {data.length === 0 ? (
            <div className="et-empty">{emptyText}</div>
          ) : enableVirtual ? (
            <div style={{ minWidth: `${tableMinWidth}px` }}>
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = data[virtualRow.index];
                  const id = String(row[rowKey]);
                  const isEditing = editingRows.has(id);

                  return (
                    <div
                      key={id}
                      className="et-row"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: gridTemplate,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                        height: `${virtualRow.size}px`,
                      }}
                    >
                      {columns.map((col, colIndex) => {
                        const dataIndex = String(col.dataIndex);
                        const value = row[col.dataIndex as keyof T];
                        const editable =
                          editableMode === 'all'
                            ? col.editable !== false
                            : isEditing && col.editable !== false;
                        const errorKey = `${virtualRow.index}-${dataIndex}`;
                        const offset = fixedOffsets[colIndex];
                        const isFixed =
                          col.fixed === 'left' || col.fixed === 'right';

                        return (
                          <div
                            key={dataIndex}
                            className={`et-cell${isFixed ? ` et-fixed et-fixed-${col.fixed}` : ''}`}
                            style={{
                              ...(isFixed
                                ? {
                                    position: 'sticky',
                                    ...(offset.left !== undefined
                                      ? { left: offset.left }
                                      : {}),
                                    ...(offset.right !== undefined
                                      ? { right: offset.right }
                                      : {}),
                                  }
                                : {}),
                            }}
                          >
                            <TableCell
                              value={value}
                              editable={editable}
                              column={col}
                              error={errors[errorKey]}
                              rowIndex={virtualRow.index}
                              row={row}
                              onChange={(v) =>
                                updateCell(virtualRow.index, dataIndex, v)
                              }
                            />
                          </div>
                        );
                      })}

                      {editableMode === 'row' && (
                        <div className="et-cell">
                          <div className="et-ops-cell">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className="et-btn et-btn-primary"
                                  onClick={() => handleSaveRow(id)}
                                >
                                  保存
                                </button>
                                <button
                                  type="button"
                                  className="et-btn et-btn-default"
                                  onClick={() => handleCancelEdit(id)}
                                >
                                  取消
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="et-btn et-btn-link"
                                onClick={() => handleEdit(id)}
                              >
                                编辑
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ minWidth: `${tableMinWidth}px` }}>
              {data.map((row, rowIndex) => {
                const id = String(row[rowKey]);
                const isEditing = editingRows.has(id);

                return (
                  <div
                    key={id}
                    className="et-row"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: gridTemplate,
                    }}
                  >
                    {columns.map((col, colIndex) => {
                      const dataIndex = String(col.dataIndex);
                      const value = row[col.dataIndex as keyof T];
                      const editable =
                        editableMode === 'all'
                          ? col.editable !== false
                          : isEditing && col.editable !== false;
                      const errorKey = `${rowIndex}-${dataIndex}`;
                      const offset = fixedOffsets[colIndex];
                      const isFixed =
                        col.fixed === 'left' || col.fixed === 'right';

                      return (
                        <div
                          key={dataIndex}
                          className={`et-cell${isFixed ? ` et-fixed et-fixed-${col.fixed}` : ''}`}
                          style={{
                            ...(isFixed
                              ? {
                                  position: 'sticky',
                                  ...(offset.left !== undefined
                                    ? { left: offset.left }
                                    : {}),
                                  ...(offset.right !== undefined
                                    ? { right: offset.right }
                                    : {}),
                                }
                              : {}),
                          }}
                        >
                          <TableCell
                            value={value}
                            editable={editable}
                            column={col}
                            error={errors[errorKey]}
                            rowIndex={rowIndex}
                            row={row}
                            onChange={(v) =>
                              updateCell(rowIndex, dataIndex, v)
                            }
                          />
                        </div>
                      );
                    })}

                    {editableMode === 'row' && (
                      <div className="et-cell">
                        <div className="et-ops-cell">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                className="et-btn et-btn-primary"
                                onClick={() => handleSaveRow(id)}
                              >
                                保存
                              </button>
                              <button
                                type="button"
                                className="et-btn et-btn-default"
                                onClick={() => handleCancelEdit(id)}
                              >
                                取消
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="et-btn et-btn-link"
                              onClick={() => handleEdit(id)}
                            >
                              编辑
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ForwardedEditableTable = React.forwardRef(EditableTable) as unknown as <
  T extends object = Record<string, unknown>,
>(
  props: EditableTableProps<T> & { ref?: React.Ref<EditableTableInstance<T>> },
) => React.ReactNode;

export default ForwardedEditableTable;
