import { ArrayField, Field, useField, useForm } from '@formily/react';
import { reaction } from '@formily/reactive';
import { Button, Table } from 'antd';
import * as React from 'react';
import { FormilyEditableTableField } from './FormilyEditableTableField';
import type { IArrayField, IColumnRenderOpt, IFormilyEditableTableProps } from './types';

// ========================= 默认操作列 =========================

const DefaultOperator: React.FC<{ index: number; field: IArrayField; disabled: boolean }> = ({
    index,
    field,
    disabled,
}) => {
    const remove = () => {
        field.remove(index);
    };
    return (
        <span
            className={`fet-operator${disabled ? ' fet-operator-disabled' : ''}`}
            onClick={disabled ? undefined : remove}
        >
            删除
        </span>
    );
};

// ========================= 深拷贝 =========================

function cloneDeep<T>(obj: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}

// ========================= FormilyEditableTableInner =========================

const FormilyEditableTableInner: React.FC<Omit<IFormilyEditableTableProps, 'name'>> = (props) => {
    const {
        columns: columnsIn,
        addText = '添加',
        itemDefaultValue = {},
        hideAdd = false,
        max,
        min = 0,
        pagination: paginationIn,
        addButtonPosition = 'bottom',
        validateBeforeAdd = false,
        addButtonProps,
        className,
        style,
        tableProps,
    } = props;

    const field = useField() as IArrayField;
    const form = useForm();

    // reaction() 直接追踪 Formily 响应式属性
    // 版本计数器仅在 reaction 触发时递增，强制 React 重渲染
    const [version, setVersion] = React.useState(0);
    React.useEffect(() => {
        if (!field) return;
        const dispose = reaction(
            () => field.value?.length ?? 0,
            () => setVersion((v) => v + 1),
        );
        return () => dispose();
    }, [field]);

    const tableValue = field.value || [];
    const valueLen = tableValue.length;
    const disableRemove = valueLen <= min;
    const disableAdd = max != null && valueLen >= max;

    // 用 ref 读取 valueLen，避免行增删导致 columns useMemo 重建
    const valueLenRef = React.useRef(valueLen);
    valueLenRef.current = valueLen;

    // 分页状态
    const defaultPagination = React.useMemo(() => {
        if (paginationIn === false) {
            return { current: 1, pageSize: 10 };
        }
        return {
            current: paginationIn?.current ?? 1,
            pageSize: paginationIn?.pageSize ?? 10,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [tableState, setTableState] = React.useState(defaultPagination);
    const { current, pageSize } = tableState;

    React.useEffect(() => {
        const baseIndex = (current - 1) * pageSize;
        if (baseIndex >= valueLen) {
            setTableState((s) => ({ ...s, current: Math.max(s.current - 1, 1) }));
        }
    }, [valueLen, current, pageSize]);

    // 列定义
    const columns = React.useMemo(() => {
        return columnsIn.map((col, colIndex) => ({
            ...col,
            dataIndex: col.dataIndex ?? (typeof col.title === 'string' ? col.title : colIndex),
            render: (_: any, __: any, index: number) => {
                const fieldIndex = (current - 1) * pageSize + index;
                if (fieldIndex >= valueLenRef.current) return null;

                const content = col.render ? (
                    col.render({ index: fieldIndex, field } as IColumnRenderOpt)
                ) : (
                    <DefaultOperator index={fieldIndex} field={field} disabled={disableRemove} />
                );

                // 行级 Field 上下文：使 <FormilyEditableTableField name="type"> 解析为 items.{fieldIndex}.type
                return <Field name={String(fieldIndex)}>{content}</Field>;
            },
        }));
    }, [columnsIn, current, pageSize, field, disableRemove]);

    // 分页配置
    const pagination = React.useMemo(() => {
        if (paginationIn === false) return false;
        return {
            ...paginationIn,
            ...tableState,
            onChange: (page: number, size: number) => {
                setTableState({ current: page, pageSize: size });
            },
        } as any;
    }, [paginationIn, tableState]);

    // 添加行
    const add = React.useCallback(async () => {
        if (validateBeforeAdd && form) {
            const arrayPath = field.address.toString();
            try {
                await form.validate(`${arrayPath}.*`);
            } catch {
                // 校验未通过，阻止添加；错误已由 Formily 渲染到各字段
                return;
            }
        }
        field.push(cloneDeep(itemDefaultValue));
    }, [field, form, validateBeforeAdd, itemDefaultValue]);

    // 添加按钮
    const addButton = React.useMemo(() => {
        if (hideAdd) return null;
        return (
            <Button
                type="link"
                disabled={disableAdd}
                onClick={add}
                className={`fet-add${addButtonPosition === 'top' ? ' fet-add-top' : ''}`}
                {...addButtonProps}
            >
                {addText}
            </Button>
        );
    }, [hideAdd, disableAdd, add, addButtonPosition, addButtonProps, addText]);

    // dataSource
    const dataSource = React.useMemo(() => {
        const rows = field.value || [];
        return rows.map((item: any, index: number) => ({ ...item, key: index }));
        // version 变化时重新计算
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [version]);

    return (
        <div className={`fet-table${className ? ` ${className}` : ''}`} style={style}>
            {addButtonPosition === 'top' && addButton}
            <Table {...tableProps} columns={columns} dataSource={dataSource} pagination={pagination} />
            {addButtonPosition === 'bottom' && addButton}
        </div>
    );
};

// ========================= FormilyEditableTable 主组件 =========================

export const FormilyEditableTable: React.FC<IFormilyEditableTableProps> & { Field: typeof FormilyEditableTableField } =
    (props) => {
        const { name, ...rest } = props;

        return (
            <ArrayField name={name}>
                <FormilyEditableTableInner {...rest} />
            </ArrayField>
        );
    };

FormilyEditableTable.Field = FormilyEditableTableField;
