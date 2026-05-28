import { useState } from 'react';
import EditableTable, { type EditableColumn } from '@react-editable-tables/native';

interface User {
  id: string;
  name: string;
  age: number | undefined;
  email: string;
}

const data: User[] = [
  { id: '1', name: '张三', age: 28, email: 'zhangsan@example.com' },
  { id: '2', name: '', age: undefined, email: '' },
  { id: '3', name: '王五', age: 0, email: 'bad-email' },
];

const columns: EditableColumn<User>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 140,
    rules: [{ required: true, message: '姓名必填' }],
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
    width: 140,
    rules: [
      { required: true, message: '年龄必填' },
      { validator: (v) => v > 0, message: '年龄必须大于0' },
    ],
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
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
    rules: [
      {
        validator: (v) => {
          if (!v) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
            ? true
            : '邮箱格式不正确';
        },
        message: '',
      },
    ],
    editRender: ({ value, onChange }) => (
      <input
        className="et-editor-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
  },
];

export default function ValidationDemo() {
  const [dataSource, setDataSource] = useState(data);

  return (
    <EditableTable<User>
      rowKey="id"
      dataSource={dataSource}
      onChange={setDataSource}
      validateTrigger="change"
      columns={columns}
      onSubmit={(d) => { console.log('提交数据：', d); alert(`提交成功！共${d.length}条`); }}
    />
  );
}
