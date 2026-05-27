import { useState } from 'react';
import EditableTable from '@react-editable-tables/native';

interface User {
  id: string;
  name: string;
  status: string;
  date: string;
}

const data: User[] = [
  { id: '1', name: '张三', status: 'active', date: '2025-01-01' },
  { id: '2', name: '李四', status: 'inactive', date: '' },
];

export default function CustomEditorDemo() {
  const [dataSource, setDataSource] = useState(data);

  return (
    <EditableTable<User>
      rowKey="id"
      dataSource={dataSource}
      onChange={setDataSource}
      columns={[
        {
          title: '姓名',
          dataIndex: 'name',
          width: 140,
          editRender: ({ value, onChange }) => (
            <input
              className="et-editor-input"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
            />
          ),
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 140,
          editRender: ({ value, onChange }) => (
            <select
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              style={{ width: '100%', padding: '4px 8px' }}
            >
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>
          ),
          render: (value: unknown) => (value === 'active' ? '启用' : '禁用'),
        },
        {
          title: '日期',
          dataIndex: 'date',
          width: 160,
          editRender: ({ value, onChange }) => (
            <input
              type="date"
              value={(value as string) ?? ''}
              onChange={(e) => onChange(e.target.value)}
              style={{ width: '100%', padding: '4px 8px' }}
            />
          ),
        },
      ]}
      onSubmit={(d) => { console.log('提交数据：', d); alert(`提交成功！共${d.length}条`); }}
    />
  );
}
