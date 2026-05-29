import type { IColumn } from '@react-editable-tables/formily';
import { createForm, FormilyEditableTable, FormProvider } from '@react-editable-tables/formily';
import { Button, Input, Select } from 'antd';

const form = createForm({
    initialValues: {
        items: [
            { name: '项目 A', type: 'a' },
            { name: '项目 B', type: 'b' },
            { name: '', type: undefined },
        ],
    },
});

const columns: IColumn[] = [
    {
        title: '名称',
        render: () => (
            <FormilyEditableTable.Field name="name" required parse={(e: any) => e?.target?.value ?? e}>
                <Input />
            </FormilyEditableTable.Field>
        ),
    },
    {
        title: '类型',
        render: () => (
            <FormilyEditableTable.Field name="type">
                <Select
                    options={[
                        { label: 'A 类', value: 'a' },
                        { label: 'B 类', value: 'b' },
                        { label: 'C 类', value: 'c' },
                    ]}
                />
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

export default function QuickStartDemo() {
    const handleSubmit = async () => {
        try {
            await form.validate();
            console.log('提交数据：', JSON.stringify(form.values, null, 2));
        } catch { }
    };

    return (
        <FormProvider form={form}>
            <FormilyEditableTable
                name="items"
                columns={columns}
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
    );
}
