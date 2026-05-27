# 从 Form.Table 迁移

如果你正在从 Formily 1.x 的 `Form.Table` 迁移到 `FastTable`，核心差异很小，通常只需改两处代码。

## 对比表

| | Form.Table (Formily 1.x) | FastTable (Formily 2.x) |
|---|---|---|
| 外层包裹 | `<Form>` | `<FormProvider>` |
| 表格写法 | `<Form.Field name="items"><Form.Table .../></Form.Field>` | `<FastTable name="items" ... />` |
| 单元格 | `<Form.Table.Field name="key">` | `<FastTable.Field name="key">` |
| 列 render 参数 | `{index, tableMutators}` | `{index, field}` |
| 删除行 | `tableMutators.remove(index)` | `field.remove(index)` |
| 添加行 | 自动（内置按钮） | 自动（内置按钮） |

## 迁移步骤

### 1. 外层从 Form 改为 FormProvider

```diff
- import { Form } from '@formily/react';
+ import { FormProvider } from '@formily/react';
+ import { createForm } from '@formily/core';

- <Form effects={() => { ... }}>
+ <FormProvider form={createForm({ effects() { ... } })}>
    ...
- </Form>
+ </FormProvider>
```

### 2. 表格从 Form.Table 改为 FastTable

```diff
+ import { FastTable } from '@react-editable-tables/formily';
+ import '@react-editable-tables/formily/src/style.css';

- <Form.Field name="items">
-   <Form.Table columns={[...]}>
-     <Form.Table.Field name="key">
-       <Input />
-     </Form.Table.Field>
-   </Form.Table>
- </Form.Field>

+ <FastTable
+   name="items"
+   columns={[{
+     title: '...',
+     render: () => (
+       <FastTable.Field name="key">
+         <Input />
+       </FastTable.Field>
+     ),
+   }]}
+   itemDefaultValue={{ key: '' }}
+ />
```

### 3. 列 render 参数从 tableMutators 改为 field

```diff
  {
    title: '操作',
-   render: ({ index, tableMutators }) => (
-     <Button onClick={() => tableMutators.remove(index)}>删除</Button>
+   render: ({ index, field }) => (
+     <Button onClick={() => field.remove(index)}>删除</Button>
    ),
  }
```

`field` 是 Formily 2.x 的 `ArrayField` 实例，方法比 `tableMutators` 更丰富，除了 `remove` 还支持 `push`、`move`、`unshift` 等。

## 常见问题

### effects 里的路径需要改吗？

不需要。`FastTable` 内部通过 `form.createField()` 注册了与 Formily 1.x 相同的路径结构，所以 `onFieldValueChange('items.*.name', ...)` 等 effects 可以直接复用。

### 校验规则需要改吗？

不需要。`FastTable.Field` 的 `required` 和 `rules` 与 Formily 1.x 的 `Form.Table.Field` 完全一致。

### 我可以混用 Form.Table 和 FastTable 吗？

可以，但需要注意 Formily 1.x 和 2.x 不能在同一个 `createForm` 中混用。建议逐步迁移，一个表单一个表单地替换。
