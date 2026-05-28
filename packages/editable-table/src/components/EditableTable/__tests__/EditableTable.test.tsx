/**
 * Integration tests for EditableTable
 *
 * Conventions used here:
 *  - Chinese labels (保存/取消/编辑/提交) match the component's own button text.
 *  - `userEvent` is used for realistic interactions; `fireEvent` only where needed.
 */
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import EditableTable, { type EditableColumn, type EditableTableInstance } from '../index';

// ---------------------------------------------------------------------------
// Test data types
// ---------------------------------------------------------------------------

interface Person {
    id: string;
    name: string;
    age: number | string;
}

const DATA: Person[] = [
    { id: '1', name: '张三', age: 28 },
    { id: '2', name: '李四', age: 32 },
];

const BASE_COLUMNS: EditableColumn<Person>[] = [
    {
        title: '姓名',
        dataIndex: 'name',
        editRender: ({ value, onChange }) => (
            <input
                aria-label="name-input"
                value={String(value ?? '')}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        title: '年龄',
        dataIndex: 'age',
        editRender: ({ value, onChange }) => (
            <input
                aria-label="age-input"
                value={String(value ?? '')}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderAllMode(overrides: Partial<Parameters<typeof EditableTable<Person>>[0]> = {}) {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const utils = render(
        <EditableTable<Person>
            rowKey="id"
            columns={BASE_COLUMNS}
            dataSource={DATA}
            editableMode="all"
            onChange={onChange}
            onSubmit={onSubmit}
            {...overrides}
        />,
    );
    return { ...utils, onChange, onSubmit };
}

function renderRowMode(overrides: Partial<Parameters<typeof EditableTable<Person>>[0]> = {}) {
    const onChange = vi.fn();
    const utils = render(
        <EditableTable<Person>
            rowKey="id"
            columns={BASE_COLUMNS}
            dataSource={DATA}
            editableMode="row"
            onChange={onChange}
            {...overrides}
        />,
    );
    return { ...utils, onChange };
}

// ---------------------------------------------------------------------------
// 1. Renders table with data
// ---------------------------------------------------------------------------

describe('renders table with data', () => {
    it('renders column headers', () => {
        renderAllMode();
        expect(screen.getByText('姓名')).toBeInTheDocument();
        expect(screen.getByText('年龄')).toBeInTheDocument();
    });

    it('renders the correct number of data rows', () => {
        renderAllMode();
        // Each row has a name-input pre-filled with the value
        const nameInputs = screen.getAllByLabelText('name-input');
        expect(nameInputs).toHaveLength(DATA.length);
    });

    it('shows pre-filled values in inputs (all mode)', () => {
        renderAllMode();
        const nameInputs = screen.getAllByLabelText('name-input') as HTMLInputElement[];
        expect(nameInputs[0].value).toBe('张三');
        expect(nameInputs[1].value).toBe('李四');
    });

    it('shows empty-text when dataSource is empty', () => {
        renderAllMode({ dataSource: [] });
        expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// 2. 'all' mode — editRender renders and onChange fires
// ---------------------------------------------------------------------------

describe("'all' mode", () => {
    it('renders editRender controls for every cell', () => {
        renderAllMode();
        expect(screen.getAllByLabelText('name-input')).toHaveLength(DATA.length);
        expect(screen.getAllByLabelText('age-input')).toHaveLength(DATA.length);
    });

    it('fires onChange with updated data when user types in a cell', async () => {
        const { onChange } = renderAllMode();
        const nameInputs = screen.getAllByLabelText('name-input');

        await userEvent.clear(nameInputs[0]);
        await userEvent.type(nameInputs[0], '王五');

        // onChange should have been called; last call should contain updated name
        expect(onChange).toHaveBeenCalled();
        const lastCall: Person[] = onChange.mock.calls[onChange.mock.calls.length - 1][0];
        expect(lastCall[0].name).toBe('王五');
    });

    it('fires onSubmit with data when submit button is clicked (no validation errors)', async () => {
        const { onSubmit } = renderAllMode({ validateTrigger: 'submit' });
        const submitBtn = screen.getByRole('button', { name: '提交' });
        await userEvent.click(submitBtn);
        expect(onSubmit).toHaveBeenCalledOnce();
        const submitted: Person[] = onSubmit.mock.calls[0][0];
        expect(submitted).toHaveLength(DATA.length);
    });
});

// ---------------------------------------------------------------------------
// 3. 'row' mode — edit / save / cancel flow
// ---------------------------------------------------------------------------

describe("'row' mode", () => {
    it('renders 操作 header column', () => {
        renderRowMode();
        expect(screen.getByText('操作')).toBeInTheDocument();
    });

    it('shows 编辑 button for each row initially', () => {
        renderRowMode();
        expect(screen.getAllByRole('button', { name: '编辑' })).toHaveLength(DATA.length);
    });

    it('switches to save/cancel buttons when 编辑 is clicked', async () => {
        renderRowMode();
        const editBtns = screen.getAllByRole('button', { name: '编辑' });
        await userEvent.click(editBtns[0]);

        expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
    });

    it('renders editRender controls while a row is in edit mode', async () => {
        renderRowMode();
        const editBtns = screen.getAllByRole('button', { name: '编辑' });
        await userEvent.click(editBtns[0]);

        expect(screen.getAllByLabelText('name-input')).toHaveLength(1);
    });

    it('saves changes and returns to read mode on 保存 click', async () => {
        const { onChange } = renderRowMode();
        const editBtns = screen.getAllByRole('button', { name: '编辑' });
        await userEvent.click(editBtns[0]);

        const nameInput = screen.getByLabelText('name-input');
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, '赵六');

        await userEvent.click(screen.getByRole('button', { name: '保存' }));

        // Back to read mode — no more save button
        expect(screen.queryByRole('button', { name: '保存' })).not.toBeInTheDocument();
        expect(onChange).toHaveBeenCalled();
    });

    it('restores original data on 取消 click', async () => {
        renderRowMode();
        const editBtns = screen.getAllByRole('button', { name: '编辑' });
        await userEvent.click(editBtns[0]);

        const nameInput = screen.getByLabelText('name-input');
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, '临时名字');

        await userEvent.click(screen.getByRole('button', { name: '取消' }));

        // Back to read mode — original value still displayed
        expect(screen.queryByRole('button', { name: '取消' })).not.toBeInTheDocument();
        // The cell reverts to the original text (read-only display)
        expect(screen.getByText('张三')).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// 4. Validation shows error messages
// ---------------------------------------------------------------------------

describe('validation', () => {
    const COLUMNS_WITH_RULES: EditableColumn<Person>[] = [
        {
            title: '姓名',
            dataIndex: 'name',
            rules: [{ required: true, message: '姓名为必填项' }],
            editRender: ({ value, onChange, error }) => (
                <div>
                    <input
                        aria-label="name-input"
                        value={String(value ?? '')}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {error && <span role="alert">{error}</span>}
                </div>
            ),
        },
    ];

    it('shows validation error when required field is empty and submit is clicked', async () => {
        render(
            <EditableTable<Person>
                rowKey="id"
                columns={COLUMNS_WITH_RULES}
                dataSource={[{ id: '1', name: '', age: '' }]}
                editableMode="all"
                validateTrigger="submit"
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: '提交' }));

        expect(await screen.findAllByRole('alert')).not.toHaveLength(0);
        expect(screen.getByText('姓名为必填项')).toBeInTheDocument();
    });

    it('shows validation error on change when validateTrigger is change', async () => {
        render(
            <EditableTable<Person>
                rowKey="id"
                columns={COLUMNS_WITH_RULES}
                dataSource={[{ id: '1', name: 'Alice', age: 20 }]}
                editableMode="all"
                validateTrigger="change"
            />,
        );

        const nameInput = screen.getByLabelText('name-input');
        // Clear the field to trigger required validation
        await userEvent.clear(nameInput);

        expect(await screen.findByText('姓名为必填项')).toBeInTheDocument();
    });

    it('does not call onSubmit when validation fails', async () => {
        const onSubmit = vi.fn();
        render(
            <EditableTable<Person>
                rowKey="id"
                columns={COLUMNS_WITH_RULES}
                dataSource={[{ id: '1', name: '', age: '' }]}
                editableMode="all"
                validateTrigger="submit"
                onSubmit={onSubmit}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: '提交' }));
        expect(onSubmit).not.toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// 5. Ref methods
// ---------------------------------------------------------------------------

describe('ref methods', () => {
    it('addRow appends a new row', async () => {
        const ref = createRef<EditableTableInstance<Person>>();
        render(
            <EditableTable<Person>
                ref={ref}
                rowKey="id"
                columns={BASE_COLUMNS}
                dataSource={DATA}
                editableMode="all"
            />,
        );

        act(() => {
            ref.current!.addRow({ id: '99', name: '新行', age: 0 });
        });

        const nameInputs = screen.getAllByLabelText('name-input');
        expect(nameInputs).toHaveLength(DATA.length + 1);
    });

    it('removeRow removes the correct row', async () => {
        const ref = createRef<EditableTableInstance<Person>>();
        render(
            <EditableTable<Person>
                ref={ref}
                rowKey="id"
                columns={BASE_COLUMNS}
                dataSource={DATA}
                editableMode="all"
            />,
        );

        act(() => {
            ref.current!.removeRow(0);
        });

        const nameInputs = screen.getAllByLabelText('name-input') as HTMLInputElement[];
        expect(nameInputs).toHaveLength(DATA.length - 1);
        // First remaining row should now be 李四
        expect(nameInputs[0].value).toBe('李四');
    });

    it('getData returns the current data', () => {
        const ref = createRef<EditableTableInstance<Person>>();
        render(
            <EditableTable<Person>
                ref={ref}
                rowKey="id"
                columns={BASE_COLUMNS}
                dataSource={DATA}
                editableMode="all"
            />,
        );

        expect(ref.current!.getData()).toEqual(DATA);
    });
});
