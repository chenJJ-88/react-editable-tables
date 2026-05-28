import { memo } from 'react';
import type { EditableColumn } from '../../types/table';

interface TableCellProps<T> {
    value: unknown;
    editable: boolean;
    column: EditableColumn<T>;
    error?: string;
    rowIndex: number;
    row: T;
    onChange: (value: unknown) => void;
}

function TableCell<T extends object>({ value, editable, column, error, rowIndex, row, onChange }: TableCellProps<T>) {
    // 只读态
    if (!editable) {
        if (column.render) {
            return <div className="et-cell-text">{column.render(value, row, rowIndex)}</div>;
        }
        return <div className="et-cell-text">{String(value ?? '')}</div>;
    }

    // 编辑态
    return (
        <div className={`et-cell-editable${error ? ' et-cell-error' : ''}`}>
            {column.editRender?.({ value, onChange, row, rowIndex, error })}
            {error && <div className="et-cell-error-msg">{error}</div>}
        </div>
    );
}

export default memo(TableCell, (prev, next) => {
    return (
        prev.value === next.value &&
        prev.editable === next.editable &&
        prev.error === next.error &&
        prev.rowIndex === next.rowIndex &&
        prev.row === next.row &&
        prev.column.dataIndex === next.column.dataIndex
    );
}) as typeof TableCell;
