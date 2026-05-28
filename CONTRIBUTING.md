# 参与贡献

感谢你对 react-editable-tables 项目的关注！我们非常欢迎社区的参与和贡献。

## 开发环境搭建

**前置要求：** Node.js 18+，pnpm 9+

```bash
# 克隆仓库
git clone https://github.com/chenJJ-88/react-editable-tables.git
cd react-editable-tables

# 安装依赖
pnpm install

# 启动文档开发服务器
pnpm dev:docs
```

文档服务器启动后，访问 `http://localhost:5173` 即可预览。

## 代码规范

本项目使用 [Biome](https://biomejs.dev/) 进行代码格式化和 Lint 检查。

```bash
# 运行格式化和 lint 检查
pnpm check

# 自动修复格式问题
pnpm format
```

提交前请确保 `pnpm check` 无报错。

## 提交规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范。提交信息格式如下：

```
<type>(<scope>): <subject>
```

常用类型：

| 类型       | 说明                   |
| ---------- | ---------------------- |
| `feat`     | 新增功能               |
| `fix`      | 修复问题               |
| `docs`     | 文档变更               |
| `chore`    | 构建/工具链/配置变更   |
| `refactor` | 代码重构（无功能变化） |

示例：

```
feat(native): 支持行拖拽排序
fix(formily): 修复 effects 注册时序问题
docs: 补充自定义编辑器示例
```

## 提交流程

1. Fork 本仓库到你的 GitHub 账号
2. 基于 `main` 分支创建功能分支：`git checkout -b feat/your-feature`
3. 开发并本地验证（`pnpm check` + `pnpm test`）
4. 按规范提交代码：`git commit -m "feat: your feature"`
5. 推送到你的 Fork：`git push origin feat/your-feature`
6. 在 GitHub 上向 `main` 分支发起 Pull Request，并填写 PR 模板

## Issue 报告

遇到 Bug 时，请通过 [Bug 报告模板](https://github.com/chenJJ-88/react-editable-tables/issues/new?template=bug_report.md) 提交 Issue，并尽量提供：

- 最小可复现示例（推荐使用 StackBlitz 或 CodeSandbox）
- 使用的包名及版本
- React 版本、浏览器类型及版本
- 期望行为 vs 实际行为

信息越详细，问题越容易被定位和修复。

## 文档

文档位于 `packages/docs/` 目录，使用 VitePress 构建。

- 新增页面：在对应目录（`guide/`、`native/`、`formily/`）下创建 `.md` 文件
- 更新导航：修改 `packages/docs/.vitepress/config.ts` 中的 `sidebar` 配置
- 本地预览：`pnpm dev:docs`

欢迎补充示例、修正错误或翻译文档！
