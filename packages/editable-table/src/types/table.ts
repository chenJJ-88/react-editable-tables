import type { ReactNode } from 'react';

/** 校验规则 */
export interface Rule {
    /** 是否必填 */
    required?: boolean;
    /**
     * 自定义校验函数
     * - 返回 true：校验通过
     * - 返回 false：使用 message 作为错误信息
     * - 返回 string：使用返回的 string 作为错误信息
     */
    validator?: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any,
        row: Record<string, any>,
    ) => boolean | string;
    /** 默认错误信息（validator 返回 false 时使用） */
    message: string;
}

/** 编辑态渲染函数接收的 props */
export interface EditRenderProps<T> {
    /** 当前字段值 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    /** 值变化回调 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => void;
    /** 当前行数据 */
    row: T;
    /** 行索引 */
    rowIndex: number;
    /** 校验错误信息 */
    error?: string;
}

/** 列定义 */
export interface EditableColumn<T> {
    /** 列标题 */
    title: ReactNode;
    /** 唯一标识，用于 React key，优先级高于 dataIndex */
    key?: string;
    /** 数据字段名。数据列必填；纯操作列可省略 */
    dataIndex?: keyof T & string;
    /** 列宽 */
    width?: number | string;
    /** 列固定方向 */
    fixed?: 'left' | 'right';
    /** 是否可编辑，默认 true */
    editable?: boolean;
    /**
     * 编辑态渲染函数，直接返回任意 React 组件
     * 示例：editRender: ({ value, onChange }) => <input value={value} onChange={e => onChange(e.target.value)} />
     */
    editRender?: (props: EditRenderProps<T>) => ReactNode;
    /** 校验规则 */
    rules?: Rule[];
    /** 字段联动：当该字段值变化时，返回需要同步更新的字段键值对，支持异步 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFieldChange?: (value: any, row: T) => Partial<T> | undefined | Promise<Partial<T> | undefined>;
    /** 自定义只读态渲染 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any, row: T, rowIndex: number) => ReactNode;
}

/** 校验触发时机 */
export type ValidateTrigger = 'submit' | 'change';

/** 全量校验结果 */
export interface ValidateAllResult {
    /** 是否全部通过 */
    isValid: boolean;
    /** 错误信息映射，key 格式为 `${rowIndex}-${dataIndex}` */
    errors: Record<string, string>;
}

/** 通过 ref 暴露的表格操作方法 */
export interface EditableTableInstance<T> {
    /** 在末尾新增一行 */
    addRow: (defaults?: Partial<T>) => void;
    /** 删除指定行 */
    removeRow: (rowIndex: number) => void;
    /** 上移指定行 */
    moveUp: (rowIndex: number) => void;
    /** 下移指定行 */
    moveDown: (rowIndex: number) => void;
    /** 获取当前数据 */
    getData: () => T[];
    /** 全量校验，返回校验结果 */
    validateAll: () => ValidateAllResult;
    /** 部分更新指定行数据 */
    updateRow: (rowIndex: number, updates: Partial<T>) => void;
    /** 在指定位置插入一行 */
    insertRow: (rowIndex: number, defaults?: Partial<T>) => void;
}

/** EditableTable 组件 props */
export interface EditableTableProps<T> {
    /** 行唯一标识字段名 */
    rowKey: keyof T & string;
    /** 列定义 */
    columns: EditableColumn<T>[];
    /** 数据源 */
    dataSource: T[];
    /** 编辑模式：'all' 全量编辑 | 'row' 行编辑 */
    editableMode?: 'all' | 'row';
    /** 提交回调，接收校验通过的数据 */
    onSubmit?: (data: T[]) => void;
    /** 数据变化回调 */
    onChange?: (data: T[]) => void;
    /** 校验触发时机，默认 'submit' */
    validateTrigger?: ValidateTrigger;
    /** 虚拟滚动容器高度（px），传入时启用虚拟滚动 */
    scrollY?: number;
    /** 空数据提示，默认 '暂无数据' */
    emptyText?: ReactNode;
    /** 自定义行类名 */
    rowClassName?: (record: T, index: number) => string;
    /** 行编辑模式下操作列宽度，默认 120px */
    opsWidth?: number | string;
    /** 容器类名 */
    className?: string;
    /** 容器样式 */
    style?: React.CSSProperties;
    /** 是否显示单元格边框，默认 false */
    bordered?: boolean;
}
