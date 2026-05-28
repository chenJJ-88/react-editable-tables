import './style';

export { FastTable } from './FastTable';
export { FastTableField } from './FastTableField';
export { getRowPath } from './utils';

// Re-export Formily API，用户无需单独安装 @formily/core 和 @formily/react
export { createForm, onFieldValueChange, onFieldInit, onFieldInputValueChange, onFieldValidateEnd } from '@formily/core';
export { FormProvider } from '@formily/react';

export type {
    IFastTableProps,
    IFastTableFieldProps,
    IColumn,
    IColumnRenderOpt,
    IArrayField,
    IField,
    IForm,
} from './types';
