# 数据联动

支持两种联动方式：`onFieldChange` 同步联动和 `editRender + useEffect` 异步联动。

## onFieldChange — 同步联动

当字段值变化时，`onFieldChange` 回调返回需要同步更新的字段键值对。

### 基本用法

```tsx
const cityMap: Record<string, { label: string; value: string }[]> = {
  china: [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
  ],
  usa: [
    { label: '纽约', value: 'new-york' },
    { label: '洛杉矶', value: 'los-angeles' },
  ],
};

const columns = [
  {
    title: '国家',
    dataIndex: 'country',
    editRender: ({ value, onChange }) => (
      <select value={value ?? ''} onChange={e => onChange(e.target.value)}>
        <option value="">请选择</option>
        <option value="china">中国</option>
        <option value="usa">美国</option>
      </select>
    ),
    onFieldChange: (_value, row) => {
      // 国家变化时，如果当前城市不在新国家的城市列表中，清空城市
      const validCities = (cityMap[row.country] || []).map(o => o.value);
      if (row.city && !validCities.includes(row.city)) {
        return { city: '' };
      }
    },
  },
  {
    title: '城市',
    dataIndex: 'city',
    editRender: ({ value, onChange, row }) => {
      const options = cityMap[row.country] || [];
      return (
        <select value={value ?? ''} onChange={e => onChange(e.target.value)}>
          <option value="">请选择</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    },
  },
];
```

### 工作机制

1. 字段值变化 → `onChange` 更新数据
2. `onFieldChange` 被调用，接收新值和当前行数据
3. 返回 `{ [dataIndex]: newValue }` 形式的对象，同步更新对应字段
4. 返回 `undefined` 或不返回值，不做额外更新

## 异步联动

当联动需要异步加载数据（如请求接口获取选项）时，在 `editRender` 中使用独立组件 + `useEffect`。

### 异步加载选项

```tsx
function CityEditor({ value, onChange, country }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!country) {
      setOptions([]);
      return;
    }
    setLoading(true);
    // 模拟接口请求
    fetchCities(country)
      .then(setOptions)
      .finally(() => setLoading(false));
  }, [country]);

  return (
    <select
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      disabled={loading || !country}
    >
      <option value="">{loading ? '加载中...' : '请选择'}</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// 在列定义中使用
{
  title: '城市',
  dataIndex: 'city',
  editRender: ({ value, onChange, row }) => (
    <CityEditor value={value} onChange={onChange} country={row.country} />
  ),
}
```

### 配合 onFieldChange

异步联动通常配合 `onFieldChange` 使用：先同步清空关联字段，再异步加载新选项。

```tsx
{
  title: '国家',
  dataIndex: 'country',
  editRender: ({ value, onChange }) => (
    <select value={value ?? ''} onChange={e => onChange(e.target.value)}>
      <option value="">请选择</option>
      {countryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  ),
  // 国家变化时立即清空城市，避免旧值残留
  onFieldChange: (_value, row) => {
    const valid = (cityMap[row.country] || []).map(o => o.value);
    if (row.city && !valid.includes(row.city)) return { city: '' };
  },
}
```
