# Task 1 报告：GitHub Actions 自动化流水线配置

## 1. 任务目标
为仓库建立自动化 CI 监工机制：当开发者提交 PR 时，GitHub 自动拉起云端环境执行测试，只有测试通过才允许绿色合并。

## 2. 实施内容
1. 新增工作流文件：`.github/workflows/ci.yml`。
2. 配置触发条件：
   - `pull_request` 到 `main` 与 `zou` 分支。
   - `push` 到 `zou` 分支（用于分支内快速自检）。
3. 配置执行环境：`ubuntu-latest` + Node.js 20。
4. 配置测试步骤：`node --test engine/game.test.js`。

## 3. 验证方式
1. 本地确认测试命令可执行。
2. 提交并推送后，在 GitHub Actions 页面确认 CI 任务自动触发。
3. 检查日志中测试结果是否全部通过（Green Build）。

## 4. 预期收益
1. 统一质量门禁，减少“靠自觉”导致的回归问题。
2. PR 阶段提前暴露错误，降低主分支风险。
3. 为后续增加 lint、覆盖率、API 校验等检查提供扩展入口。

## 5. 后续建议
1. 增加 `README` 中的 CI 状态徽章。
2. 后续接入 `npm test` 与更多测试文件时，统一到脚本命令管理。
3. 在分支保护规则中启用“必须通过 CI 才可合并”。
