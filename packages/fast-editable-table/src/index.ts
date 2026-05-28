import './style';

// Re-export Formily API，用户无需单独安装 @formily/core 和 @formily/react
export {
    createForm,
    onFieldInit,
    onFieldInputValueChange,
    onFieldValidateEnd,
    onFieldValueChange,
} from '@formily/core';
export { FormProvider } from '@formily/react';
export { FormilyEditableTable } from './FormilyEditableTable';
export { FormilyEditableTableField } from './FormilyEditableTableField';
export type {
    IArrayField,
    IColumn,
    IColumnRenderOpt,
    IField,
    IForm,
    IFormilyEditableTableFieldProps,
    IFormilyEditableTableProps,
} from './types';
export { getRowPath } from './utils';
