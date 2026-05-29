import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { EditableColumn, EditableTableInstance, EditableTableProps, ValidateAllResult } from '../../types/table';
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
        rowClassName,
        opsWidth: opsWidthProp,
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
    const [scrollShadow, setScrollShadow] = useState<{ left: boolean; right: boolean }>({ left: false, right: false });
    const originalDataRef = useRef<Map<string, T>>(new Map());
    const dataRef = useRef<T[]>([]);
    dataRef.current = data;

    const getColKey = useCallback((col: EditableColumn<T>, idx: number) => {
        if (col.key) return col.key;
        if (col.dataIndex != null) return String(col.dataIndex);
        return `__col_${idx}`;
    }, []);

    useEffect(() => {
        setData(dataSource);
        const currentIds = new Set(dataSource.map((r) => String(r[rowKey])));
        for (const id of originalDataRef.current.keys()) {
            if (!currentIds.has(id)) {
                originalDataRef.current.delete(id);
            }
        }
        setEditingRows((prev) => {
            const next = new Set(prev);
            for (const id of prev) {
                if (!currentIds.has(id)) next.delete(id);
            }
            return next.size === prev.size ? prev : next;
        });
    }, [dataSource, rowKey]);

    // ===== 校验 =====
    const validateAll = useCallback((): ValidateAllResult => {
        const allErrors: Record<string, string> = {};
        data.forEach((row, rowIndex) => {
            const rowErrors = validateRow(row, columns);
            for (const [dataIndex, msg] of Object.entries(rowErrors)) {
                allErrors[`${rowIndex}-${dataIndex}`] = msg;
            }
        });
        setErrors(allErrors);
        return { isValid: Object.keys(allErrors).length === 0, errors: allErrors };
    }, [data, columns]);

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
                    [next[rowIndex - 1], next[rowIndex]] = [next[rowIndex], next[rowIndex - 1]];
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
                    [next[rowIndex], next[rowIndex + 1]] = [next[rowIndex + 1], next[rowIndex]];
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
            validateAll,
            updateRow: (rowIndex, updates) => {
                setData((prev) => {
                    if (rowIndex < 0 || rowIndex >= prev.length) return prev;
                    const next = [...prev];
                    next[rowIndex] = { ...next[rowIndex], ...updates };
                    onChange?.(next);
                    return next;
                });
            },
            insertRow: (rowIndex, defaults) => {
                const newRow = { ...defaults } as T;
                setData((prev) => {
                    const next = [...prev];
                    next.splice(rowIndex, 0, newRow);
                    setErrors((errs) => {
                        const nextErrs: Record<string, string> = {};
                        for (const [k, v] of Object.entries(errs)) {
                            const dashIdx = k.indexOf('-');
                            const ri = Number(k.slice(0, dashIdx));
                            const rest = k.slice(dashIdx);
                            if (ri < rowIndex) nextErrs[k] = v;
                            else nextErrs[`${ri + 1}${rest}`] = v;
                        }
                        return nextErrs;
                    });
                    onChange?.(next);
                    return next;
                });
            },
        }),
        [onChange, validateAll],
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
                const currentRow = dataRef.current[rowIndex];
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
                    const row = dataRef.current[rowIndex];
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
        [columns, onChange, validateTrigger],
    );

    const handleSubmit = useCallback(() => {
        const result = validateAll();
        if (result.isValid) onSubmit?.(data);
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
    // 行编辑模式需要操作列
    const opsWidth =
        editableMode === 'row'
            ? opsWidthProp != null
                ? typeof opsWidthProp === 'number'
                    ? `${opsWidthProp}px`
                    : opsWidthProp
                : '120px'
            : undefined;

    const gridTemplate = useMemo(() => {
        const cols = columns.map((col) => {
            if (col.width) {
                const w = typeof col.width === 'number' ? col.width : parseInt(col.width as string, 10) || 150;
                return `minmax(${w}px, ${w}fr)`;
            }
            return 'minmax(150px, 1fr)';
        }).join(' ');
        return opsWidth ? `${cols} ${opsWidth}` : cols;
    }, [columns, opsWidth]);

    // ===== 列固定偏移量 =====
    const fixedOffsets = useMemo(() => {
        const offsets: { left?: number; right?: number }[] = new Array(columns.length).fill({});
        const widths = columns.map((col) => (typeof col.width === 'number' ? col.width : 150));

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

    const headerScrollRef = useRef<HTMLDivElement>(null);
    const bodyScrollRef = useRef<HTMLDivElement | null>(null);
    const syncHeaderScroll = useCallback((scrollLeft: number) => {
        if (headerScrollRef.current) {
            headerScrollRef.current.scrollLeft = scrollLeft;
        }
    }, []);

    const updateScrollShadow = useCallback((el: HTMLDivElement) => {
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setScrollShadow({
            left: scrollLeft > 0,
            right: scrollLeft + clientWidth < scrollWidth - 1,
        });
    }, []);

    return (
        <div className={`et-wrapper${className ? ` ${className}` : ''}`} style={style}>
            {editableMode === 'all' && (
                <div className="et-toolbar">
                    <button type="button" className="et-btn et-btn-primary" onClick={handleSubmit}>
                        提交
                    </button>
                </div>
            )}

            <div
                className={`et-table${bordered ? ' et-bordered' : ''}${scrollShadow.left ? ' et-scroll-left' : ''}${scrollShadow.right ? ' et-scroll-right' : ''}`}
            >
                <div ref={headerScrollRef} className={`et-scroll-x${scrollY != null ? ' et-scroll-x-vscroll' : ''}`}>
                    <div className="et-inner">
                        <div className="et-header" style={{ display: 'grid', gridTemplateColumns: gridTemplate }}>
                            {columns.map((col, colIndex) => {
                                const offset = fixedOffsets[colIndex];
                                const isFixed = col.fixed === 'left' || col.fixed === 'right';
                                return (
                                    <div
                                        key={getColKey(col, colIndex)}
                                        className={`et-header-cell${isFixed ? ` et-fixed et-fixed-${col.fixed}` : ''}`}
                                        style={{
                                            ...(isFixed
                                                ? {
                                                    position: 'sticky',
                                                    ...(offset.left !== undefined ? { left: offset.left } : {}),
                                                    ...(offset.right !== undefined ? { right: offset.right } : {}),
                                                }
                                                : {}),
                                        }}
                                    >
                                        {col.title}
                                    </div>
                                );
                            })}
                            {editableMode === 'row' && <div className="et-header-cell et-ops-column">操作</div>}
                        </div>
                    </div>
                </div>

                <div
                    ref={(el) => {
                        parentRef.current = el;
                        bodyScrollRef.current = el;
                    }}
                    className="et-body"
                    style={scrollY ? { height: scrollY, overflowY: 'scroll', overflowX: 'auto' } : undefined}
                    onScroll={(e) => {
                        syncHeaderScroll(e.currentTarget.scrollLeft);
                        updateScrollShadow(e.currentTarget);
                    }}
                >
                    {data.length === 0 ? (
                        <div className="et-empty">{emptyText}</div>
                    ) : enableVirtual ? (
                        <div style={{ minWidth: '100%' }}>
                            <div
                                style={{
                                    height: `${rowVirtualizer.getTotalSize()}px`,
                                    position: 'relative',
                                    minWidth: '100%',
                                }}
                            >
                                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                    const row = data[virtualRow.index];
                                    const id = String(row[rowKey]);
                                    const isEditing = editingRows.has(id);

                                    return (
                                        <div
                                            key={id}
                                            className={`et-row${rowClassName ? ` ${rowClassName(row, virtualRow.index)}` : ''}`}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: gridTemplate,
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: 'fit-content',
                                                minWidth: '100%',
                                                transform: `translateY(${virtualRow.start}px)`,
                                                height: `${virtualRow.size}px`,
                                            }}
                                        >
                                            {columns.map((col, colIndex) => {
                                                const colDataIndex =
                                                    col.dataIndex != null ? String(col.dataIndex) : undefined;
                                                const value =
                                                    col.dataIndex != null ? row[col.dataIndex as keyof T] : undefined;
                                                const editable =
                                                    editableMode === 'all'
                                                        ? col.editable !== false
                                                        : isEditing && col.editable !== false;
                                                const errorKey = colDataIndex
                                                    ? `${virtualRow.index}-${colDataIndex}`
                                                    : undefined;
                                                const offset = fixedOffsets[colIndex];
                                                const isFixed = col.fixed === 'left' || col.fixed === 'right';

                                                return (
                                                    <div
                                                        key={getColKey(col, colIndex)}
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
                                                            error={errorKey ? errors[errorKey] : undefined}
                                                            rowIndex={virtualRow.index}
                                                            row={row}
                                                            onChange={
                                                                colDataIndex
                                                                    ? (v) =>
                                                                        updateCell(virtualRow.index, colDataIndex, v)
                                                                    : () => { }
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
                        <div style={{ minWidth: '100%' }}>
                            {data.map((row, rowIndex) => {
                                const id = String(row[rowKey]);
                                const isEditing = editingRows.has(id);

                                return (
                                    <div
                                        key={id}
                                        className={`et-row${rowClassName ? ` ${rowClassName(row, rowIndex)}` : ''}`}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: gridTemplate,
                                        }}
                                    >
                                        {columns.map((col, colIndex) => {
                                            const colDataIndex =
                                                col.dataIndex != null ? String(col.dataIndex) : undefined;
                                            const value =
                                                col.dataIndex != null ? row[col.dataIndex as keyof T] : undefined;
                                            const editable =
                                                editableMode === 'all'
                                                    ? col.editable !== false
                                                    : isEditing && col.editable !== false;
                                            const errorKey = colDataIndex ? `${rowIndex}-${colDataIndex}` : undefined;
                                            const offset = fixedOffsets[colIndex];
                                            const isFixed = col.fixed === 'left' || col.fixed === 'right';

                                            return (
                                                <div
                                                    key={getColKey(col, colIndex)}
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
                                                        error={errorKey ? errors[errorKey] : undefined}
                                                        rowIndex={rowIndex}
                                                        row={row}
                                                        onChange={
                                                            colDataIndex
                                                                ? (v) => updateCell(rowIndex, colDataIndex, v)
                                                                : () => { }
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

type EditableTableComponent = <T extends object = Record<string, unknown>>(
    props: EditableTableProps<T> & React.RefAttributes<EditableTableInstance<T>>,
) => React.ReactNode;

const ForwardedEditableTable = React.forwardRef(EditableTable) as unknown as EditableTableComponent;

export default ForwardedEditableTable;

export type {
    EditableColumn,
    EditableTableInstance,
    EditableTableProps,
    EditRenderProps,
    Rule,
    ValidateAllResult,
    ValidateTrigger,
} from '../../types/table';
