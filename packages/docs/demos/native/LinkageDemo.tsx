import { useEffect, useState } from 'react';
import EditableTable from '@react-editable-tables/native';

interface User {
  id: string;
  country: string;
  city: string;
}

interface CityOption {
  label: string;
  value: string;
}

const countryOptions = [
  { label: '中国', value: 'china' },
  { label: '美国', value: 'usa' },
  { label: '日本', value: 'japan' },
];

const cityMap: Record<string, CityOption[]> = {
  china: [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
  ],
  usa: [
    { label: '纽约', value: 'newyork' },
    { label: '洛杉矶', value: 'losangeles' },
  ],
  japan: [
    { label: '东京', value: 'tokyo' },
    { label: '大阪', value: 'osaka' },
  ],
};

function fetchCities(country: string): Promise<CityOption[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(cityMap[country] || []), 800);
  });
}

const countryLabel: Record<string, string> = {
  china: '中国',
  usa: '美国',
  japan: '日本',
};

const data: User[] = [
  { id: '1', country: 'china', city: 'beijing' },
  { id: '2', country: '', city: '' },
];

function CityEditor({
  value,
  onChange,
  country,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
  country: string;
}) {
  const [options, setOptions] = useState<CityOption[]>([]);

  useEffect(() => {
    if (!country) {
      setOptions([]);
      return;
    }
    let cancelled = false;
    fetchCities(country).then((opts) => {
      if (!cancelled) setOptions(opts);
    });
    return () => {
      cancelled = true;
    };
  }, [country]);

  return (
    <select
      className="et-editor-select"
      value={value as string}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">请选择</option>
      {options.map((o) => (
        <option key={String(o.value)} value={String(o.value)}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default function LinkageDemo() {
  const [dataSource, setDataSource] = useState(data);

  return (
    <div>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
        选择国家后城市异步加载（模拟 800ms 接口延迟）
      </p>
      <EditableTable<User>
        rowKey="id"
        dataSource={dataSource}
        onChange={setDataSource}
        columns={[
          {
            title: '国家',
            dataIndex: 'country',
            width: 150,
            onFieldChange: (_value, row) => {
              const valid = (cityMap[row.country] || []).map((o) =>
                String(o.value),
              );
              if (row.city && !valid.includes(row.city)) return { city: '' };
            },
            editRender: ({ value, onChange }) => (
              <select
                className="et-editor-select"
                value={value as string}
                onChange={(e) => onChange(e.target.value)}
              >
                <option value="">请选择</option>
                {countryOptions.map((o) => (
                  <option key={String(o.value)} value={String(o.value)}>
                    {o.label}
                  </option>
                ))}
              </select>
            ),
            render: (value) => countryLabel[value as string] ?? value,
          },
          {
            title: '城市',
            dataIndex: 'city',
            width: 150,
            editRender: ({ value, onChange, row }) => (
              <CityEditor
                value={value}
                onChange={onChange}
                country={row.country}
              />
            ),
          },
        ]}
        onSubmit={(d) => alert(`提交成功！共${d.length}条`)}
      />
    </div>
  );
}
