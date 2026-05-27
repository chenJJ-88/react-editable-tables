# Effects 兼容

<script setup>
import EffectsDemo from '../demos/formily/EffectsDemo.tsx'
import EffectsDemoSource from '../demos/formily/EffectsDemo.tsx?raw'
</script>

虽然 FastTable 使用 CellBridge 架构减少了 Formily Field 订阅，但仍然完全兼容 Formily 的 effects 机制。

## 交互式示例

<ClientOnly>
  <ReactDemo :component="EffectsDemo" :source="EffectsDemoSource" title="字段联动" description="选择国家后动态改变城市下拉选项" />
</ClientOnly>

## 工作原理

FastTable.Field 在内部做了两件事：

1. **注册单元格路径**：通过 `form.createField()` 注册每个单元格的 Formily 路径（如 `items.0.name`），使 effects 可以监听到
2. **桥接状态变化**：值变化时通过 `form.setFieldState()` 触发对应的 effects

这意味着你可以像使用标准 Formily Field 一样使用 effects。

## 监听单元格值变化

```tsx
import { createForm, onFieldValueChange } from '@formily/core';

const form = createForm({
  effects() {
    onFieldValueChange('items.*.name', (field) => {
      console.log('名称变化：', field.value);
    });
  },
});
```

## 字段联动

通过 `onFieldValueChange` + `form.setFieldState` 实现联动：

### 联动改变选项

选择「类型」后，动态改变「子类型」的下拉选项：

```tsx
const form = createForm({
  effects() {
    onFieldValueChange('items.*.type', (field) => {
      form.setFieldState('items.*.subType', (state) => {
        state.component = [
          Select,
          { options: getSubTypeOptions(field.value) },
        ];
      });
    });
  },
});
```

### 联动改变显隐

选择「类型」后，控制「详情」字段是否显示：

```tsx
const form = createForm({
  effects() {
    onFieldValueChange('items.*.type', (field) => {
      form.setFieldState('items.*.detail', (state) => {
        state.visible = field.value === 'other';
      });
    });
  },
});
```

### 联动改变可编辑状态

```tsx
const form = createForm({
  effects() {
    onFieldValueChange('items.*.readonly', (field) => {
      form.setFieldState('items.*.name', (state) => {
        state.editable = !field.value;
      });
    });
  },
});
```

## 异步联动

在 effects 中使用异步逻辑：

```tsx
const form = createForm({
  effects() {
    onFieldValueChange('items.*.country', async (field) => {
      const cities = await fetchCities(field.value);
      form.setFieldState('items.*.city', (state) => {
        state.component = [Select, { options: cities }];
      });
    });
  },
});
```

## 注意事项

- `onFieldValueChange` 中的路径 `items.*.name` 使用通配符 `*` 匹配所有行
- `form.setFieldState` 中的路径同样支持通配符
- 联动操作的触发是异步的（在下一个微任务中执行），以确保状态一致性
