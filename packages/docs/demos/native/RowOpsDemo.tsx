import { useRef, useState } from 'react';
import EditableTable, { type EditableColumn, type EditableTableInstance } from '@react-editable-tables/native';

interface User {
  id: string;
  name: string;
  age: number | undefined;
}

let nextId = 100;
const data: User[] = [
  { id: '1', name: '张三', age: 28 },
  { id: '2', name: '李四', age: 24 },
  { id: '3', name: '王五', age: 30 },
];

export default function RowOpsDemo() {
  const [dataSource, setDataSource] = useState(data);
  const tableRef = useRef<EditableTableInstance<User>>(null);

  const columns: EditableColumn<User>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 140,
      fixed: 'left',
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
      title: '操作',
      dataIndex: 'id',
      width: 200,
      editable: false,
      fixed: 'right',
      render: (_value, _row, rowIndex) => (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button
            type="button"
            className="et-btn et-btn-link"
            disabled={rowIndex === 0}
            onClick={() => tableRef.current?.moveUp(rowIndex)}
          >
            上移
          </button>
          <button
            type="button"
            className="et-btn et-btn-link"
            disabled={
              rowIndex === (tableRef.current?.getData().length ?? 0) - 1
            }
            onClick={() => tableRef.current?.moveDown(rowIndex)}
          >
            下移
          </button>
          <button
            type="button"
            className="et-btn et-btn-link et-ops-delete"
            onClick={() => tableRef.current?.removeRow(rowIndex)}
          >
            删除
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          className="et-btn et-btn-primary"
          onClick={() =>
            tableRef.current?.addRow({
              id: String(nextId++),
              name: '',
              age: undefined,
            })
          }
        >
          + 新增行
        </button>
      </div>
      <EditableTable<User>
        ref={tableRef}
        rowKey="id"
        dataSource={dataSource}
        onChange={setDataSource}
        columns={columns}
        onSubmit={(d) => { console.log('提交数据：', d); alert(`提交成功！共${d.length}条`); }}
      />
    </div>
  );
}
