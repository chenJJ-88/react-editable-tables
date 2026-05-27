import { 
  createForm, 
  onFieldValueChange, 
  onFieldInit, 
  FormProvider, 
  FastTable 
} from '@react-editable-tables/formily';
import { Input, Select, Switch, Button, App as AntApp } from 'antd';

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
    // 字段初始化时：为已有 type 值的行设置子类型选项
    onFieldInit('items.*.type', (field) => {
      const subTypes = subTypeMap[(field as any).value] || [];
      const rowPath = field.address.toString().replace(/\.type$/, '');
      form.setFieldState(`${rowPath}.subType`, (state) => {
        state.data = { ...state.data, options: subTypes };
      });
    });

    // 类型变化 → 子类型选项联动 + 值清空（仅当前行）
    onFieldValueChange('items.*.type', (field) => {
      const subTypes = subTypeMap[(field as any).value] || [];
      const rowPath = field.address.toString().replace(/\.type$/, '');
      form.setFieldState(`${rowPath}.subType`, (state) => {
        state.data = { ...state.data, options: subTypes };
        state.value = undefined;
      });
    });

    // 不可用开关 → 备注字段禁用联动（仅当前行）
    onFieldValueChange('items.*.disabled', (field) => {
      const rowPath = field.address.toString().replace(/\.disabled$/, '');
      form.setFieldState(`${rowPath}.note`, (state) => {
        state.editable = !(field as any).value;
      });
    });
  },
});

export default function EffectsDemo() {
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
              title: '类型',
              width: 150,
              render: () => (
                <FastTable.Field name="type">
                  <Select options={typeOptions} placeholder="请选择类型" style={{ width: '100%' }} />
                </FastTable.Field>
              ),
            },
            {
              title: '子类型',
              width: 150,
              render: () => (
                <FastTable.Field name="subType">
                  <Select   placeholder="请先选择类型" style={{ width: '100%' }} />
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
        <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
          提交
        </Button>
      </FormProvider>
    </AntApp>
  );
}
