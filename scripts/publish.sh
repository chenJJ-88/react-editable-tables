#!/usr/bin/env bash
set -e

BUMP=${1:-patch}

if [[ "$BUMP" != "patch" && "$BUMP" != "minor" && "$BUMP" != "major" ]]; then
  echo "用法: pnpm release [patch|minor|major]"
  echo "默认: patch"
  exit 1
fi

echo ">>> 类型检查..."
pnpm type-check

echo ">>> Lint..."
pnpm lint

echo ">>> 构建..."
pnpm build

echo ">>> 升版本号 ($BUMP)..."
pnpm --filter @react-editable-tables/native version "$BUMP"
pnpm --filter @react-editable-tables/formily version "$BUMP"

echo ">>> 发布到 npm..."
pnpm --filter @react-editable-tables/native publish --access public --no-git-checks
pnpm --filter @react-editable-tables/formily publish --access public --no-git-checks

echo ">>> 完成！"
pnpm --filter @react-editable-tables/native exec node -e "console.log('native:', require('./package.json').version)"
pnpm --filter @react-editable-tables/formily exec node -e "console.log('formily:', require('./package.json').version)"
