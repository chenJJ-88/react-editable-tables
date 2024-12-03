import { useEffect, useState } from 'react'
import { Card } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import Modal from './modal'
const baseColumns: TableListItem[] = [
  { title: '列1', dataIndex: 'col1', key: 'col1', parentsTitle: '组A', disabled: true },
  { title: '列2', dataIndex: 'col2', key: 'col2', parentsTitle: '组A' },
  { title: '列3', dataIndex: 'col3', key: 'col3', parentsTitle: '组B' },
  { title: '列4', dataIndex: 'col4', key: 'col4', parentsTitle: '组B' },
  { title: '列5', dataIndex: 'col5', key: 'col5', parentsTitle: '组C' },
  { title: '列6', dataIndex: 'col6', key: 'col6', parentsTitle: '组C' },
  { title: '列7', dataIndex: 'col7', key: 'col7', parentsTitle: '组D' },
  { title: '列8', dataIndex: 'col8', key: 'col8', parentsTitle: '组D' },
  { title: '列9', dataIndex: 'col9', key: 'col9', parentsTitle: '组A' },
  { title: '列10', dataIndex: 'col10', key: 'col10', parentsTitle: '组A' },
  { title: '列11', dataIndex: 'col11', key: 'col11', parentsTitle: '组B' },
  { title: '列12', dataIndex: 'col12', key: 'col12', parentsTitle: '组B' },
  { title: '列13', dataIndex: 'col13', key: 'col13', parentsTitle: '组C' },
  { title: '列14', dataIndex: 'col14', key: 'col14', parentsTitle: '组C' },
  { title: '列15', dataIndex: 'col15', key: 'col15', parentsTitle: '组D' },
  { title: '列16', dataIndex: 'col16', key: 'col16', parentsTitle: '组D' },
  { title: '列17', dataIndex: 'col17', key: 'col17', parentsTitle: '组A' },
  { title: '列18', dataIndex: 'col18', key: 'col18', parentsTitle: '组A' },
  { title: '列19', dataIndex: 'col19', key: 'col19', parentsTitle: '组B' },
  { title: '列20', dataIndex: 'col20', key: 'col20', parentsTitle: '组B' },
  { title: '列21', dataIndex: 'col21', key: 'col21', parentsTitle: '组C' },
  { title: '列22', dataIndex: 'col22', key: 'col22', parentsTitle: '组C' },
  { title: '列23', dataIndex: 'col23', key: 'col23', parentsTitle: '组D' },
  { title: '列24', dataIndex: 'col24', key: 'col24', parentsTitle: '组D' },
  { title: '列25', dataIndex: 'col25', key: 'col25', parentsTitle: '组A' },
  { title: '列26', dataIndex: 'col26', key: 'col26', parentsTitle: '组A' },
  { title: '列27', dataIndex: 'col27', key: 'col27', parentsTitle: '组B' },
  { title: '列28', dataIndex: 'col28', key: 'col28', parentsTitle: '组B' },
  { title: '列29', dataIndex: 'col29', key: 'col29', parentsTitle: '组C' },
  { title: '列30', dataIndex: 'col30', key: 'col30', parentsTitle: '组C', },
];
const dataSource = Array(2) // 假设有 10 行数据
  .fill(0)
  .map((_, index) => ({
    key: index,
    col1: `Data ${index + 1}`,
    col2: `Data ${index + 1}`,
    col3: `Data ${index + 1}`,
    col4: `Data ${index + 1}`,
    col5: `Data ${index + 1}`,
    col6: `Data ${index + 1}`,
    col7: `Data ${index + 1}`,
    col8: `Data ${index + 1}`,
    col9: `Data ${index + 1}`,
    col10: `Data ${index + 1}`,
    col11: `Data ${index + 1}`,
    col12: `Data ${index + 1}`,
    col13: `Data ${index + 1}`,
    col14: `Data ${index + 1}`,
    col15: `Data ${index + 1}`,
    col16: `Data ${index + 1}`,
    col17: `Data ${index + 1}`,
    col18: `Data ${index + 1}`,
    col19: `Data ${index + 1}`,
    col20: `Data ${index + 1}`,
    col21: `Data ${index + 1}`,
    col22: `Data ${index + 1}`,
    col23: `Data ${index + 1}`,
    col24: `Data ${index + 1}`,
    col25: `Data ${index + 1}`,
    col26: `Data ${index + 1}`,
    col27: `Data ${index + 1}`,
    col28: `Data ${index + 1}`,
    col29: `Data ${index + 1}`,
    col30: `Data ${index + 1}`,
  }));
export interface TableListItem extends ProColumns {
  isShow?: boolean;
  parentsTitle?: string;
  disabled?: boolean;
}
export default function App() {
  const [columns, setColumns] = useState<TableListItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const storedColumns = localStorage.getItem('selectedColumns');
    if (storedColumns) {
      const selectedKeys = JSON.parse(storedColumns);
      setColumns(baseColumns.map(col => ({
        ...col,
        isShow: selectedKeys.includes(col.title) || col.disabled
      })));
    } else {
      setColumns(baseColumns.map(col => ({
        ...col,
        isShow: true
      })));
    }
  }, []);
  const handleColumnsChange = (updatedColumns: TableListItem[]) => {
    setColumns(updatedColumns);
  };
  return (
    <Card title='表格options' bordered>
      <ProTable<TableListItem>
        options={false}
        toolBarRender={() => [<PieChartOutlined onClick={() => setIsModalOpen(true)} />]}
        search={false}
        columns={
          columns.filter((item: TableListItem) => item.isShow === true)
        }
        scroll={{ x: true }}
        dataSource={dataSource} />
      {
        isModalOpen && <Modal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          localStorageCode='selectedColumns'
          columns={columns}
          onColumnsChange={handleColumnsChange}
        ></Modal>
      }
    </Card>

  )
}
