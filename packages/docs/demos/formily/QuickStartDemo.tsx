import { createForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import { Input, Select, Button, App as AntApp } from 'antd';
import { FastTable } from '@react-editable-tables/formily';
import '@react-editable-tables/formily/style.css';

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
  return (
    <AntApp>
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
          pagination={false}
        />
      </FormProvider>
    </AntApp>
  );
}
