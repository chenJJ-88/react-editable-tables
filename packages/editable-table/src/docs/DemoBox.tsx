import { useState } from 'react';

interface DemoBoxProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  code: string;
}

export default function DemoBox({
  title,
  description,
  children,
  code,
}: DemoBoxProps) {
  const [showCode, setShowCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="demo-box">
      {title && <div className="demo-box-title">{title}</div>}
      {description && <div className="demo-box-desc">{description}</div>}
      <div className="demo-box-preview">{children}</div>
      <div className="demo-box-divider">
        <button
          type="button"
          className="demo-box-toggle"
          onClick={() => setShowCode(!showCode)}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            role="img"
            aria-label="代码"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          {showCode ? '收起代码' : '展开代码'}
        </button>
      </div>
      {showCode && (
        <div className="demo-box-code">
          <button
            type="button"
            className="demo-box-copy"
            onClick={handleCopy}
            title="复制代码"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              role="img"
              aria-label="复制"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </button>
          <pre>
            <code>{code.trim()}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
