import type { Form, ArrayField as FormilyArrayField, Field as FormilyField } from '@formily/core';
import type { ButtonProps, PaginationProps, TableProps } from 'antd';

/** Formily ArrayField 实例类型 */
export type IArrayField = FormilyArrayField;

/** Formily Field 实例类型 */
export type IField = FormilyField;

/** Formily Form 实例类型 */
export type IForm = Form;

/** 列渲染函数参数 */
export interface IColumnRenderOpt {
    /** 当前行在数组中的索引 */
    index: number;
    /** Formily ArrayField 实例，可调用 push/remove/move 等 */
    field: IArrayField;
}

/** 列定义 */
export interface IColumn {
    /** 列标题 */
    title: React.ReactNode;
    /** 列宽度 */
    width?: number | string;
    /** 列对齐 */
    align?: 'left' | 'center' | 'right';
    /** 固定列 */
    fixed?: 'left' | 'right' | boolean;
    /** 自定义渲染，返回单元格内容 */
    render?: (opt: IColumnRenderOpt) => React.ReactNode;
    /** 其他 antd TableColumnProps 透传 */
    [key: string]: any;
}

/** FormilyEditableTable 组件 Props */
export interface IFormilyEditableTableProps {
    /** 数组字段名（如 "items"），内部自动创建 ArrayField */
    name: string;
    /** 列定义 */
    columns: IColumn[];
    /** 添加按钮文案 */
    addText?: string;
    /** 每行默认值 */
    itemDefaultValue?: Record<string, any>;
    /** 隐藏添加按钮 */
    hideAdd?: boolean;
    /** 最大行数 */
    max?: number;
    /** 最小行数 */
    min?: number;
    /** 分页配置，false 不分页 */
    pagination?: false | PaginationProps;
    /** 添加按钮位置 */
    addButtonPosition?: 'top' | 'bottom';
    /** 添加前校验已有行 */
    validateBeforeAdd?: boolean;
    /** 添加按钮属性 */
    addButtonProps?: Omit<ButtonProps, 'onClick'>;
    /** 容器 className */
    className?: string;
    /** 容器 style */
    style?: React.CSSProperties;
    /** antd Table 其他 props 透传 */
    tableProps?: Omit<TableProps, 'columns' | 'dataSource' | 'pagination'>;
}

/** FormilyEditableTable.Field (CellBridge) 组件 Props */
export interface IFormilyEditableTableFieldProps {
    /** 字段名 */
    name: string;
    /** 必填校验 */
    required?: boolean;
    /** 自定义校验规则 */
    rules?: any;
    /** 是否可编辑，false 时显示只读文本 */
    editable?: boolean;
    /** 转化表单值给控件的 value */
    format?: (v: any) => any;
    /** 转化控件的 onChange 值给表单 */
    parse?: (v: any) => any;
    /** 表单控件 */
    children?: React.ReactNode;
}
