# @react-editable-tables/formily

高性能可编辑表格组件，基于 Formily 2.x + antd 5.x。

通过 CellBridge 方案将 Formily Field 订阅数从 N×M 降为 N（仅行级别），配合 React.memo 和 columns 稳定化，解决 20+ 列 × 100+ 行场景下的卡顿问题。

## 安装

```bash
npm install @react-editable-tables/formily
```

Peer dependencies：

```bash
npm install react react-dom antd @formily/core @formily/react
```

## 快速开始

```tsx
import React from 'react';
import { createForm, onFieldValueChange } from '@formily/core';
import { FormProvider } from '@formily/react';
import { Input, Select, Button } from 'antd';
import { FastTable } from '@react-editable-tables/formily';
import '@react-editable-tables/formily/src/style.css';

const form = createForm({
    effects() {
        onFieldValueChange('items.*.type', (field) => {
            // 联动逻辑
        });
    },
});

export default () => (
    <FormProvider form={form}>
        <FastTable
            name="items"
            columns={[
                {
                    title: '名称',
                    render: () => (
                        <FastTable.Field name="name" required>
                            <Input />
                        </FastTable.Field>
                    ),
                },
                {
                    title: '类型',
                    render: () => (
                        <FastTable.Field name="type">
                            <Select options={[{label: 'A', value: 'a'}]} />
                        </FastTable.Field>
                    ),
                },
                {
                    title: '操作',
                    render: ({ index, field }) => (
                        <Button type="link" onClick={() => field.remove(index)}>删除</Button>
                    ),
                },
            ]}
            addText="添加"
            itemDefaultValue={{ name: '', type: undefined }}
            min={1}
        />
    </FormProvider>
);
```

## 与 Form.Table 对比

| | Form.Table (Formily 1.x) | FastTable (Formily 2.x) |
|---|---|---|
| 外层包裹 | `<Form>` | `<FormProvider>` |
| 表格写法 | `<Form.Field name="items"><Form.Table .../></Form.Field>` | `<FastTable name="items" ... />` |
| 单元格 | `<Form.Table.Field name="key">` | `<FastTable.Field name="key">` |
| 列 render 参数 | `{index, tableMutators}` | `{index, field}` |
| 删除行 | `tableMutators.remove(index)` | `field.remove(index)` |
| 添加行 | 自动（内置按钮） | 自动（内置按钮） |

**核心差异仅两点**：
1. 外层从 `<Form>` 改为 `<FormProvider>`（Formily 2.x 的标准用法）
2. 列 render 的 `tableMutators` 改为 `field`（ArrayField 实例，方法更丰富）

## API

### FastTable

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | - | 数组字段名，内部自动创建 ArrayField |
| columns | IColumn[] | - | 列定义 |
| addText | string | '添加' | 添加按钮文案 |
| itemDefaultValue | object | {} | 每行默认值 |
| hideAdd | boolean | false | 隐藏添加按钮 |
| max | number | - | 最大行数 |
| min | number | 0 | 最小行数 |
| pagination | false \| PaginationProps | - | 分页配置 |
| addButtonPosition | 'top' \| 'bottom' | 'bottom' | 添加按钮位置 |
| validateBeforeAdd | boolean | true | 添加前校验已有行 |
| addButtonProps | ButtonProps | - | 添加按钮属性 |
| tableProps | TableProps | - | antd Table 其他 props |

### IColumn

| Prop | Type | Description |
|------|------|-------------|
| title | ReactNode | 列标题 |
| width | number \| string | 列宽度 |
| render | (opt: {index, field}) => ReactNode | 自定义渲染 |
| ... | TableColumnProps | 透传给 antd Table column |

### FastTable.Field

| Prop | Type | Description |
|------|------|-------------|
| name | string | 字段名 |
| required | boolean | 必填校验 |
| rules | any | 自定义校验规则 |
| editable | boolean | false 时显示只读文本 |
| format | (v) => any | 转化表单值给控件的 value |
| parse | (v) => any | 转化控件的 onChange 值给表单 |
| children | ReactElement | antd 表单控件 |

## 性能优化原理

| 优化点 | 原理 | 效果 |
|--------|------|------|
| CellBridge | 单元格不创建 Formily Field，从行级 field.value 读取 | 订阅数 N×M → N |
| columns 稳定化 | valueLen 用 ref，不作为 useMemo 依赖 | 行增删不重建列 |
| React.memo | CellRenderer 自定义比较，只有值/错误变化才重渲染 | 同行其他单元格不受影响 |

## Effects 兼容

FastTable.Field 通过 `form.createField()` 注册单元格路径，`form.setFieldState()` 触发 `onFieldValueChange`，以下 effects 正常工作：

```tsx
createForm({
    effects() {
        // 监听单元格值变化
        onFieldValueChange('items.*.name', (field) => { ... });

        // 联动：通过 form.setFieldState 设置 props
        onFieldValueChange('items.*.type', (field) => {
            form.setFieldState('items.*.subType', (state) => {
                state.component = [Select, { options: getOptions(field.value) }];
            });
        });
    },
});
```

## License

MIT
