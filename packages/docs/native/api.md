# API 参考

## EditableTable Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `rowKey` | `keyof T & string` | — | 行唯一标识字段名（**必填**） |
| `columns` | `EditableColumn<T>[]` | — | 列定义（**必填**） |
| `dataSource` | `T[]` | — | 数据源（**必填**） |
| `onChange` | `(data: T[]) => void` | — | 数据变化回调 |
| `editableMode` | `'all' \| 'row'` | `'all'` | 编辑模式 |
| `onSubmit` | `(data: T[]) => void` | — | 提交回调，校验通过后触发 |
| `validateTrigger` | `'submit' \| 'change'` | `'submit'` | 校验触发时机 |
| `scrollY` | `number` | `500` | 虚拟滚动容器高度（px） |
| `emptyText` | `string` | `'暂无数据'` | 空数据提示文案 |
| `className` | `string` | — | 容器类名 |
| `style` | `CSSProperties` | — | 容器样式 |

## EditableColumn

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | — | 列标题（**必填**） |
| `dataIndex` | `keyof T & string` | — | 数据字段名（**必填**） |
| `width` | `number \| string` | `150` | 列宽 |
| `fixed` | `'left' \| 'right'` | — | 列固定方向 |
| `editable` | `boolean` | `true` | 是否可编辑 |
| `editRender` | `(props: EditRenderProps<T>) => ReactNode` | — | 自定义编辑态渲染 |
| `rules` | `Rule[]` | — | 校验规则 |
| `onFieldChange` | `(value: any, row: T) => Partial<T> \| undefined` | — | 字段联动回调 |
| `render` | `(value: any, row: T, rowIndex: number) => ReactNode` | — | 自定义只读态渲染 |

## EditRenderProps

| 属性 | 类型 | 说明 |
|------|------|------|
| `value` | `any` | 当前单元格的值 |
| `onChange` | `(value: any) => void` | 值变化回调 |
| `row` | `T` | 当前行完整数据 |
| `rowIndex` | `number` | 行索引 |
| `error` | `string \| undefined` | 校验错误信息 |

## Rule

| 属性 | 类型 | 说明 |
|------|------|------|
| `required` | `boolean` | 是否必填 |
| `validator` | `(value: any, row: T) => boolean \| string` | 自定义校验函数 |
| `message` | `string` | 校验失败错误信息 |

`validator` 返回值说明：
- `true`：校验通过
- `false`：校验失败，使用 `message` 作为错误信息
- `string`：校验失败，使用返回的字符串作为错误信息

## EditableTableInstance (ref)

| 方法 | 参数 | 说明 |
|------|------|------|
| `addRow` | `defaults?: Partial<T>` | 在末尾新增一行 |
| `removeRow` | `rowIndex: number` | 删除指定行 |
| `moveUp` | `rowIndex: number` | 上移指定行 |
| `moveDown` | `rowIndex: number` | 下移指定行 |
| `getData` | — | 获取当前数据 |
