import { Field } from '@formily/react';
import * as React from 'react';
import type { IFormilyEditableTableFieldProps } from './types';

// 通过组件的 defaultProps 或静态标记判断是否为 checked 类型控件
// 不依赖 displayName/name（minifier 会混淆），改为检测组件是否接受 checked prop
function isCheckedType(type: any): boolean {
    if (type == null) return false;
    // antd Switch/Checkbox 的 defaultProps 包含 checked 或组件挂载了静态标记
    const dp = type.defaultProps;
    if (dp && 'checked' in dp) return true;
    // 兜底：通过组件名静态白名单（开发环境有效，生产环境 displayName 通常被保留）
    const name: string = type.displayName || type.name || '';
    return name === 'Switch' || name === 'Checkbox' || name === 'InternalSwitch' || name === 'InternalCheckbox';
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
                    return (
                        <div className="fet-field" data-has-error={!!error || undefined}>
                            {children}
                            {error && <div className="fet-error">{error}</div>}
                        </div>
                    );
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
                if (isCheckedType((children as React.ReactElement).type)) {                    injectProps.checked = value;
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
