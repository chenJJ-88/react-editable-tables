import type { IColumn } from '@react-editable-tables/formily';
import { createForm, FormilyEditableTable, FormProvider } from '@react-editable-tables/formily';
import { Button, Input, InputNumber, Select } from 'antd';

const departments = ['技术部', '产品部', '设计部', '市场部', '运营部'];
const deptOptions = departments.map((d) => ({ label: d, value: d }));

function generateItems(count: number) {
    const names = ['张', '李', '王', '赵', '刘', '陈', '杨', '黄', '周', '吴'];
    return Array.from({ length: count }, (_, i) => ({
        name: `${names[i % names.length]}${String.fromCharCode(65 + (i % 26))}`,
        age: 22 + (i % 30),
        department: departments[i % departments.length],
        salary: 8000 + (i % 10) * 1000,
        remark: '',
    }));
}

const form = createForm({
    initialValues: { items: generateItems(500) },
});

const columns: IColumn[] = [
    {
        title: '序号',
        key: '__index',
        dataIndex: '__index',
        width: 60,
        fixed: 'left',
        render: ({ index }) => <span style={{ color: '#999' }}>{index + 1}</span>,
    },
    {
        title: '姓名',
        width: 120,
        render: () => (
            <FormilyEditableTable.Field name="name" required parse={(e: any) => e?.target?.value ?? e}>
                <Input />
            </FormilyEditableTable.Field>
        ),
    },
    {
        title: '年龄',
        width: 100,
        render: () => (
            <FormilyEditableTable.Field name="age">
                <InputNumber style={{ width: '100%' }} min={1} max={100} />
            </FormilyEditableTable.Field>
        ),
    },
    {
        title: '部门',
        width: 130,
        render: () => (
            <FormilyEditableTable.Field name="department">
                <Select options={deptOptions} style={{ width: '100%' }} />
            </FormilyEditableTable.Field>
        ),
    },
    {
        title: '薪资',
        width: 130,
        render: () => (
            <FormilyEditableTable.Field name="salary">
                <InputNumber style={{ width: '100%' }} min={0} step={1000} />
            </FormilyEditableTable.Field>
        ),
    },
    {
        title: '备注',
        width: 120,
        render: () => (
            <FormilyEditableTable.Field name="remark" parse={(e: any) => e?.target?.value ?? e}>
                <Input />
            </FormilyEditableTable.Field>
        ),
    },
    {
        title: '操作',
        key: '__ops',
        dataIndex: '__ops',
        width: 80,
        fixed: 'right',
        render: ({ index, field }) => (
            <Button type="link" danger onClick={() => field.remove(index)}>
                删除
            </Button>
        ),
    },
];

export default function VirtualScrollDemo() {
    const handleSubmit = async () => {
        try {
            await form.validate();
            console.log('提交数据：', form.values);
        } catch { }
    };

    return (
        <FormProvider form={form}>
            <FormilyEditableTable
                name="items"
                columns={columns}
                addText="添加行"
                itemDefaultValue={{ name: '', age: 25, department: undefined, salary: 8000, remark: '' }}
                min={1}
                pagination={{ pageSize: 50, showSizeChanger: true, pageSizeOptions: [20, 50, 100] }}
                tableProps={{
                    bordered: true,
                    scroll: { x: 'max-content' },
                }}
            />
            <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
                提交
            </Button>
        </FormProvider>
    );
}
