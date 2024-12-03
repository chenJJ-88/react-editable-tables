import { useState, useEffect, useMemo } from 'react'
import { Modal as AntdModal, Form, Checkbox, Button, Flex, Space } from 'antd'
import { TableListItem } from './App'
export default function Modal(
    {
        open,
        setOpen,
        columns,
        onColumnsChange,
        localStorageCode,
        resetColumns
    }:
        {
            open: boolean,
            setOpen: (open: boolean) => void,
            columns: TableListItem[],
            onColumnsChange: (columns: TableListItem[]) => void,
            localStorageCode: string
            resetColumns?: string[]
        }
) {
    const [form] = Form.useForm();

    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    console.log(selectedColumns);

    const parentTitles: (string | undefined)[] = [...new Set(columns.map((item: TableListItem) => item.parentsTitle))];

    useEffect(() => {
        // 初始化时选中所有显示的列和禁用的列
        setSelectedColumns(columns.filter((col: TableListItem) => col.isShow || col.disabled).map((col: TableListItem) => String(col.title)));
    }, [columns]);

    const handleParentChange = (parentTitle: string, checked: boolean) => {
        const childColumns = columns.filter((col: TableListItem) => col.parentsTitle === parentTitle && !col.disabled);
        setSelectedColumns((prev: string[]) => {
            const childKeys = childColumns.map((col: TableListItem) => col.title);
            const newSelection = checked
                ? [...new Set([...prev, ...childKeys.map(String)])]
                : prev.filter(key => !childKeys.map(String).includes(key));
            return [...new Set([...newSelection, ...columns.filter((col: TableListItem) => col.disabled).map((col: TableListItem) => String(col.title))])];
        });
    };

    const handleColumnChange = (key: string, checked: boolean) => {
        setSelectedColumns(prev =>
            checked
                ? [...prev, key]
                : prev.filter(k => k !== key)
        );
    };
    const getParentCheckboxStatus = (parentTitle: string) => {
        const childColumns = columns.filter((col: TableListItem) => col.parentsTitle === parentTitle && !col.disabled);
        const selectedChildColumns = childColumns.filter((col: TableListItem) => selectedColumns.includes(String(col.title)));
        if (selectedChildColumns.length === 0) return false;
        if (selectedChildColumns.length === childColumns.length) return true;
        return 'indeterminate';
    };

    const handleSubmit = () => {
        const updatedColumns = columns.map((col: TableListItem) => ({
            ...col,
            isShow: selectedColumns.includes(col.title as string) || col.disabled
        }));
        onColumnsChange(updatedColumns);
        localStorage.setItem(localStorageCode, JSON.stringify(selectedColumns));
        setOpen(false);
    };
    // 恢复默认
    const handleReset = () => {
        if (resetColumns) {
            setSelectedColumns(resetColumns);
        } else {
            const cols = columns.map((col: TableListItem) => String(col.title));
            setSelectedColumns(cols);
        }
    }

    const disabledRest = useMemo(() => {
        if (resetColumns) {
            return resetColumns.every((col: string, index: number) => (col === selectedColumns[index]))
        } else {
            const cols = columns.map((col: TableListItem) => String(col.title));
            return cols.every((col: string, index: number) => (col === selectedColumns[index]))
        }
    }, [resetColumns, columns, selectedColumns])

    const handleSelectAll = (checked: boolean) => {
        setSelectedColumns(checked
            ? columns.map((col: TableListItem) => String(col.title))
            : columns.filter((col: TableListItem) => col.disabled).map((col: TableListItem) => String(col.title)));
    }
    const indeterminateDelectAll = useMemo(() => {
        return columns.length !== selectedColumns.length && selectedColumns.length > 0
    }, [columns, selectedColumns])

    const isCheckedAll = useMemo(() => {
        return columns.length === selectedColumns.length
    }, [columns, selectedColumns])
    return (
        <AntdModal
            title="显示字段"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}

            width={1000}
        >
            <Form form={form}>
                <>
                    {parentTitles.filter((title): title is string => title !== undefined).map((parentTitle: string) => {
                        const groupColumns = columns.filter((column: TableListItem) => column.parentsTitle === parentTitle);
                        return (
                            <div key={parentTitle}>
                                <Form.Item>
                                    <Checkbox
                                        indeterminate={getParentCheckboxStatus(parentTitle) === 'indeterminate'}
                                        checked={getParentCheckboxStatus(parentTitle) === true}
                                        onChange={(e) => handleParentChange(parentTitle, e.target.checked)}
                                    >
                                        <div style={{ fontWeight: 'bold' }}>{parentTitle}</div>
                                    </Checkbox>
                                </Form.Item>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', }}>
                                    {groupColumns.map((column: TableListItem) => (
                                        <Form.Item key={String(column.title)}>
                                            <Checkbox
                                                disabled={column.disabled}
                                                checked={selectedColumns.includes(String(column.title))}
                                                onChange={(e) => handleColumnChange(String(column.title), e.target.checked)}
                                            >
                                                {String(column.title)}
                                            </Checkbox>
                                        </Form.Item>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    <Form.Item>
                        <Flex justify='space-between' align='center'>
                            <Checkbox
                                checked={isCheckedAll}
                                indeterminate={indeterminateDelectAll}
                                onChange={(e) => handleSelectAll(e.target.checked)}>全选</Checkbox>
                            <Space>
                                <Button type="link" onClick={handleReset} disabled={disabledRest}>恢复默认</Button>
                                <Button type="primary" onClick={handleSubmit}>确定</Button>
                                <Button type="default" onClick={() => setOpen(false)}>取消</Button>
                            </Space>
                        </Flex>
                    </Form.Item>
                </>

            </Form>
        </AntdModal>
    );
}
