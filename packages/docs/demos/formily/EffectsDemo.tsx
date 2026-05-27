import { createForm, onFieldValueChange } from '@formily/core';
import { FormProvider } from '@formily/react';
import { Input, Select, Switch, Button, App as AntApp } from 'antd';
import { FastTable } from '@react-editable-tables/formily';
import '@react-editable-tables/formily/style.css';

const typeOptions = [
  { label: '电子产品', value: 'electronic' },
  { label: '服装', value: 'clothing' },
  { label: '食品', value: 'food' },
];

const subTypeMap: Record<string, { label: string; value: string }[]> = {
  electronic: [
    { label: '手机', value: 'phone' },
    { label: '电脑', value: 'computer' },
    { label: '耳机', value: 'earphone' },
  ],
  clothing: [
    { label: '上衣', value: 'top' },
    { label: '裤子', value: 'pants' },
    { label: '鞋子', value: 'shoes' },
  ],
  food: [
    { label: '水果', value: 'fruit' },
    { label: '蔬菜', value: 'vegetable' },
    { label: '饮料', value: 'drink' },
  ],
};

const form = createForm({
  initialValues: {
    items: [
      { type: 'electronic', subType: 'phone', note: '新款', disabled: false },
      { type: undefined, subType: undefined, note: '', disabled: false },
    ],
  },
  effects() {
    // 类型变化 → 子类型选项联动 + 值清空
    onFieldValueChange('items.*.type', (field) => {
      const subTypes = subTypeMap[field.value] || [];
      form.setFieldState('items.*.subType', (state) => {
        state.component = [Select, { options: subTypes }];
        state.value = undefined;
      });
    });

    // 不可用开关 → 备注字段禁用联动
    onFieldValueChange('items.*.disabled', (field) => {
      form.setFieldState('items.*.note', (state) => {
        state.editable = !field.value;
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
              title: '类型',
              width: 150,
              render: () => (
                <FastTable.Field name="type">
                  <Select options={typeOptions} placeholder="请选择类型" />
                </FastTable.Field>
              ),
            },
            {
              title: '子类型',
              width: 150,
              render: () => (
                <FastTable.Field name="subType">
                  <Select options={[]} placeholder="请先选择类型" />
                </FastTable.Field>
              ),
            },
            {
              title: '备注',
              render: () => (
                <FastTable.Field name="note" parse={(e: any) => e?.target?.value ?? e}>
                  <Input placeholder="请输入备注" />
                </FastTable.Field>
              ),
            },
            {
              title: '不可用',
              width: 80,
              render: () => (
                <FastTable.Field name="disabled">
                  <Switch size="small" />
                </FastTable.Field>
              ),
            },
            {
              title: '操作',
              width: 80,
              render: ({ index, field }) => (
                <Button type="link" onClick={() => field.remove(index)}>
                  删除
                </Button>
              ),
            },
          ]}
          addText="添加"
          itemDefaultValue={{ type: undefined, subType: undefined, note: '', disabled: false }}
          min={1}
          pagination={false}
        />
      </FormProvider>
    </AntApp>
  );
}
