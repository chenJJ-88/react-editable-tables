import * as React from 'react';
import {useField, useForm} from '@formily/react';
import {onFieldChange} from '@formily/core';
import {observer} from '@formily/reactive-react';
import type {Field as FormilyField} from '@formily/core';
import type {IFastTableFieldProps} from './types';
import {CellRenderer} from './CellRenderer';

/**
 * 轻量级单元格桥接组件（CellBridge）。
 *
 * 核心优化：不再为每个单元格创建 Formily Field 组件订阅，
 * 而是从行级 FieldContext 读取值、通过行级 Field 写入值。
 * 仅在 useEffect 中通过 form.createField 注册单元格路径以保证校验和 effects 兼容。
 */
export const FastTableField: React.FC<IFastTableFieldProps> = observer(props => {
    const {name, required, rules, editable, format, parse, children} = props;

    const rowField = useField() as FormilyField;
    const form = useForm();

    // 计算完整单元格路径
    const cellPath = React.useMemo(() => {
        return `${rowField.address.toString()}.${name}`;
    }, [rowField.address, name]);

    // 注册单元格字段（校验 & effects 兼容）
    const [error, setError] = React.useState<string | undefined>();
    const [fieldProps, setFieldProps] = React.useState<Record<string, any>>({});

    React.useEffect(() => {
        if (!form) return;

        // 注册单元格路径到 Formily，使校验和 effects 能找到它
        const cellField = form.createField({
            name: cellPath,
            required,
        });

        // 如果有 rules，通过 setFieldState 设置
        if (rules) {
            form.setFieldState(cellPath, state => {
                (state as any).validator = rules;
            });
        }

        // 通过 addEffects 订阅字段状态变化
        const effectId = `fast-table-${cellPath}`;
        form.addEffects(effectId, () => {
            onFieldChange(cellPath, ['errors', 'component', 'dataSource', 'value'], (f: any) => {
                // 更新错误
                const newErrors = f.errors;
                if (newErrors?.length > 0) {
                    const errStr = typeof newErrors[0] === 'string'
                        ? newErrors[0]
                        : newErrors[0]?.messages?.[0] || String(newErrors[0]);
                    setError(prev => (prev === errStr ? prev : errStr));
                } else {
                    setError(prev => (prev === undefined ? prev : undefined));
                }

                // 更新 component props（如 linkedFieldProps 设置的 options）
                const comp = f.component;
                if (Array.isArray(comp) && comp[1] && Object.keys(comp[1]).length > 0) {
                    setFieldProps(prev => {
                        if (prev === comp[1]) return prev;
                        return comp[1];
                    });
                }

                // 更新 dataSource（select 选项）
                const ds = f.dataSource;
                if (ds?.length > 0) {
                    setFieldProps(prev => {
                        if (prev.options === ds) return prev;
                        return {...prev, options: ds};
                    });
                }
            });
        });

        return () => {
            form.removeEffects(effectId);
        };
    }, [cellPath, form, name, required, rules]);

    // 从行级 Field 读取单元格值
    const cellValue = rowField.value?.[name];

    // 稳定的 onChange
    const rowValueRef = React.useRef(rowField.value);
    rowValueRef.current = rowField.value;

    const onChange = React.useCallback((newCellValue: any) => {
        if (!form) return;

        // 1. 更新行级值
        const newRowValue = {...rowValueRef.current, [name]: newCellValue};
        rowField.setValue(newRowValue);

        // 2. 触发单元格路径的 effects（onFieldValueChange）
        form.setFieldState(cellPath, state => {
            state.value = newCellValue;
        });
    }, [name, rowField, form, cellPath]);

    return (
        <CellRenderer
            cellValue={cellValue}
            onChange={onChange}
            editable={editable}
            error={error}
            fieldProps={fieldProps}
            format={format}
            parse={parse}
        >
            {children}
        </CellRenderer>
    );
});
