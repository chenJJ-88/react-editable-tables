import EditableTable, { type EditableColumn } from '@react-editable-tables/native';
import { useState } from 'react';

interface Row {
    id: string;
    name: string;
    age: number | undefined;
    city: string;
    department: string;
    email: string;
    phone: string;
    salary: number | undefined;
    status: string;
    remark: string;
}

const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京'];
const departments = ['技术部', '产品部', '设计部', '市场部', '运营部', '财务部', '人事部'];
const statusMap: Record<string, string> = { active: '在职', inactive: '离职' };

function generateData(count: number): Row[] {
    const names = ['张', '李', '王', '赵', '刘', '陈', '杨', '黄', '周', '吴'];
    return Array.from({ length: count }, (_, i) => ({
        id: String(i + 1),
        name: `${names[i % names.length]}${String.fromCharCode(65 + (i % 26))}`,
        age: 22 + (i % 30),
        city: cities[i % cities.length],
        department: departments[i % departments.length],
        email: `user${i + 1}@example.com`,
        phone: `138${String(i).padStart(8, '0')}`,
        salary: 8000 + (i % 20) * 500,
        status: i % 2 === 0 ? 'active' : 'inactive',
        remark: i % 3 === 0 ? '重点关注' : '',
    }));
}

const data = generateData(500);

const columns: EditableColumn<Row>[] = [
    {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
        fixed: 'left',
        editRender: ({ value, onChange }) => (
            <input className="et-editor-input" value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
    {
        title: '年龄',
        dataIndex: 'age',
        width: 80,
        editRender: ({ value, onChange }) => (
            <input
                className="et-editor-number"
                type="number"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            />
        ),
    },
    {
        title: '城市',
        dataIndex: 'city',
        width: 100,
        editRender: ({ value, onChange }) => (
            <select className="et-editor-select" value={value} onChange={(e) => onChange(e.target.value)}>
                {cities.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>
        ),
    },
    {
        title: '部门',
        dataIndex: 'department',
        width: 100,
        editRender: ({ value, onChange }) => (
            <select className="et-editor-select" value={value} onChange={(e) => onChange(e.target.value)}>
                {departments.map((d) => (
                    <option key={d} value={d}>
                        {d}
                    </option>
                ))}
            </select>
        ),
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        width: 180,
        editRender: ({ value, onChange }) => (
            <input className="et-editor-input" value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        width: 140,
        editRender: ({ value, onChange }) => (
            <input className="et-editor-input" value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
    {
        title: '薪资',
        dataIndex: 'salary',
        width: 100,
        editRender: ({ value, onChange }) => (
            <input
                className="et-editor-number"
                type="number"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            />
        ),
    },
    {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
        editRender: ({ value, onChange }) => (
            <input className="et-editor-input" value={value} onChange={(e) => onChange(e.target.value)} />
        ),
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 80,
        editRender: ({ value, onChange }) => (
            <select className="et-editor-select" value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="active">在职</option>
                <option value="inactive">离职</option>
            </select>
        ),
        render: (value) => statusMap[value] ?? value,
    },
    {
        title: '操作',
        dataIndex: 'id',
        width: 80,
        fixed: 'right',
        editable: false,
        render: (value) => <a href="javascript:void(0)">详情</a>,
    },
];

export default function LargeScrollDemo() {
    const [dataSource, setDataSource] = useState(data);

    return (
        <div>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
                500 行 × 10 列，虚拟滚动 + 横向滚动，姓名列左侧固定，操作列右侧固定
            </p>
            <EditableTable<Row>
                rowKey="id"
                dataSource={dataSource}
                onChange={setDataSource}
                columns={columns}
                onSubmit={(d) => {
                    console.log('提交数据：', d);
                    alert(`提交成功！共${d.length}条`);
                }}
                scrollY={500}
            />
        </div>
    );
}
