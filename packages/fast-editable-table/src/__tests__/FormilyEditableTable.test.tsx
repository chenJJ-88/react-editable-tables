/**
 * Integration tests for FormilyEditableTable
 *
 * Each test wraps the component in a real Formily <FormProvider> so that
 * ArrayField / Field observers work as in production.
 */
import { createForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { describe, expect, it } from 'vitest';
import { FormilyEditableTable } from '../FormilyEditableTable';
import type { IColumn } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildForm(initialValues?: Record<string, unknown>) {
    return createForm({ initialValues });
}

/**
 * A minimal set of columns that renders each item's `name` field using
 * FormilyEditableTable.Field so we can observe real field wiring.
 */
function makeColumns(): IColumn[] {
    return [
        {
            title: '姓名',
            render: ({ index, field: _field }) => (
                <FormilyEditableTable.Field name="name">
                    <input aria-label={`name-${index}`} />
                </FormilyEditableTable.Field>
            ),
        },
        {
            title: '操作',
            // no render → DefaultOperator (删除 button) is rendered automatically
        },
    ];
}

function renderTable(
    form: ReturnType<typeof createForm>,
    overrides: Partial<React.ComponentProps<typeof FormilyEditableTable>> = {},
) {
    return render(
        <FormProvider form={form}>
            <FormilyEditableTable
                name="items"
                columns={makeColumns()}
                addText="添加行"
                itemDefaultValue={{ name: '' }}
                pagination={false}
                {...overrides}
            />
        </FormProvider>,
    );
}

// ---------------------------------------------------------------------------
// 1. Renders table with initial data
// ---------------------------------------------------------------------------

describe('renders table with initial data', () => {
    it('renders column headers', () => {
        const form = buildForm({ items: [{ name: '张三' }] });
        renderTable(form);
        expect(screen.getByText('姓名')).toBeInTheDocument();
        expect(screen.getByText('操作')).toBeInTheDocument();
    });

    it('renders one row per initial item', () => {
        const form = buildForm({
            items: [{ name: '张三' }, { name: '李四' }],
        });
        renderTable(form);
        // Each row gets a named input rendered by FormilyEditableTable.Field
        expect(screen.getByLabelText('name-0')).toBeInTheDocument();
        expect(screen.getByLabelText('name-1')).toBeInTheDocument();
    });

    it('pre-fills field values from form initial values', () => {
        const form = buildForm({ items: [{ name: '王五' }] });
        renderTable(form);
        const input = screen.getByLabelText('name-0') as HTMLInputElement;
        expect(input.value).toBe('王五');
    });
});

// ---------------------------------------------------------------------------
// 2. Add row button works
// ---------------------------------------------------------------------------

describe('add row button', () => {
    it('renders the add button with the configured text', () => {
        const form = buildForm({ items: [] });
        renderTable(form);
        expect(screen.getByRole('button', { name: '添加行' })).toBeInTheDocument();
    });

    it('appends a new row when the add button is clicked', async () => {
        const form = buildForm({ items: [{ name: '张三' }] });
        renderTable(form);

        await userEvent.click(screen.getByRole('button', { name: '添加行' }));

        // After adding one row we should have two name inputs
        expect(screen.getByLabelText('name-0')).toBeInTheDocument();
        expect(screen.getByLabelText('name-1')).toBeInTheDocument();
    });

    it('adds multiple rows sequentially', async () => {
        const form = buildForm({ items: [] });
        renderTable(form);

        const addBtn = screen.getByRole('button', { name: '添加行' });
        await userEvent.click(addBtn);
        await userEvent.click(addBtn);

        expect(screen.getByLabelText('name-0')).toBeInTheDocument();
        expect(screen.getByLabelText('name-1')).toBeInTheDocument();
    });

    it('disables add button when max is reached', async () => {
        const form = buildForm({ items: [{ name: '张三' }] });
        renderTable(form, { max: 1 });

        const addBtn = screen.getByRole('button', { name: '添加行' });
        expect(addBtn).toBeDisabled();
    });
});

// ---------------------------------------------------------------------------
// 3. Remove row via field.remove()
// ---------------------------------------------------------------------------

describe('remove row', () => {
    it('renders a 删除 button for each row', () => {
        const form = buildForm({ items: [{ name: '张三' }, { name: '李四' }] });
        renderTable(form);
        expect(screen.getAllByText('删除')).toHaveLength(2);
    });

    it('removes the correct row when 删除 is clicked', async () => {
        const form = buildForm({
            items: [{ name: '张三' }, { name: '李四' }],
        });
        renderTable(form);

        const deleteButtons = screen.getAllByText('删除');
        // Click 删除 on the first row
        await userEvent.click(deleteButtons[0]);

        // Only one name input should remain
        expect(screen.queryByLabelText('name-1')).not.toBeInTheDocument();
        const remaining = screen.getByLabelText('name-0') as HTMLInputElement;
        // The second item (李四) is now at index 0
        expect(remaining.value).toBe('李四');
    });

    it('removes a row via field.remove() imperatively', async () => {
        const form = buildForm({
            items: [{ name: '张三' }, { name: '李四' }],
        });
        renderTable(form);

        act(() => {
            const arrayField = form.query('items').take() as import('@formily/core').ArrayField;
            arrayField.remove(0);
        });

        const remaining = (await screen.findByLabelText('name-0')) as HTMLInputElement;
        expect(remaining.value).toBe('李四');
        expect(screen.queryByLabelText('name-1')).not.toBeInTheDocument();
    });

    it('disables 删除 button when min rows constraint is met', () => {
        const form = buildForm({ items: [{ name: '张三' }] });
        renderTable(form, { min: 1 });

        // DefaultOperator renders a span, not a button, so we check for the disabled class
        const deleteSpan = screen.getByText('删除');
        expect(deleteSpan.className).toContain('fet-operator-disabled');
    });
});
