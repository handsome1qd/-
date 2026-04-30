# AGENTS.md (AI Assistant Context Profile)

## 1. Project Architecture (项目架构概述)
This project is a high-performance MUD (Multi-User Dungeon) game engine built on Node.js. 
The system architecture heavily relies on the **Command Pattern** to strictly decouple raw user string inputs from the core business logic. We are actively refactoring towards Dependency Injection (DI) and pure functions to ensure maximum testability.

## 2. Directory Structure (目录结构说明)
* `/engine/`: Core system controllers and schedulers.
  * `parser.js`: Input parsing and Command object instantiation.
  * `game.js`: The central Game lifecycle orchestrator.
  * `move.js`: Spatial logic, collision, and room traversal.
* `/models/`: Domain Entities (`Player.js`, `Room.js`).
* `/docs/api/`: OpenAPI 3.0 contracts (`openapi.yaml`).
* `/.github/workflows/`: Automated CI pipelines (`ci.yml`).

## 3. Core Responsibilities (核心模块职责)
* **Parser**: The strictly defined gateway for all dirty input. It validates strings and returns standard Command objects.
* **Entities (Player/Room)**: Pure state containers. They hold business data (coordinates, health) but do NOT handle rendering.
* **Game Engine**: Dependency container and state manager. Delegates tasks to sub-engines (like Move Engine).

## 4. Coding Conventions (编码规范约束)
* **Syntax**: Use modern ES6+ standards (e.g., `const`/`let`, arrow functions, destructuring).
* **Test-Driven (TDD)**: All state-changing logic must be extracted into pure functions. Side effects (I/O, Logging) must be passed via Dependency Injection to allow easy mocking.
* **Documentation**: Every public class and method MUST include standard JSDoc comments explaining parameters, return types, and potential exceptions.
* **Contract First**: Any new feature involving data exchange must adhere to the schemas defined in `openapi.yaml`.

## 5. Prohibited Actions (禁止操作清单) 
1. **NO Hardcoded I/O**: NEVER inject `console.log()` or `process.stdout` into `/models/` or business logic. All output must be returned as DTOs (Data Transfer Objects) and rendered by an external Presenter.
2. **NO Global Mutability**: Do not mutate global variables. Avoid `require()` caching hacks for state management.
3. **NO UI/Browser Code**: This is a strict Node.js backend environment. DO NOT generate DOM manipulation, HTML, or CSS code.
4. **NO Bypassing CI**: NEVER modify or delete the test commands in `.github/workflows/ci.yml` or `package.json`. 
5. **NO Fragile Tests**: When generating unit tests, do not write tests that depend on the real file system or network. Always mock external dependencies.