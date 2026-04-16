# Task 2 报告：OpenAPI（Swagger）接口契约归档

## 1. 任务目标
建立前后端统一接口合同，避免联调阶段因字段、路径、返回结构不一致导致反复返工。

## 2. 实施内容
1. 新增接口契约文件：`docs/api/openapi.yaml`。
2. 使用 OpenAPI 3.0.3 规范定义核心接口：
   - `GET /look`：观察当前房间。
   - `POST /move`：执行方向移动。
3. 明确请求/响应结构：
   - 请求体：`MoveRequest`（方向枚举 north/south/east/west）。
   - 成功响应：`LookResponse`、`MoveResponse`。
   - 失败响应：`ErrorResponse`（含 `code` 与 `message`）。
4. 补充示例数据，便于前端 Mock 和后端对照实现。

## 3. 验证方式
1. 使用 Swagger Editor 打开 `openapi.yaml` 检查语法和结构。
2. 前端按示例模拟调用，验证字段齐全性。
3. 后端实现时对照 schema，确保返回字段一致。

## 4. 预期收益
1. 前后端协作从“口头约定”升级为“可执行合同”。
2. 新成员可快速理解接口，不依赖口口相传。
3. 后续接口变更可通过版本控制追踪，降低破坏性修改风险。

## 5. 后续建议
1. 补充 `401/500` 等通用错误码规范。
2. 当战斗系统上线后，新增 `POST /attack` 契约并复用错误模型。
3. 接入自动化契约校验，把 OpenAPI 校验加入 CI。
