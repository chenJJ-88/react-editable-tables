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
    value: unknown,
    row: Record<string, unknown>,
  ) => boolean | string;
  /** 默认错误信息（validator 返回 false 时使用） */
  message: string;
}

/** 编辑态渲染函数接收的 props */
export interface EditRenderProps<T> {
  /** 当前字段值 */
  value: unknown;
  /** 值变化回调 */
  onChange: (value: unknown) => void;
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
  title: string;
  /** 数据字段名 */
  dataIndex: keyof T & string;
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
  onFieldChange?: (
    value: unknown,
    row: T,
  ) => Partial<T> | undefined | Promise<Partial<T> | undefined>;
  /** 自定义只读态渲染 */
  render?: (value: unknown, row: T, rowIndex: number) => ReactNode;
}

/** 校验触发时机 */
export type ValidateTrigger = 'submit' | 'change';

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
  /** 虚拟滚动容器高度（px），默认 500 */
  scrollY?: number;
  /** 空数据提示文案，默认 '暂无数据' */
  emptyText?: string;
  /** 容器类名 */
  className?: string;
  /** 容器样式 */
  style?: React.CSSProperties;
}
