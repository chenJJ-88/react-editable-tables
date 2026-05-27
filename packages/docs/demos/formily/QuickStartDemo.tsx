import { createForm, FormProvider, FastTable } from '@react-editable-tables/formily';
import { Input, Select, Button, App as AntApp } from 'antd';

const form = createForm({
  initialValues: {
    items: [
      { name: '项目 A', type: 'a' },
      { name: '项目 B', type: 'b' },
      { name: '', type: undefined },
    ],
  },
});

export default function QuickStartDemo() {
  const handleSubmit = async () => {
    try {
      await form.validate();
      console.log('提交数据：', JSON.stringify(form.values, null, 2));
    } catch {}
  };

  return (
    <AntApp>
      <FormProvider form={form}>
        <FastTable
          name="items"
          columns={[
            {
              title: '名称',
              render: () => (
                <FastTable.Field name="name" required parse={(e: any) => e?.target?.value ?? e}>
                  <Input />
                </FastTable.Field>
              ),
            },
            {
              title: '类型',
              render: () => (
                <FastTable.Field name="type">
                  <Select
                    options={[
                      { label: 'A 类', value: 'a' },
                      { label: 'B 类', value: 'b' },
                      { label: 'C 类', value: 'c' },
                    ]}
                  />
                </FastTable.Field>
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
          ]}
          addText="添加"
          itemDefaultValue={{ name: '', type: undefined }}
          min={1}
          max={5}
          pagination={false}
        />
        <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
          提交
        </Button>
      </FormProvider>
    </AntApp>
  );
}
