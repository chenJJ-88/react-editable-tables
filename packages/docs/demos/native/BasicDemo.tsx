import { useState } from 'react';
import EditableTable, { type EditableColumn } from '@react-editable-tables/native';

interface User {
  id: string;
  name: string;
  age: number | undefined;
  gender: string;
}

const data: User[] = [
  { id: '1', name: '张三', age: 28, gender: 'male' },
  { id: '2', name: '李四', age: 24, gender: 'female' },
  { id: '3', name: '王五', age: 30, gender: 'male' },
];

const genderMap: Record<string, string> = { male: '男', female: '女' };

const columns: EditableColumn<User>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 140,
    fixed: 'left',
    rules: [{ required: true, message: '姓名不能为空' }],
    editRender: ({ value, onChange }) => (
      <input
        className="et-editor-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 120,
    editRender: ({ value, onChange }) => (
      <input
        className="et-editor-number"
        type="number"
        value={value ?? ''}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : undefined)
        }
      />
    ),
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 120,
    editRender: ({ value, onChange }) => (
      <select
        className="et-editor-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">请选择</option>
        <option value="male">男</option>
        <option value="female">女</option>
      </select>
    ),
    render: (value) => genderMap[value] ?? value,
  },
];

export default function BasicDemo() {
  const [dataSource, setDataSource] = useState(data);

  return (
    <EditableTable<User>
      rowKey="id"
      dataSource={dataSource}
      onChange={setDataSource}
      columns={columns}
      onSubmit={(d) => { console.log('提交数据：', d); alert(`提交成功！共${d.length}条`); }}
    />
  );
}
