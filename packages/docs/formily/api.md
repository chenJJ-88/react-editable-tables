# API 参考

## FormilyEditableTable

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | 数组字段名，内部自动创建 ArrayField（**必填**） |
| `columns` | `IColumn[]` | — | 列定义（**必填**） |
| `addText` | `string` | `'添加'` | 添加按钮文案 |
| `itemDefaultValue` | `object` | `{}` | 每行默认值 |
| `hideAdd` | `boolean` | `false` | 隐藏添加按钮 |
| `max` | `number` | — | 最大行数，达到上限后隐藏添加按钮 |
| `min` | `number` | `0` | 最小行数，低于此数量不允许删除 |
| `pagination` | `false \| PaginationProps` | — | 分页配置，传 `false` 关闭分页 |
| `addButtonPosition` | `'top' \| 'bottom'` | `'bottom'` | 添加按钮位置 |
| `validateBeforeAdd` | `boolean` | `true` | 添加前校验已有行 |
| `addButtonProps` | `ButtonProps` | — | 透传给 antd Button 的属性 |
| `tableProps` | `TableProps` | — | 透传给 antd Table 的属性 |

## IColumn

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | 列标题 |
| `width` | `number \| string` | 列宽度 |
| `render` | `(opt: { index: number; field: ArrayField }) => ReactNode` | 自定义渲染 |
| `...` | `TableColumnProps` | 透传给 antd Table column |

列的 `render` 函数参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| `index` | `number` | 当前行索引 |
| `field` | `ArrayField` | 当前行对应的 [Formily](https://formilyjs.org/zh-CN) ArrayField 实例 |

`field` 常用方法：

| 方法 | 说明 |
|------|------|
| `field.remove(index)` | 删除指定行 |
| `field.push(value)` | 在末尾添加一行 |
| `field.move(from, to)` | 移动行 |
| `field.value` | 获取当前行数据 |

## FormilyEditableTable.Field

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | 字段名（**必填**） |
| `required` | `boolean` | 必填校验 |
| `rules` | `any` | 自定义校验规则（[Formily](https://formilyjs.org/zh-CN) 规则格式） |
| `editable` | `boolean` | `false` 时显示只读文本 |
| `format` | `(v: any) => any` | 转化表单值给控件的 value |
| `parse` | `(v: any) => any` | 转化控件的 onChange 值给表单 |
| `children` | `ReactElement` | antd 表单控件 |

### format / parse

`format` 和 `parse` 用于表单值与控件值之间的转换：

```tsx
// 示例：Select 的 value 是 string，但表单需要 number
<FormilyEditableTable.Field
  name="count"
  format={(v) => String(v)}    // number → string，给 Select 显示
  parse={(v) => Number(v)}     // string → number，存入表单
>
  <Select options={[{ label: '1', value: '1' }, { label: '2', value: '2' }]} />
</FormilyEditableTable.Field>
```

### Switch / Checkbox

FormilyEditableTable.Field 会自动检测 antd 的 `Switch` 和 `Checkbox` 组件，注入 `checked` 属性而非 `value`：

```tsx
// 无需特殊处理，直接使用
<FormilyEditableTable.Field name="enabled">
  <Switch />
</FormilyEditableTable.Field>
```


## 工具函数

### getRowPath

从字段实例中获取行级路径，用于行级联动时定位具体行。

```ts
import { getRowPath } from '@react-editable-tables/formily';

// field.address = "items.0.type"
const rowPath = getRowPath(field); // "items.0"
```

在 effects 中配合 `form.setFieldState` 使用，只影响当前行：

```tsx
onFieldValueChange('items.*.type', (field) => {
  const rowPath = getRowPath(field);
  form.setFieldState(`${rowPath}.subType`, (state) => {
    state.value = undefined;
  });
});
```

## 样式

样式已内联到 JS 中，导入 `@react-editable-tables/formily` 时自动注入，无需手动引入 CSS 文件。

样式使用 `fet-` 前缀，不会与项目现有样式冲突：

| 类名 | 说明 |
|------|------|
| `.fet-table` | 表格容器 |
| `.fet-operator` | 删除按钮 |
| `.fet-add` | 底部添加按钮 |
| `.fet-add-top` | 顶部添加按钮 |
| `.fet-field` | 单元格字段容器 |
| `.fet-error` | 校验错误信息 |
