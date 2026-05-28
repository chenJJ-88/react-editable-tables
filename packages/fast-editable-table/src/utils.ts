/**
 * 从字段实例中获取行级路径
 *
 * field.address = "items.0.type" → 返回 "items.0"
 *
 * ```ts
 * onFieldValueChange('items.*.type', (field) => {
 *   const rowPath = getRowPath(field); // "items.0"
 *   form.setFieldState(`${rowPath}.subType`, (state) => {
 *     state.value = undefined;
 *   });
 * });
 * ```
 */
export function getRowPath(field: {
  address: { toString(): string };
}): string {
  const path = field.address.toString();
  const lastDot = path.lastIndexOf('.');
  return lastDot === -1 ? path : path.slice(0, lastDot);
}
