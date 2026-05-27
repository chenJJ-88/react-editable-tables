import * as React from 'react';
import {Field, useField, useForm} from '@formily/react';
import {Table, Button, App} from 'antd';
import type {IFastTableProps, IColumnRenderOpt, IArrayField} from './types';
import {FastTableField} from './FastTableField';

// ========================= 默认操作列 =========================

const DefaultOperator: React.FC<{index: number; field: IArrayField; disabled: boolean}> = (
    {index, field, disabled},
) => {
    const {message: messageApi} = App.useApp();
    const remove = () => {
        field.remove(index);
        messageApi.success('删除成功');
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

// ========================= RowFieldWrapper =========================

/** 为每行创建 <Field name={index}>，让 FastTable.Field 能通过 useField 读取行数据 */
const RowFieldWrapper: React.FC<{index: number; children: React.ReactNode}> = ({index, children}) => {
    return (
        <Field name={index}>
            {children}
        </Field>
    );
};

// ========================= 深拷贝 =========================

function cloneDeep<T>(obj: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}

// ========================= FastTableInner =========================

/**
 * 表格内部实现，在 <Field name={name}> 上下文内渲染。
 * 通过 useField() 自动获取 ArrayField 实例。
 */
const FastTableInner: React.FC<Omit<IFastTableProps, 'name'> & {field: IArrayField}> = props => {
    const {
        field,
        columns: columnsIn,
        addText = '添加',
        itemDefaultValue = {},
        hideAdd = false,
        max,
        min = 0,
        pagination: paginationIn,
        addButtonPosition = 'bottom',
        validateBeforeAdd = true,
        addButtonProps,
        className,
        style,
        tableProps,
    } = props;

    const form = useForm();

    const valueLen = field.value?.length ?? 0;
    const disableRemove = valueLen <= min;
    const disableAdd = max != null && valueLen >= max;

    const valueLenRef = React.useRef(valueLen);
    valueLenRef.current = valueLen;

    // 分页状态
    const defaultPagination = React.useMemo(() => {
        if (paginationIn === false) {
            return {current: 1, pageSize: 10};
        }
        return {
            current: paginationIn?.current ?? 1,
            pageSize: paginationIn?.pageSize ?? 10,
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [tableState, setTableState] = React.useState(defaultPagination);
    const {current, pageSize} = tableState;

    React.useEffect(() => {
        const baseIndex = (current - 1) * pageSize;
        if (baseIndex >= valueLenRef.current) {
            setTableState(s => ({...s, current: Math.max(s.current - 1, 1)}));
        }
    }, [valueLen, current, pageSize]);

    // 稳定的 columns（valueLen 不作为依赖！）
    const columns = React.useMemo(() => {
        return columnsIn.map((col, colIndex) => ({
            ...col,
            dataIndex: col.dataIndex ?? (typeof col.title === 'string' ? col.title : colIndex),
            render: (_: any, __: any, index: number) => {
                const fieldIndex = (current - 1) * pageSize + index;
                if (fieldIndex >= valueLenRef.current) return null;

                const render = col.render;
                if (render) {
                    const renderOpt: IColumnRenderOpt = {index: fieldIndex, field};
                    return (
                        <RowFieldWrapper index={fieldIndex}>
                            {render(renderOpt)}
                        </RowFieldWrapper>
                    );
                }

                return (
                    <RowFieldWrapper index={fieldIndex}>
                        <DefaultOperator index={fieldIndex} field={field} disabled={disableRemove} />
                    </RowFieldWrapper>
                );
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
                setTableState({current: page, pageSize: size});
            },
        } as any;
    }, [paginationIn, tableState]);

    // 添加行
    const add = React.useCallback(async () => {
        if (validateBeforeAdd && form) {
            try {
                await form.validate();
            } catch {
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
        return (field.value || []).map((item: any, index: number) => ({
            ...item,
            key: index,
        }));
    }, [field.value]);

    return (
        <div className={`fet-table${className ? ` ${className}` : ''}`} style={style}>
            {addButtonPosition === 'top' && addButton}
            <Table
                {...tableProps}
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
            />
            {addButtonPosition === 'bottom' && addButton}
        </div>
    );
};

// ========================= FastTable 主组件 =========================

/**
 * 高性能可编辑表格。
 *
 * 用法与 Form.Table 一致，只需传 name 即可，内部自动创建 ArrayField：
 *
 * <FormProvider form={form}>
 *   <FastTable name="items" columns={columns} />
 * </FormProvider>
 */
export const FastTable: React.FC<IFastTableProps> & { Field: typeof FastTableField } = props => {
    const {name, ...rest} = props;

    return (
        <Field name={name}>
            <FastTableInnerWithField {...rest} />
        </Field>
    );
};

/**
 * 在 <Field name={name}> 上下文内，通过 useField 获取 ArrayField 后渲染表格。
 */
const FastTableInnerWithField: React.FC<Omit<IFastTableProps, 'name'>> = props => {
    const field = useField() as IArrayField;
    return <FastTableInner field={field} {...props} />;
};

FastTable.Field = FastTableField;
