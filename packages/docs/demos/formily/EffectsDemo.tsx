import {
  createForm,
  onFieldValueChange,
  onFieldInit,
  FormProvider,
  FormilyEditableTable,
  getRowPath
} from '@react-editable-tables/formily';
import type { IColumn } from '@react-editable-tables/formily';
import { Input, Select, Switch, Button } from 'antd';

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
    onFieldInit('items.*.type', (field) => {
      const subTypes = subTypeMap[(field as any).value] || [];
      const rowPath = getRowPath(field);
      form.setFieldState(`${rowPath}.subType`, (state) => {
        state.data = { ...state.data, options: subTypes };
      });
    });

    onFieldValueChange('items.*.type', (field) => {
      const subTypes = subTypeMap[(field as any).value] || [];
      const rowPath = getRowPath(field);
      form.setFieldState(`${rowPath}.subType`, (state) => {
        state.data = { ...state.data, options: subTypes };
        state.value = undefined;
      });
    });

    onFieldValueChange('items.*.disabled', (field) => {
      const rowPath = getRowPath(field);
      form.setFieldState(`${rowPath}.note`, (state) => {
        state.editable = !(field as any).value;
      });
    });
  },
});

const columns: IColumn[] = [
  {
    title: '类型',
    width: 150,
    render: () => (
      <FormilyEditableTable.Field name="type">
        <Select options={typeOptions} placeholder="请选择类型" style={{ width: '100%' }} />
      </FormilyEditableTable.Field>
    ),
  },
  {
    title: '子类型',
    width: 150,
    render: () => (
      <FormilyEditableTable.Field name="subType">
        <Select placeholder="请先选择类型" style={{ width: '100%' }} />
      </FormilyEditableTable.Field>
    ),
  },
  {
    title: '备注',
    render: () => (
      <FormilyEditableTable.Field name="note" parse={(e: any) => e?.target?.value ?? e}>
        <Input placeholder="请输入备注" />
      </FormilyEditableTable.Field>
    ),
  },
  {
    title: '不可用',
    width: 80,
    render: () => (
      <FormilyEditableTable.Field name="disabled">
        <Switch size="small" />
      </FormilyEditableTable.Field>
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
];

export default function EffectsDemo() {
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
        itemDefaultValue={{ type: undefined, subType: undefined, note: '', disabled: false }}
        min={1}
        pagination={false}
      />
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
        提交
      </Button>
    </FormProvider>
  );
}
