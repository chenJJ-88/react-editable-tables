import './style';

export { FormilyEditableTable } from './FormilyEditableTable';
export { FormilyEditableTableField } from './FormilyEditableTableField';
export { getRowPath } from './utils';

// Re-export Formily API，用户无需单独安装 @formily/core 和 @formily/react
export { createForm, onFieldValueChange, onFieldInit, onFieldInputValueChange, onFieldValidateEnd } from '@formily/core';
export { FormProvider } from '@formily/react';

export type {
    IFormilyEditableTableProps,
    IFormilyEditableTableFieldProps,
    IColumn,
    IColumnRenderOpt,
    IArrayField,
    IField,
    IForm,
} from './types';
