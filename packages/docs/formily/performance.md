# 性能优化原理

FastTable 针对大数据量场景（20+ 列 × 100+ 行）做了三项核心优化，解决了 Formily 表格在单元格数量增多时的性能瓶颈。

## 问题分析

在标准的 Formily 表格中，每个可编辑单元格都会创建一个 Formily `Field` 组件，产生一个响应式订阅：

```
行数 N × 列数 M = N×M 个订阅
```

当 N=100、M=20 时，就有 2000 个独立的响应式订阅。任何一个单元格值变化，Formily 的响应式系统都需要处理可能的级联更新，导致明显的卡顿。

## 优化一：CellBridge

### 原理

CellBridge 的核心思想是：**单元格不创建独立的 Formily Field，而是从行级别的 Field 中读取值**。

```
传统方案：每个单元格一个 Field → N×M 个订阅
CellBridge：每行一个 Field → N 个订阅
```

### 实现方式

1. FastTable 为每行创建一个 Formily `Field`（通过 `RowFieldWrapper`）
2. `FastTable.Field` 不创建自己的 Formily 订阅，而是：
   - 通过 `useField()` 获取行级 Field
   - 直接读取 `rowField.value[name]` 获取当前值
   - 通过 `rowField.setValue(newRowValue)` 更新值
3. 同时通过 `form.createField()` 注册单元格路径（仅用于 effects 兼容），但不订阅

### 效果

- 订阅数从 N×M 降为 N
- 值变化时，只有目标单元格的 React 组件会重新渲染

## 优化二：columns 稳定化

### 问题

在标准实现中，列定义通常依赖数据长度（用于生成行索引等），这导致行增删时 columns 引用变化，触发整个表格重新渲染。

### 解决方案

将 `valueLen`（数据长度）存储在 `ref` 中，而不是作为 `useMemo` 的依赖：

```tsx
const valueLenRef = useRef(field.value.length);
valueLenRef.current = field.value.length;

const columns = useMemo(() => buildColumns(), []); // 不依赖 valueLen
```

### 效果

行增删时 columns 引用不变，antd Table 不会因为 columns 变化而重新渲染整个表格。

## 优化三：React.memo

### 原理

`CellRenderer` 使用 `React.memo` + 自定义比较函数，确保只有真正变化的单元格才会重新渲染。

### 比较策略

```tsx
const CellRenderer = React.memo((props) => {
  // 渲染逻辑
}, (prev, next) => {
  // 自定义比较：只有以下属性变化才重渲染
  return (
    prev.cellValue === next.cellValue &&
    prev.error === next.error &&
    prev.fieldProps === next.fieldProps &&
    prev.editable === next.editable &&
    prev.onChange === next.onChange &&
    prev.children === next.children &&
    prev.format === next.format &&
    prev.parse === next.parse
  );
});
```

### 效果

编辑某个单元格时：
- 该单元格重渲染（值变化了）
- 同行其他单元格不受影响（CellBridge 已将订阅降到行级）
- 其他行的单元格完全不受影响

## 优化效果总结

| 优化点 | 原理 | 效果 |
|--------|------|------|
| CellBridge | 单元格不创建 Formily Field，从行级 field.value 读取 | 订阅数 N×M → N |
| columns 稳定化 | valueLen 用 ref，不作为 useMemo 依赖 | 行增删不重建列 |
| React.memo | CellRenderer 自定义比较，只有值/错误变化才重渲染 | 同行其他单元格不受影响 |

## 性能对比

在 20 列 × 100 行的场景下：

| 指标 | 标准 Formily 表格 | FastTable (CellBridge) |
|------|-------------------|----------------------|
| Formily 订阅数 | 2000 | 100 |
| 单元格编辑耗时 | 100-300ms | <16ms |
| 行增删耗时 | 200-500ms | <50ms |
| 初始渲染耗时 | 1-3s | <500ms |

::: tip 提示
以上数据为近似值，实际性能取决于业务复杂度和运行环境。核心收益来自订阅数的大幅减少。
:::
