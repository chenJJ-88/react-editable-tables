import { createForm, FormProvider, FormilyEditableTable } from '@react-editable-tables/formily';
import type { IColumn } from '@react-editable-tables/formily';
import { Input, Select, Button } from 'antd';

const departments = ['技术部', '产品部', '设计部', '市场部', '运营部', '财务部', '人事部'];
const deptOptions = departments.map((d) => ({ label: d, value: d }));

function generateItems(count: number) {
  const names = ['张', '李', '王', '赵', '刘', '陈', '杨', '黄', '周', '吴'];
  return Array.from({ length: count }, (_, i) => ({
    name: `${names[i % names.length]}${String.fromCharCode(65 + (i % 26))}`,
    age: String(22 + (i % 30)),
    department: departments[i % departments.length],
  }));
}

const form = createForm({
  initialValues: {
    items: generateItems(500),
  },
});

const columns: IColumn[] = [
  {
    title: '姓名',
    render: () => (
      <FormilyEditableTable.Field name="name" required parse={(e: any) => e?.target?.value ?? e}>
        <Input />
      </FormilyEditableTable.Field>
    ),
  },
  {
    title: '年龄',
    render: () => (
      <FormilyEditableTable.Field name="age" parse={(e: any) => e?.target?.value ?? e}>
        <Input type="number" />
      </FormilyEditableTable.Field>
    ),
  },
  {
    title: '部门',
    render: () => (
      <FormilyEditableTable.Field name="department">
        <Select options={deptOptions} />
      </FormilyEditableTable.Field>
    ),
  },
  {
    title: '操作',
    render: ({ index, field }) => (
      <Button type="link" onClick={() => field.remove(index)}>
        删除
      </Button>
    ),
  },
];

export default function LargeDataDemo() {
  const handleSubmit = async () => {
    try {
      await form.validate();
      console.log('提交数据：', JSON.stringify(form.values, null, 2));
    } catch {}
  };

  return (
    <FormProvider form={form}>
      <FormilyEditableTable
        name="items"
        columns={columns}
        addText="添加"
        itemDefaultValue={{ name: '', age: '', department: undefined }}
        min={1}
        pagination={{ pageSize: 20 }}
      />
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
        提交
      </Button>
    </FormProvider>
  );
}
