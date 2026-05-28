# @react-editable-tables/formily

基于 Formily 2.x + antd 5.x 的可编辑表格，开箱即用，无需单独安装 Formily。

## 安装

```bash
npm install @react-editable-tables/formily
```

## 使用

```tsx
import { createForm, FormProvider, FormilyEditableTable } from '@react-editable-tables/formily';
import { Input, Button } from 'antd';

const form = createForm();

function App() {
  return (
    <FormProvider form={form}>
      <FormilyEditableTable
        name="items"
        columns={[
          {
            title: '名称',
            render: () => <FormilyEditableTable.Field name="name" required parse={(e: any) => e?.target?.value ?? e}><Input /></FormilyEditableTable.Field>,
          },
          {
            title: '操作',
            render: ({ index, field }) => (
              <Button type="link" onClick={() => field.remove(index)}>删除</Button>
            ),
          },
        ]}
        addText="添加"
        itemDefaultValue={{ name: '' }}
        min={1}
      />
    </FormProvider>
  );
}
```

## 特性

- 开箱即用：安装一个包即可，Formily API 已内置 re-export
- 完整 Formily effects 兼容（onFieldValueChange, form.setFieldState）
- 内置分页、新增/删除行、min/max 约束
- antd Table/Select/Input/Switch 集成
- columns 稳定化（ref-based valueLen）

## 文档

完整文档：https://chenjj-88.github.io/react-editable-tables/

## License

MIT
