import { describe, expect, it } from 'vitest';
import type { EditableColumn, Rule } from '../../types/table';
import { validateRow, validateValue } from '../validate';

// ---------------------------------------------------------------------------
// validateValue
// ---------------------------------------------------------------------------

describe('validateValue', () => {
    // ------------------------------------------------------------------
    // required rule
    // ------------------------------------------------------------------
    describe('required rule', () => {
        const row = {};
        const requiredRule: Rule = { required: true, message: '此项为必填' };

        it('fails when value is undefined', () => {
            expect(validateValue(undefined, row, [requiredRule])).toBe('此项为必填');
        });

        it('fails when value is null', () => {
            expect(validateValue(null, row, [requiredRule])).toBe('此项为必填');
        });

        it('fails when value is empty string', () => {
            expect(validateValue('', row, [requiredRule])).toBe('此项为必填');
        });

        it('passes when value is a non-empty string', () => {
            expect(validateValue('hello', row, [requiredRule])).toBeUndefined();
        });

        it('passes when value is the number 0', () => {
            // 0 is neither undefined, null nor ''
            expect(validateValue(0, row, [requiredRule])).toBeUndefined();
        });

        it('passes when value is false', () => {
            expect(validateValue(false, row, [requiredRule])).toBeUndefined();
        });
    });

    // ------------------------------------------------------------------
    // custom validator returning boolean
    // ------------------------------------------------------------------
    describe('custom validator returning boolean', () => {
        const row = {};

        it('returns the rule message when validator returns false', () => {
            const rule: Rule = {
                message: '值必须大于 0',
                validator: (v) => typeof v === 'number' && v > 0,
            };
            expect(validateValue(-1, row, [rule])).toBe('值必须大于 0');
        });

        it('returns undefined when validator returns true', () => {
            const rule: Rule = {
                message: '值必须大于 0',
                validator: (v) => typeof v === 'number' && v > 0,
            };
            expect(validateValue(5, row, [rule])).toBeUndefined();
        });
    });

    // ------------------------------------------------------------------
    // custom validator returning error string
    // ------------------------------------------------------------------
    describe('custom validator returning string', () => {
        const row = {};

        it('returns the string returned by the validator', () => {
            const rule: Rule = {
                message: '默认错误',
                validator: (v) => (typeof v === 'string' && v.length >= 3 ? true : '长度不能少于 3 个字符'),
            };
            expect(validateValue('ab', row, [rule])).toBe('长度不能少于 3 个字符');
        });

        it('returns undefined when validator returns true (string path)', () => {
            const rule: Rule = {
                message: '默认错误',
                validator: (v) => (typeof v === 'string' && v.length >= 3 ? true : '长度不能少于 3 个字符'),
            };
            expect(validateValue('abc', row, [rule])).toBeUndefined();
        });
    });

    // ------------------------------------------------------------------
    // multiple rules — first failing rule wins
    // ------------------------------------------------------------------
    describe('multiple rules', () => {
        const row = {};
        const requiredRule: Rule = { required: true, message: '必填' };
        const minLenRule: Rule = {
            message: '长度至少 3',
            validator: (v) => (typeof v === 'string' && v.length >= 3 ? true : '长度至少 3'),
        };

        it('returns error from the first failing rule (required)', () => {
            expect(validateValue('', row, [requiredRule, minLenRule])).toBe('必填');
        });

        it('skips passing rules and returns error from the next failing rule', () => {
            // 'ab' passes required but fails minLen
            expect(validateValue('ab', row, [requiredRule, minLenRule])).toBe('长度至少 3');
        });

        it('returns undefined when all rules pass', () => {
            expect(validateValue('abc', row, [requiredRule, minLenRule])).toBeUndefined();
        });
    });

    // ------------------------------------------------------------------
    // no rules
    // ------------------------------------------------------------------
    describe('no rules', () => {
        it('returns undefined when rules array is empty', () => {
            expect(validateValue('any value', {}, [])).toBeUndefined();
        });
    });
});

// ---------------------------------------------------------------------------
// validateRow
// ---------------------------------------------------------------------------

describe('validateRow', () => {
    type Row = { name: string; age: number | null; email: string };

    const columns: EditableColumn<Row>[] = [
        {
            title: '姓名',
            dataIndex: 'name',
            rules: [{ required: true, message: '姓名为必填' }],
        },
        {
            title: '年龄',
            dataIndex: 'age',
            rules: [
                {
                    message: '年龄必须为正整数',
                    validator: (v) => (typeof v === 'number' && v > 0 ? true : '年龄必须为正整数'),
                },
            ],
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            // no rules
        },
    ];

    it('returns an empty object when all fields are valid', () => {
        const row: Row = { name: '张三', age: 25, email: 'foo@bar.com' };
        expect(validateRow(row, columns)).toEqual({});
    });

    it('collects errors for each failing column', () => {
        const row: Row = { name: '', age: -1, email: '' };
        const result = validateRow(row, columns);
        expect(result).toHaveProperty('name', '姓名为必填');
        expect(result).toHaveProperty('age', '年龄必须为正整数');
        // email has no rules → no error
        expect(result).not.toHaveProperty('email');
    });

    it('returns only the errors for failing columns', () => {
        const row: Row = { name: '李四', age: -5, email: '' };
        const result = validateRow(row, columns);
        expect(Object.keys(result)).toHaveLength(1);
        expect(result).toHaveProperty('age', '年龄必须为正整数');
    });

    it('ignores columns without rules', () => {
        const noRuleColumns: EditableColumn<Row>[] = [{ title: '邮箱', dataIndex: 'email' }];
        const row: Row = { name: '', age: null, email: '' };
        expect(validateRow(row, noRuleColumns)).toEqual({});
    });
});
