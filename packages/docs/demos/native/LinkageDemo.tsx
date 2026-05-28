import { useEffect, useState } from 'react';
import EditableTable, { type EditableColumn } from '@react-editable-tables/native';
import { Switch, Input } from 'antd';
interface User {
  id: string;
  country: string;
  city: string;
  hasIphone: boolean;
  iphone: string;
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
  { id: '1', country: 'china', city: 'beijing', hasIphone: true,iphone: '123' },
  { id: '2', country: '', city: '', hasIphone: false ,iphone: ''},
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
  const columns: EditableColumn<User>[] = [
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
    {
      title: '是否需要电话',
      dataIndex: 'hasIphone',
      editRender: ({ value, onChange }) => (
        <Switch checked={value} onChange={onChange} />
      ),
    },
    {
      title: '电话',
      dataIndex: 'iphone',
      editRender: ({ value, onChange, row }) => {
        console.log(row);

        return (
          <Input
            disabled={!row.hasIphone}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      },
    },
  ]
  return (
    <div>
      <EditableTable<User>
        bordered
        rowKey="id"
        dataSource={dataSource}
        onChange={setDataSource}
        columns={columns}
        onSubmit={(d) => { console.log('提交数据：', d); alert(`提交成功！共${d.length}条`); }}
      />
    </div>
  );
}
