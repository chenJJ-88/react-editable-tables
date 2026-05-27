import { createForm, onFieldValueChange } from '@formily/core';
import { FormProvider } from '@formily/react';
import { Input, Select, Button, App as AntApp } from 'antd';
import { FastTable } from '@react-editable-tables/formily';
import '@react-editable-tables/formily/style.css';

const countryOptions = [
  { label: '中国', value: 'china' },
  { label: '美国', value: 'usa' },
  { label: '日本', value: 'japan' },
];

const cityMap: Record<string, { label: string; value: string }[]> = {
  china: [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
  ],
  usa: [
    { label: '纽约', value: 'newyork' },
    { label: '洛杉矶', value: 'losangeles' },
  ],
  japan: [
    { label: '东京', value: 'tokyo' },
    { label: '大阪', value: 'osaka' },
  ],
};

const form = createForm({
  initialValues: {
    items: [
      { country: 'china', city: 'beijing', note: '首都' },
      { country: undefined, city: undefined, note: '' },
    ],
  },
  effects() {
    onFieldValueChange('items.*.country', (field) => {
      form.setFieldState('items.*.city', (state) => {
        const cities = cityMap[field.value] || [];
        state.component = [Select, { options: cities }];
      });
    });
  },
});

export default function EffectsDemo() {
  return (
    <AntApp>
      <FormProvider form={form}>
        <FastTable
          name="items"
          columns={[
            {
              title: '国家',
              render: () => (
                <FastTable.Field name="country">
                  <Select options={countryOptions} placeholder="请选择国家" />
                </FastTable.Field>
              ),
            },
            {
              title: '城市',
              render: () => (
                <FastTable.Field name="city">
                  <Select options={[]} placeholder="请先选择国家" />
                </FastTable.Field>
              ),
            },
            {
              title: '备注',
              render: () => (
                <FastTable.Field name="note" parse={(e: any) => e?.target?.value ?? e}>
                  <Input />
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
          itemDefaultValue={{ country: undefined, city: undefined, note: '' }}
          min={1}
          pagination={false}
        />
      </FormProvider>
    </AntApp>
  );
}
