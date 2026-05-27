import { useState } from 'react';
import EditableTable from '../../components/EditableTable';

interface User {
  id: string;
  name: string;
  age: number | undefined;
}

const data: User[] = [
  { id: '1', name: '张三', age: 28 },
  { id: '2', name: '李四', age: 24 },
];

export default function ThemeDemo() {
  const [dataSource, setDataSource] = useState(data);
  const [dark, setDark] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          className="et-btn et-btn-default"
          onClick={() => setDark(!dark)}
        >
          {dark ? '切换亮色' : '切换暗色'}
        </button>
      </div>
      <div
        className={dark ? 'dark-theme' : ''}
        style={{
          padding: dark ? 16 : 0,
          background: dark ? '#141414' : 'transparent',
          borderRadius: 8,
        }}
      >
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
              title: '年龄',
              dataIndex: 'age',
              width: 120,
              editRender: ({ value, onChange }) => (
                <input
                  className="et-editor-number"
                  type="number"
                  value={(value as number) ?? ''}
                  onChange={(e) =>
                    onChange(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              ),
            },
          ]}
          onSubmit={(d) => alert(`提交成功！共${d.length}条`)}
        />
      </div>
    </div>
  );
}
