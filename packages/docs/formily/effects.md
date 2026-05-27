# Effects 兼容

<script setup>
import EffectsDemo from '../demos/formily/EffectsDemo.tsx'
import EffectsDemoSource from '../demos/formily/EffectsDemo.tsx?raw'
</script>

FastTable 内部使用 Formily 2.x 标准的 `<ArrayField>` + `<Field>` 方案，完全兼容 Formily 的 effects 机制。

## 交互式示例

<ClientOnly>
  <ReactDemo :component="EffectsDemo" :source="EffectsDemoSource" title="字段联动" description="类型→子类型选项联动+值清空、开关→备注禁用联动" />
</ClientOnly>

## 工作原理

FastTable 的每一行单元格都是一个标准的 Formily `<Field>`，由 Formily 管理值、校验和联动：

1. **行级 Field 上下文**：每个单元格的列 render 会自动包裹一层 `<Field name={rowIndex}>`，创建行级上下文
2. **单元格 Field**：`<FastTable.Field name="type">` 内部渲染 `<Field name="type">`，自动解析为 `items.0.type`
3. **Effects 兼容**：因为每个单元格都是标准 Formily Field，所以 `onFieldValueChange('items.*.type')` 等标准 effects 可以正常触发

这意味着你可以像使用标准 Formily Field 一样使用 effects。

## 路径通配符规则

FastTable 中 effects 路径使用通配符 `*` 匹配行索引：

```
{name}.*.{fieldName}
 │       │   │
 │       │   └── FastTable.Field 的 name 属性
 │       └────── 匹配所有行索引（0, 1, 2, ...）
 └────────────── FastTable 的 name 属性
```

例如，`items.*.type` 匹配 `items.0.type`、`items.1.type` 等所有行的 `type` 字段。

::: tip
`onFieldValueChange` 中的通配符 `*` 会对每一行的变化都触发回调。在回调中通过 `field.address` 获取具体行路径，再用精确路径调用 `form.setFieldState`，避免影响其他行。
:::

## Effects API 总览

FastTable 完全兼容 Formily 2.x 的 effects API。以下是与表格场景最常用的 effects 方法：

### 表格场景常用

| 方法 | 说明 | 示例路径 |
|------|------|---------|
| `onFieldValueChange` | 监听字段值变化 | `items.*.type` |
| `onFieldInit` | 字段初始化时触发 | `items.*.name` |
| `onFieldInputValueChange` | 监听用户输入变化（不含程序赋值） | `items.*.name` |
| `onFieldValidateEnd` | 字段校验结束时触发 | `items.*.name` |

### 表单生命周期

| 方法 | 说明 |
|------|------|
| `onFormInit` | 表单初始化 |
| `onFormMount` | 表单挂载 |
| `onFormValuesChange` | 表单值变化 |
| `onFormSubmit` | 表单提交 |
| `onFormSubmitFailed` | 表单提交失败 |
| `onFormReset` | 表单重置 |

### 字段生命周期

| 方法 | 说明 |
|------|------|
| `onFieldInit` | 字段初始化 |
| `onFieldMount` | 字段挂载 |
| `onFieldUnmount` | 字段卸载 |
| `onFieldValueChange` | 字段值变化（含程序赋值和用户输入） |
| `onFieldInputValueChange` | 用户输入变化（仅用户主动操作） |
| `onFieldValidateStart` | 字段校验开始 |
| `onFieldValidateEnd` | 字段校验结束 |
| `onFieldValidateFailed` | 字段校验失败 |
| `onFieldValidateSuccess` | 字段校验成功 |
| `onFieldLoading` | 字段加载中 |
| `onFieldReset` | 字段重置 |

::: tip onFieldValueChange vs onFieldInputValueChange
- `onFieldValueChange`：任何值变化都触发，包括 `form.setFieldState` 程序赋值
- `onFieldInputValueChange`：只有用户主动输入时才触发，适合做输入联想等场景
:::

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

## 联动改变选项

选择「类型」后，动态改变「子类型」的下拉选项。通过 `state.data` 传递动态 props（如 `options`），`FastTable.Field` 会自动合并到子组件上：

```tsx
const form = createForm({
  effects() {
    onFieldInit('items.*.type', (field) => {
      const rowPath = field.address.toString().replace(/\.type$/, '');
      form.setFieldState(`${rowPath}.subType`, (state) => {
        state.data = { ...state.data, options: getSubTypeOptions(field.value) };
      });
    });
    onFieldValueChange('items.*.type', (field) => {
      // field.address = "items.0.type" → rowPath = "items.0"
      const rowPath = field.address.toString().replace(/\.type$/, '');
      form.setFieldState(`${rowPath}.subType`, (state) => {
        state.data = { ...state.data, options: getSubTypeOptions(field.value) };
        state.value = undefined;
      });
    });
  },
});
```

::: warning 行级联动务必使用精确路径
`form.setFieldState('items.*.subType', ...)` 会匹配所有行的 subType，导致修改类型时清空所有行的子类型值。使用 `field.address` 获取具体行路径（如 `items.0`），再拼接目标字段名，只影响当前行。
:::

::: warning 联动传递 props 用 state.data，不要用 state.component
`state.component = [Select, { options }]` 会导致 Formily 用 `state.component` 替换整个子组件渲染，丢失原始 JSX 上的 `placeholder`、`style` 等属性。使用 `state.data` 传递动态 props，`FastTable.Field` 会将其合并到子组件上，保留原始属性。
:::

## 级联清空

当上游字段变化时，需要同步清空下游字段的值，否则会出现选项已变但旧值仍保留的问题：

```tsx
const form = createForm({
  effects() {
    onFieldValueChange('items.*.type', (field) => {
      const rowPath = field.address.toString().replace(/\.type$/, '');
      form.setFieldState(`${rowPath}.subType`, (state) => {
        state.data = { ...state.data, options: getSubTypes(field.value) };
        state.value = undefined; // 清空旧值
      });
    });
  },
});
```

::: warning
级联联动时务必记得清空下游值。否则用户选择新类型后，子类型仍显示旧值，但该旧值可能不在新选项中，导致数据不一致。
:::

## 联动改变可编辑状态

通过 `state.editable` 控制字段是否可编辑：

```tsx
const form = createForm({
  effects() {
    onFieldValueChange('items.*.disabled', (field) => {
      const rowPath = field.address.toString().replace(/\.disabled$/, '');
      form.setFieldState(`${rowPath}.note`, (state) => {
        state.editable = !field.value;
      });
    });
  },
});
```

配合 `FastTable.Field` 的 `editable` 属性，`state.editable = false` 时字段会显示为只读文本。

## 联动改变显隐

选择「类型」后，控制「详情」字段是否显示：

```tsx
const form = createForm({
  effects() {
    onFieldValueChange('items.*.type', (field) => {
      const rowPath = field.address.toString().replace(/\.type$/, '');
      form.setFieldState(`${rowPath}.detail`, (state) => {
        state.visible = field.value === 'other';
      });
    });
  },
});
```

## 多级级联联动

实现三级联动：类型 → 子类型 → 详细分类。上游变化时，需要更新直接下游的选项，并清空所有更下游的值：

```tsx
const form = createForm({
  effects() {
    // 第一级变化 → 更新第二级选项，清空第二、三级值
    onFieldValueChange('items.*.category', (field) => {
      const rowPath = field.address.toString().replace(/\.category$/, '');
      form.setFieldState(`${rowPath}.subCategory`, (state) => {
        state.data = { ...state.data, options: getSubCategories(field.value) };
        state.value = undefined;
      });
      form.setFieldState(`${rowPath}.detail`, (state) => {
        state.data = { ...state.data, options: [] };
        state.value = undefined;
      });
    });

    // 第二级变化 → 更新第三级选项，清空第三级值
    onFieldValueChange('items.*.subCategory', (field) => {
      const rowPath = field.address.toString().replace(/\.subCategory$/, '');
      form.setFieldState(`${rowPath}.detail`, (state) => {
        state.data = { ...state.data, options: getDetails(field.value) };
        state.value = undefined;
      });
    });
  },
});
```

## 行内数据联动

一个字段变化时，自动计算并更新同行另一个字段的值（如价格 × 数量 = 总价）：

```tsx
const form = createForm({
  effects() {
    onFieldValueChange('items.*.price', (field) => {
      // field.address = "items.0.price" → rowPath = "items.0"
      const rowPath = field.address.toString().replace(/\.price$/, '');
      const match = rowPath.match(/items\.(\d+)/);
      if (!match) return;
      const rowIndex = Number(match[1]);
      const row = form.values.items?.[rowIndex];
      if (row?.quantity) {
        form.setFieldState(`${rowPath}.total`, (state) => {
          state.value = Number(field.value) * Number(row.quantity);
        });
      }
    });
  },
});
```

::: tip
行内数据联动中，使用 `field.address` 获取精确路径，避免通配符影响其他行。
:::

## 多字段联动

监听同一行内多个字段的变化，当任一变化时触发联动：

```tsx
const form = createForm({
  effects() {
    // 监听单价变化
    onFieldValueChange('items.*.price', (field) => {
      updateTotal(field);
    });
    // 监听数量变化
    onFieldValueChange('items.*.quantity', (field) => {
      updateTotal(field);
    });
  },
});

function updateTotal(field: any) {
  const rowPath = field.address.toString().replace(/\.(\w+)$/, '');
  const match = rowPath.match(/items\.(\d+)/);
  if (!match) return;
  const rowIndex = Number(match[1]);
  const row = form.values.items?.[rowIndex];
  if (row?.price != null && row?.quantity != null) {
    form.setFieldState(`${rowPath}.total`, (state) => {
      state.value = Number(row.price) * Number(row.quantity);
    });
  }
}
```

## 异步联动

在 effects 中使用异步逻辑（如远程搜索选项）：

```tsx
const form = createForm({
  effects() {
    onFieldValueChange('items.*.country', async (field) => {
      const cities = await fetchCities(field.value);
      const rowPath = field.address.toString().replace(/\.country$/, '');
      form.setFieldState(`${rowPath}.city`, (state) => {
        state.data = { ...state.data, options: cities };
        state.value = undefined;
      });
    });
  },
});
```

## 字段初始化联动

使用 `onFieldInit` 在字段创建时设置初始状态，适合动态设置默认选项等场景：

```tsx
const form = createForm({
  effects() {
    onFieldInit('items.*.type', (field) => {
      // 字段初始化时设置默认选项
      const rowPath = field.address.toString().replace(/\.type$/, '');
      form.setFieldState(`${rowPath}.subType`, (state) => {
        state.data = { ...state.data, options: typeOptions };
      });
    });
  },
});
```

## 跨行校验

使用 `rules` 实现跨行唯一性校验：

```tsx
const form = createForm();

<FastTable.Field
  name="key"
  required
  rules={[
    {
      validator: (value) => {
        if (value == null || value === '') return true;
        const items = form.values.items || [];
        const count = items.filter((item: any) => item.key === value).length;
        return count <= 1;
      },
      message: '键不能重复',
    },
  ]}
>
  <Input />
</FastTable.Field>
```

## 表单级操作

在 effects 中可以通过第二个参数 `form` 实例操作表单：

```tsx
const form = createForm({
  effects() {
    onFieldValueChange('items.*.type', (field, form) => {
      // 读取整个表单的值
      const allValues = form.getFormState(state => state.values);

      // 设置同行字段状态（使用 field.address 定位具体行）
      const rowPath = field.address.toString().replace(/\.type$/, '');
      form.setFieldState(`${rowPath}.subType`, (state) => {
        state.value = undefined;
      });

      // 清除指定字段的错误
      form.clearErrors(`${rowPath}.subType`);
    });
  },
});
```

常用 `form` 实例方法：

| 方法 | 说明 |
|------|------|
| `form.setFieldState(pattern, setter)` | 设置字段状态 |
| `form.getFieldState(pattern)` | 获取字段状态 |
| `form.setFormState(setter)` | 设置表单状态 |
| `form.getFormState(selector)` | 获取表单状态 |
| `form.validate(pattern?)` | 校验指定字段 |
| `form.clearErrors(pattern?)` | 清除错误 |
| `form.setValues(values)` | 设置表单值 |
| `form.query(pattern)` | 查询字段实例 |

## 注意事项

- 通配符 `*` 匹配所有行，`onFieldValueChange` 对每一行的变化都会触发
- **行级联动必须使用 `field.address` 获取精确路径**，避免 `form.setFieldState('items.*.xxx')` 影响其他行
- **联动传递动态 props 用 `state.data`，不要用 `state.component`**：`state.component` 会导致 Formily 替换整个子组件，丢失原始 JSX 属性
- 级联联动时务必清空下游值，否则会出现选项已变但旧值仍保留的问题
- `onFieldValueChange` 包含程序赋值触发的变化，`onFieldInputValueChange` 仅响应用户输入
- 联动操作的触发是异步的（在下一个微任务中执行），以确保状态一致性
