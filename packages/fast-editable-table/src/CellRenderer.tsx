import * as React from 'react';

interface CellRendererProps {
    cellValue: any;
    onChange: (v: any) => void;
    editable?: boolean;
    error?: string;
    fieldProps?: Record<string, any>;
    format?: (v: any) => any;
    parse?: (v: any) => any;
    children?: React.ReactNode;
}

function isCheckedType(v: any): boolean {
    if (v == null || typeof v !== 'object') return false;
    return !!v.__ANT_SWITCH || !!v.__ANT_CHECKBOX;
}

/**
 * Memo 化的单元格渲染器。
 * 只有 cellValue / error / fieldProps 变化时才重渲染，同行其他单元格不受影响。
 */
export const CellRenderer = React.memo<CellRendererProps>(({
    cellValue, onChange, editable, error, fieldProps, format, parse, children,
}) => {
    if (editable === false) {
        return (
            <div className="fet-field" data-has-error={!!error || undefined}>
                <span>{cellValue ?? '-'}</span>
                {error && <div className="fet-error">{error}</div>}
            </div>
        );
    }

    if (children == null) return null;

    if (!React.isValidElement(children)) {
        return <>{children}</>;
    }

    const displayValue = format ? format(cellValue) : cellValue;

    // fieldProps 来自 form.setFieldState 设置的 props（如联动 options），
    // 优先级低于用户直接在子组件上写的 props（cloneElement 会合并，后者覆盖前者）
    const injectProps: Record<string, any> = {
        ...fieldProps,
        value: displayValue,
        onChange: (v: any) => {
            const val = parse ? parse(v) : v;
            onChange(val);
        },
    };

    // Switch / Checkbox 使用 checked 代替 value
    if (isCheckedType((children as React.ReactElement).type)) {
        injectProps.checked = displayValue;
        delete injectProps.value;
    }

    const cloned = React.cloneElement(children as React.ReactElement, injectProps);

    return (
        <div className="fet-field" data-has-error={!!error || undefined}>
            {cloned}
            {error && <div className="fet-error">{error}</div>}
        </div>
    );
}, (prev, next) => {
    return prev.cellValue === next.cellValue
        && prev.error === next.error
        && prev.editable === next.editable
        && prev.onChange === next.onChange
        && prev.children === next.children
        && prev.format === next.format
        && prev.parse === next.parse
        && prev.fieldProps === next.fieldProps;
});
