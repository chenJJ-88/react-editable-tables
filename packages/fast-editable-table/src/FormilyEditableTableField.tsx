import * as React from 'react';
import {Field} from '@formily/react';
import type {IFormilyEditableTableFieldProps} from './types';

function isCheckedType(v: any): boolean {
    if (v == null || typeof v !== 'object') return false;
    return !!v.__ANT_SWITCH || !!v.__ANT_CHECKBOX;
}

/**
 * 单元格字段组件，基于 Formily 2.x 标准 <Field>。
 * 通过 render props 获取 field 实例，注入 value/onChange 到子组件。
 *
 * effects 联动通过 form.setFieldState 设置 field.data 传递 props，
 * 而非 state.component（后者会导致 Formily 替换整个子组件渲染）。
 */
export const FormilyEditableTableField: React.FC<IFormilyEditableTableFieldProps> = ({
    name,
    required,
    rules,
    editable,
    format,
    parse,
    children,
}) => {
    return (
        <Field name={name} required={required} validator={rules}>
            {(field: any) => {
                const value = format ? format(field.value) : field.value;
                const error = field.errors?.[0];

                // effects 通过 form.setFieldState 注入的 props（如 options）存放在 field.data
                const dataProps = field.data || {};

                if (editable === false || field.editable === false) {
                    return (
                        <div className="fet-field" data-has-error={!!error || undefined}>
                            <span>{field.value ?? '-'}</span>
                            {error && <div className="fet-error">{error}</div>}
                        </div>
                    );
                }

                if (children == null || !React.isValidElement(children)) {
                    return <>{children}</>;
                }

                const injectProps: Record<string, any> = {
                    ...dataProps,
                    value,
                    onChange: (v: any) => {
                        const val = parse ? parse(v) : v;
                        field.onInput(val);
                    },
                };

                // Switch / Checkbox 使用 checked 代替 value
                if (isCheckedType((children as React.ReactElement).type)) {
                    injectProps.checked = value;
                    delete injectProps.value;
                }

                const cloned = React.cloneElement(children as React.ReactElement, injectProps);

                return (
                    <div className="fet-field" data-has-error={!!error || undefined}>
                        {cloned}
                        {error && <div className="fet-error">{error}</div>}
                    </div>
                );
            }}
        </Field>
    );
};
