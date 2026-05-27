import { useState } from 'react';
import EditableTable from '../../components/EditableTable';

interface User {
  id: string;
  name: string;
  age: number | undefined;
  gender: string;
}

const data: User[] = [
  { id: '1', name: '张三', age: 28, gender: 'male' },
  { id: '2', name: '李四', age: 24, gender: 'female' },
];

const genderMap: Record<string, string> = { male: '男', female: '女' };

export default function EditModeDemo() {
  const [mode, setMode] = useState<'all' | 'row'>('all');
  const [dataSource, setDataSource] = useState(data);

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <button
          type="button"
          className={`et-btn ${mode === 'all' ? 'et-btn-primary' : 'et-btn-default'}`}
          onClick={() => setMode('all')}
        >
          全量编辑
        </button>
        <button
          type="button"
          className={`et-btn ${mode === 'row' ? 'et-btn-primary' : 'et-btn-default'}`}
          onClick={() => setMode('row')}
        >
          行编辑
        </button>
      </div>
      <EditableTable<User>
        rowKey="id"
        dataSource={dataSource}
        onChange={setDataSource}
        editableMode={mode}
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
            title: '年龄',
            dataIndex: 'age',
            width: 120,
            editRender: ({ value, onChange }) => (
              <input
                className="et-editor-number"
                type="number"
                value={(value as number) ?? ''}
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
                value={value as string}
                onChange={(e) => onChange(e.target.value)}
              >
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            ),
            render: (value) => genderMap[value as string] ?? value,
          },
        ]}
        onSubmit={(d) => alert(`提交成功！共${d.length}条`)}
      />
    </div>
  );
}
