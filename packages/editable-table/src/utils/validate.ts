import type { EditableColumn, Rule } from '../types/table';

/**
 * 校验单行数据，返回错误信息映射
 * key: dataIndex, value: 错误信息
 */
export function validateRow<T extends object>(row: T, columns: EditableColumn<T>[]): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const column of columns) {
        const rules = column.rules;
        if (!rules?.length) continue;

        const value = row[column.dataIndex];
        const error = validateValue(value, row, rules);
        if (error) {
            errors[String(column.dataIndex)] = error;
        }
    }

    return errors;
}

/**
 * 校验单个值，返回错误信息或 undefined
 */
export function validateValue<T extends object>(value: unknown, row: T, rules: Rule[]): string | undefined {
    for (const rule of rules) {
        if (rule.required && (value === undefined || value === null || value === '')) {
            return rule.message;
        }

        if (rule.validator) {
            const result = rule.validator(value, row as Record<string, unknown>);
            if (typeof result === 'string') return result;
            if (result === false) return rule.message;
        }
    }

    return undefined;
}
