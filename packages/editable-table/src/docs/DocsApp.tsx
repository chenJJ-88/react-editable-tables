import { useEffect, useState } from 'react';
import DemoBox from './DemoBox';
import BasicDemo from './demos/BasicDemo';
import basicDemoSource from './demos/BasicDemo.tsx?raw';
import CustomEditorDemo from './demos/CustomEditorDemo';
import customEditorDemoSource from './demos/CustomEditorDemo.tsx?raw';
import EditModeDemo from './demos/EditModeDemo';
import editModeDemoSource from './demos/EditModeDemo.tsx?raw';
import LinkageDemo from './demos/LinkageDemo';
import linkageDemoSource from './demos/LinkageDemo.tsx?raw';
import RowOpsDemo from './demos/RowOpsDemo';
import rowOpsDemoSource from './demos/RowOpsDemo.tsx?raw';
import ThemeDemo from './demos/ThemeDemo';
import themeDemoSource from './demos/ThemeDemo.tsx?raw';
import ValidationDemo from './demos/ValidationDemo';
import validationDemoSource from './demos/ValidationDemo.tsx?raw';
import './DocsApp.css';

// ===== 侧边栏配置 =====
interface NavItem {
  key: string;
  label: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '指南',
    items: [
      { key: 'home', label: '首页' },
      { key: 'getting-started', label: '快速上手' },
      { key: 'edit-mode', label: '编辑模式' },
      { key: 'validation', label: '校验' },
      { key: 'linkage', label: '数据联动' },
      { key: 'custom-editor', label: '自定义编辑器' },
      { key: 'row-ops', label: '行操作' },
      { key: 'theme', label: '主题' },
    ],
  },
  {
    title: 'API',
    items: [{ key: 'api', label: 'API 参考' }],
  },
];

// ===== 页面组件 =====

function HomePage() {
  return (
    <div className="page">
      <div className="home-hero">
        <h1 className="home-title">EditableTable</h1>
        <p className="home-subtitle">轻量、高性能的 React 可编辑表格组件</p>
        <div className="home-badges">
          <span className="home-badge">TypeScript</span>
          <span className="home-badge">虚拟滚动</span>
          <span className="home-badge">列固定</span>
          <span className="home-badge">数据联动</span>
          <span className="home-badge">表单校验</span>
        </div>
      </div>

      <div className="home-features">
        <div className="home-feature">
          <div className="home-feature-icon">📝</div>
          <h3>多种编辑模式</h3>
          <p>支持全量编辑和行编辑两种模式，满足不同业务场景需求</p>
        </div>
        <div className="home-feature">
          <div className="home-feature-icon">⚡</div>
          <h3>虚拟滚动</h3>
          <p>基于 @tanstack/react-virtual，轻松渲染万级数据</p>
        </div>
        <div className="home-feature">
          <div className="home-feature-icon">🔗</div>
          <h3>数据联动</h3>
          <p>字段间联动 + 异步加载选项，支持 onFieldChange</p>
        </div>
        <div className="home-feature">
          <div className="home-feature-icon">✅</div>
          <h3>表单校验</h3>
          <p>内置必填、自定义校验规则，支持提交时和实时校验</p>
        </div>
        <div className="home-feature">
          <div className="home-feature-icon">📌</div>
          <h3>列固定</h3>
          <p>支持列左固定和右固定，横向滚动时操作列始终可见</p>
        </div>
        <div className="home-feature">
          <div className="home-feature-icon">🎨</div>
          <h3>自定义编辑器</h3>
          <p>通过 editRender 自定义编辑态渲染，灵活返回任意组件</p>
        </div>
      </div>

      <DemoBox title="基础示例" code={basicDemoSource}>
        <BasicDemo />
      </DemoBox>
    </div>
  );
}

function GettingStartedPage() {
  return (
    <div className="page">
      <h1>快速上手</h1>

      <h2>安装</h2>
      <div className="code-block">
        <pre>
          <code>{`npm install @react-editable-tables/native
# 或
pnpm add @react-editable-tables/native`}</code>
        </pre>
      </div>

      <h2>基本使用</h2>
      <p>
        最简单的用法只需要传入 <code>rowKey</code>、<code>columns</code>、
        <code>dataSource</code> 和 <code>onChange</code> 四个属性。
      </p>
      <DemoBox code={basicDemoSource}>
        <BasicDemo />
      </DemoBox>

      <h2>核心概念</h2>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>概念</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>columns</code>
              </td>
              <td>列定义数组，每列指定标题、字段名、editRender 等</td>
            </tr>
            <tr>
              <td>
                <code>dataSource</code>
              </td>
              <td>
                受控数据源，通过 <code>onChange</code> 回调更新
              </td>
            </tr>
            <tr>
              <td>
                <code>editableMode</code>
              </td>
              <td>
                编辑模式：<code>all</code> 全量编辑 / <code>row</code> 行编辑
              </td>
            </tr>
            <tr>
              <td>
                <code>onSubmit</code>
              </td>
              <td>提交回调，校验通过后触发</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EditModePage() {
  return (
    <div className="page">
      <h1>编辑模式</h1>
      <p>EditableTable 支持两种编辑模式：</p>
      <ul>
        <li>
          <strong>全量编辑（all）</strong>
          ：所有可编辑列直接可编辑，顶部显示提交按钮
        </li>
        <li>
          <strong>行编辑（row）</strong>
          ：每行需点击编辑按钮后才可编辑，支持保存和取消
        </li>
      </ul>

      <DemoBox
        title="编辑模式切换"
        description="点击按钮切换全量编辑和行编辑模式"
        code={editModeDemoSource}
      >
        <EditModeDemo />
      </DemoBox>

      <h2>使用方式</h2>
      <div className="code-block">
        <pre>
          <code>{`// 全量编辑（默认）
<EditableTable editableMode="all" ... />

// 行编辑
<EditableTable editableMode="row" ... />`}</code>
        </pre>
      </div>
    </div>
  );
}

function ValidationPage() {
  return (
    <div className="page">
      <h1>校验</h1>
      <p>
        通过 <code>rules</code>{' '}
        配置校验规则，支持必填校验和自定义校验函数。校验触发时机由{' '}
        <code>validateTrigger</code> 控制。
      </p>

      <DemoBox
        title="校验示例"
        description="姓名必填、年龄必填且大于 0、邮箱格式校验"
        code={validationDemoSource}
      >
        <ValidationDemo />
      </DemoBox>

      <h2>校验规则</h2>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>required</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>是否必填</td>
            </tr>
            <tr>
              <td>
                <code>message</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>校验失败时的错误信息</td>
            </tr>
            <tr>
              <td>
                <code>validator</code>
              </td>
              <td>
                <code>(value, row) =&gt; boolean | string</code>
              </td>
              <td>
                自定义校验函数，返回 true 通过、false 使用 message、string
                使用返回值
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>校验触发时机</h2>
      <div className="code-block">
        <pre>
          <code>{`// 提交时校验（默认）
<EditableTable validateTrigger="submit" ... />

// 实时校验
<EditableTable validateTrigger="change" ... />`}</code>
        </pre>
      </div>
    </div>
  );
}

function LinkagePage() {
  return (
    <div className="page">
      <h1>数据联动</h1>
      <p>支持字段间联动和异步加载选项两种场景：</p>
      <ul>
        <li>
          <strong>onFieldChange</strong>：当前字段变化时，同步更新其他字段
        </li>
        <li>
          <strong>editRender + useEffect</strong>：在编辑器组件内使用 useEffect
          实现异步加载选项
        </li>
      </ul>

      <DemoBox
        title="省市区联动"
        description="选择国家后城市选项异步加载（模拟 800ms 接口延迟）"
        code={linkageDemoSource}
      >
        <LinkageDemo />
      </DemoBox>

      <h2>onFieldChange</h2>
      <p>当字段值变化时触发，返回需要同步更新的字段键值对：</p>
      <div className="code-block">
        <pre>
          <code>{`{
  title: '国家', dataIndex: 'country',
  editRender: ({ value, onChange }) => (
    <select value={value} onChange={e => onChange(e.target.value)}>
      {countryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  ),
  onFieldChange: (_value, row) => {
    const valid = (cityMap[row.country] || []).map(o => String(o.value))
    if (row.city && !valid.includes(row.city)) return { city: '' }
  },
}`}</code>
        </pre>
      </div>

      <h2>异步加载选项</h2>
      <p>在 editRender 中使用独立组件 + useEffect 实现异步加载：</p>
      <div className="code-block">
        <pre>
          <code>{`function CityEditor({ value, onChange, country }) {
  const [options, setOptions] = useState([])
  useEffect(() => {
    if (!country) { setOptions([]); return }
    fetchCities(country).then(setOptions)
  }, [country])
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">请选择</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

{
  title: '城市', dataIndex: 'city',
  editRender: ({ value, onChange, row }) => (
    <CityEditor value={value} onChange={onChange} country={row.country} />
  ),
}`}</code>
        </pre>
      </div>
    </div>
  );
}

function CustomEditorPage() {
  return (
    <div className="page">
      <h1>自定义编辑器</h1>
      <p>
        通过 <code>editRender</code> 自定义编辑态渲染，直接返回任意 React
        组件即可：
      </p>
      <ul>
        <li>
          <strong>editRender</strong>：接收{' '}
          <code>{`{ value, onChange, row, rowIndex, error }`}</code>{' '}
          props，直接返回编辑组件
        </li>
      </ul>

      <DemoBox
        title="自定义编辑器示例"
        description="状态列使用 editRender 自定义 select，日期列使用 editRender 自定义 date input"
        code={customEditorDemoSource}
      >
        <CustomEditorDemo />
      </DemoBox>

      <h2>基本用法</h2>
      <p>直接返回 JSX，最灵活的方式：</p>
      <div className="code-block">
        <pre>
          <code>{`{
  title: '状态', dataIndex: 'status',
  editRender: ({ value, onChange }) => (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="active">启用</option>
      <option value="inactive">禁用</option>
    </select>
  ),
  render: (value) => value === 'active' ? '启用' : '禁用',
}`}</code>
        </pre>
      </div>

      <h2>提取为独立组件</h2>
      <p>当编辑器逻辑复杂时，可以提取为独立组件：</p>
      <div className="code-block">
        <pre>
          <code>{`{
  title: '日期', dataIndex: 'date',
  editRender: ({ value, onChange }) => (
    <input type="date" value={value ?? ''} onChange={e => onChange(e.target.value)} />
  ),
}`}</code>
        </pre>
      </div>
    </div>
  );
}

function RowOpsPage() {
  return (
    <div className="page">
      <h1>行操作</h1>
      <p>
        通过 <code>ref</code> 获取表格实例，调用 <code>addRow</code>、
        <code>removeRow</code>、<code>moveUp</code>、<code>moveDown</code>{' '}
        等方法。
      </p>

      <DemoBox
        title="行操作示例"
        description="新增行、删除行、上移下移，姓名列左固定，操作列右固定"
        code={rowOpsDemoSource}
      >
        <RowOpsDemo />
      </DemoBox>

      <h2>实例方法</h2>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>方法</th>
              <th>参数</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>addRow</code>
              </td>
              <td>
                <code>defaults?: Partial&lt;T&gt;</code>
              </td>
              <td>在末尾新增一行，可传入默认值</td>
            </tr>
            <tr>
              <td>
                <code>removeRow</code>
              </td>
              <td>
                <code>rowIndex: number</code>
              </td>
              <td>删除指定行</td>
            </tr>
            <tr>
              <td>
                <code>moveUp</code>
              </td>
              <td>
                <code>rowIndex: number</code>
              </td>
              <td>上移指定行</td>
            </tr>
            <tr>
              <td>
                <code>moveDown</code>
              </td>
              <td>
                <code>rowIndex: number</code>
              </td>
              <td>下移指定行</td>
            </tr>
            <tr>
              <td>
                <code>getData</code>
              </td>
              <td>-</td>
              <td>获取当前数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>使用方式</h2>
      <div className="code-block">
        <pre>
          <code>{`const tableRef = useRef<EditableTableInstance<User>>(null)

// 新增行
tableRef.current?.addRow({ id: 'new', name: '', age: undefined })

// 删除行
tableRef.current?.removeRow(rowIndex)

// 上移/下移
tableRef.current?.moveUp(rowIndex)
tableRef.current?.moveDown(rowIndex)

// 获取当前数据
tableRef.current?.getData()`}</code>
        </pre>
      </div>
    </div>
  );
}

function ThemePage() {
  return (
    <div className="page">
      <h1>主题</h1>
      <p>
        EditableTable 使用 CSS
        变量控制主题，可通过覆盖变量实现自定义主题，包括暗色模式。
      </p>

      <DemoBox
        title="暗色主题"
        description="点击按钮切换亮色/暗色主题"
        code={themeDemoSource}
      >
        <ThemeDemo />
      </DemoBox>

      <h2>CSS 变量</h2>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>变量名</th>
              <th>默认值</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--et-border-color</code>
              </td>
              <td>
                <code>#e8e8e8</code>
              </td>
              <td>边框颜色</td>
            </tr>
            <tr>
              <td>
                <code>--et-header-bg</code>
              </td>
              <td>
                <code>#fafafa</code>
              </td>
              <td>表头背景</td>
            </tr>
            <tr>
              <td>
                <code>--et-header-color</code>
              </td>
              <td>
                <code>#333</code>
              </td>
              <td>表头文字颜色</td>
            </tr>
            <tr>
              <td>
                <code>--et-row-hover-bg</code>
              </td>
              <td>
                <code>#f5f5f5</code>
              </td>
              <td>行 hover 背景</td>
            </tr>
            <tr>
              <td>
                <code>--et-row-stripe-bg</code>
              </td>
              <td>
                <code>#fafafa</code>
              </td>
              <td>斑马纹背景</td>
            </tr>
            <tr>
              <td>
                <code>--et-error-color</code>
              </td>
              <td>
                <code>#ff4d4f</code>
              </td>
              <td>错误颜色</td>
            </tr>
            <tr>
              <td>
                <code>--et-btn-primary-bg</code>
              </td>
              <td>
                <code>#1677ff</code>
              </td>
              <td>主按钮背景</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>暗色主题示例</h2>
      <div className="code-block">
        <pre>
          <code>{`.dark-theme {
  --et-border-color: #303030;
  --et-header-bg: #1f1f1f;
  --et-header-color: #fff;
  --et-row-hover-bg: #262626;
  --et-row-stripe-bg: #1a1a1a;
  --et-error-color: #ff7875;
  --et-btn-primary-bg: #1668dc;
}`}</code>
        </pre>
      </div>
    </div>
  );
}

function APIPage() {
  return (
    <div className="page">
      <h1>API 参考</h1>

      <h2>EditableTable Props</h2>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>默认值</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>rowKey</code>
              </td>
              <td>
                <code>keyof T &amp; string</code>
              </td>
              <td>-</td>
              <td>行唯一标识字段名（必填）</td>
            </tr>
            <tr>
              <td>
                <code>columns</code>
              </td>
              <td>
                <code>EditableColumn&lt;T&gt;[]</code>
              </td>
              <td>-</td>
              <td>列定义（必填）</td>
            </tr>
            <tr>
              <td>
                <code>dataSource</code>
              </td>
              <td>
                <code>T[]</code>
              </td>
              <td>-</td>
              <td>数据源（必填）</td>
            </tr>
            <tr>
              <td>
                <code>onChange</code>
              </td>
              <td>
                <code>(data: T[]) =&gt; void</code>
              </td>
              <td>-</td>
              <td>数据变化回调</td>
            </tr>
            <tr>
              <td>
                <code>editableMode</code>
              </td>
              <td>
                <code>'all' | 'row'</code>
              </td>
              <td>
                <code>'all'</code>
              </td>
              <td>编辑模式</td>
            </tr>
            <tr>
              <td>
                <code>onSubmit</code>
              </td>
              <td>
                <code>(data: T[]) =&gt; void</code>
              </td>
              <td>-</td>
              <td>提交回调，校验通过后触发</td>
            </tr>
            <tr>
              <td>
                <code>validateTrigger</code>
              </td>
              <td>
                <code>'submit' | 'change'</code>
              </td>
              <td>
                <code>'submit'</code>
              </td>
              <td>校验触发时机</td>
            </tr>
            <tr>
              <td>
                <code>scrollY</code>
              </td>
              <td>
                <code>number</code>
              </td>
              <td>
                <code>500</code>
              </td>
              <td>虚拟滚动容器高度（px）</td>
            </tr>
            <tr>
              <td>
                <code>emptyText</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>
                <code>'暂无数据'</code>
              </td>
              <td>空数据提示文案</td>
            </tr>
            <tr>
              <td>
                <code>className</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>-</td>
              <td>容器类名</td>
            </tr>
            <tr>
              <td>
                <code>style</code>
              </td>
              <td>
                <code>CSSProperties</code>
              </td>
              <td>-</td>
              <td>容器样式</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>EditableColumn</h2>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>默认值</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>title</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>-</td>
              <td>列标题（必填）</td>
            </tr>
            <tr>
              <td>
                <code>dataIndex</code>
              </td>
              <td>
                <code>keyof T &amp; string</code>
              </td>
              <td>-</td>
              <td>数据字段名（必填）</td>
            </tr>
            <tr>
              <td>
                <code>width</code>
              </td>
              <td>
                <code>number | string</code>
              </td>
              <td>
                <code>150</code>
              </td>
              <td>列宽</td>
            </tr>
            <tr>
              <td>
                <code>fixed</code>
              </td>
              <td>
                <code>'left' | 'right'</code>
              </td>
              <td>-</td>
              <td>列固定方向</td>
            </tr>
            <tr>
              <td>
                <code>editable</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>
                <code>true</code>
              </td>
              <td>是否可编辑</td>
            </tr>
            <tr>
              <td>
                <code>editRender</code>
              </td>
              <td>
                <code>(props) =&gt; ReactNode</code>
              </td>
              <td>-</td>
              <td>自定义编辑态渲染</td>
            </tr>
            <tr>
              <td>
                <code>rules</code>
              </td>
              <td>
                <code>Rule[]</code>
              </td>
              <td>-</td>
              <td>校验规则</td>
            </tr>
            <tr>
              <td>
                <code>onFieldChange</code>
              </td>
              <td>
                <code>(value, row) =&gt; Partial&lt;T&gt; | undefined</code>
              </td>
              <td>-</td>
              <td>字段联动回调</td>
            </tr>
            <tr>
              <td>
                <code>render</code>
              </td>
              <td>
                <code>(value, row, rowIndex) =&gt; ReactNode</code>
              </td>
              <td>-</td>
              <td>自定义只读态渲染</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Rule</h2>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>required</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>是否必填</td>
            </tr>
            <tr>
              <td>
                <code>validator</code>
              </td>
              <td>
                <code>(value, row) =&gt; boolean | string</code>
              </td>
              <td>自定义校验函数</td>
            </tr>
            <tr>
              <td>
                <code>message</code>
              </td>
              <td>
                <code>string</code>
              </td>
              <td>校验失败错误信息</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>EditableTableInstance (ref)</h2>
      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>方法</th>
              <th>参数</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>addRow</code>
              </td>
              <td>
                <code>defaults?: Partial&lt;T&gt;</code>
              </td>
              <td>在末尾新增一行</td>
            </tr>
            <tr>
              <td>
                <code>removeRow</code>
              </td>
              <td>
                <code>rowIndex: number</code>
              </td>
              <td>删除指定行</td>
            </tr>
            <tr>
              <td>
                <code>moveUp</code>
              </td>
              <td>
                <code>rowIndex: number</code>
              </td>
              <td>上移指定行</td>
            </tr>
            <tr>
              <td>
                <code>moveDown</code>
              </td>
              <td>
                <code>rowIndex: number</code>
              </td>
              <td>下移指定行</td>
            </tr>
            <tr>
              <td>
                <code>getData</code>
              </td>
              <td>-</td>
              <td>获取当前数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== 页面映射 =====
const pageMap: Record<string, () => React.ReactNode> = {
  home: () => <HomePage />,
  'getting-started': () => <GettingStartedPage />,
  'edit-mode': () => <EditModePage />,
  validation: () => <ValidationPage />,
  linkage: () => <LinkagePage />,
  'custom-editor': () => <CustomEditorPage />,
  'row-ops': () => <RowOpsPage />,
  theme: () => <ThemePage />,
  api: () => <APIPage />,
};

// ===== 主组件 =====
export default function DocsApp() {
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash && pageMap[hash] ? hash : 'home';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.slice(1);
      if (hash && pageMap[hash]) setActivePage(hash);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (key: string) => {
    window.location.hash = key;
    setActivePage(key);
    setSidebarOpen(false);
  };

  return (
    <div className="docs-layout">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <button
          type="button"
          className="docs-sidebar-mask"
          onClick={() => setSidebarOpen(false)}
          aria-label="关闭侧边栏"
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`docs-sidebar${sidebarOpen ? ' docs-sidebar-open' : ''}`}
      >
        <button
          type="button"
          className="docs-sidebar-header"
          onClick={() => navigate('home')}
        >
          <span className="docs-sidebar-logo">ET</span>
          <span>EditableTable</span>
        </button>
        <nav className="docs-sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.title} className="docs-nav-group">
              <div className="docs-nav-group-title">{group.title}</div>
              {group.items.map((item) => (
                <a
                  key={item.key}
                  className={`docs-nav-item${activePage === item.key ? ' active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.key);
                  }}
                  href={`#${item.key}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="docs-main">
        <header className="docs-header">
          <button
            type="button"
            className="docs-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              role="img"
              aria-label="菜单"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="docs-header-right">
            <a
              className="docs-github"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
                role="img"
                aria-label="GitHub"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
            </a>
          </div>
        </header>
        <div className="docs-content">{pageMap[activePage]?.()}</div>
      </div>
    </div>
  );
}
