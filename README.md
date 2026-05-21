# 权 Q — Puffer 主权质押 Mini App

<p align="center">
  <img src="public/favicon.svg" alt="权 Q" width="80" height="80" />
</p>

<p align="center">
  <strong>你的资产、你的决策、你的控制权——从不交给任何人</strong>
</p>

<p align="center">
  imToken 10周年 AI 共创活动参赛作品 | 重点冲击"最能体现自托管、控制权与钱包主权表达"奖项
</p>

---

## 🏆 核心理念

**权（Q）** 不是又一个质押工具——它是一个**主权宣言**。

通过深度集成 **Token Core（tcx-wasm）** 实现全链路本地密钥管理，结合 **Token UI** 设计系统与安全材料，从视觉、交互、文案到流程，每一处都在传递：

> **你的资产、你的决策、你的控制权，从不交给任何人。**

用户在这里不是"使用一个质押工具"，而是**作为自己资产的真正主人**，在完全自托管的环境下，清醒、安全、有掌控感地完成 Puffer 质押。

## ✨ 核心特性

### 🔐 主权钱包入口（核心亮点）
- 使用 **Token Core (tcx-wasm)** 实现完整自托管：创建钱包、导入助记词
- 强调"本工具绝不保管你的助记词、私钥，你始终拥有100%控制权"
- 醒目的主权宣言和安全边界说明

### ⚡ Puffer 主权质押流程
- 支持 ETH / stETH / wstETH 质押铸造 pufETH
- 每一步都让用户明确感受到"这是我自己的决定"
- 提供清晰的方案对比，让用户自主选择

### 🎛️ 极致控制权表达
- 交易前完整预览 + 可手动编辑原始交易数据
- 多层用户确认（每次确认都强化主权感）
- 自定义 Gas、手动调整参数等高级控制选项
- "我是主人"仪表盘（显示我掌控的资产、我批准的权限、我做的决策）

### 🛡️ 安全与透明边界
- 深度集成 Token UI Security 材料
- 每一步都有清晰风险提示和"后果由我自己承担"的声明
- 授权风险、合约风险等详细解释

### 📊 资产主权管理
- pufETH 余额与收益实时显示
- 质押历史（完全本地或用户可控记录）
- 随时撤回授权 / 退出质押的便捷路径

## 🛠️ 技术栈

- **Vite + React + TypeScript** — 现代前端框架
- **Token Core (tcx-wasm)** — 浏览器端 WASM 密钥管理
- **Token UI** — 设计系统与安全材料
- **viem** — 以太坊交互库
- **Tailwind CSS 4** — 样式系统
- **zustand** — 状态管理

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📁 项目结构

```
src/
├── components/
│   ├── common/          # 通用 UI 组件（SovereignCard, SovereignButton 等）
│   ├── wallet/          # 钱包相关组件（创建、导入、备份）
│   ├── stake/           # 质押相关组件（选择、预览、确认、成功）
│   ├── dashboard/       # 仪表盘组件
│   └── security/        # 安全组件（风险提示、主权声明、授权管理）
├── hooks/               # React Hooks（useWallet）
├── lib/                 # 工具库（tcx-wasm 封装、以太坊交互、工具函数）
├── stores/              # 状态管理（zustand store）
├── types/               # TypeScript 类型定义
└── constants/           # 常量（合约地址、安全配置、主权宣言）
```

## 🔑 Token Core 集成

本项目深度集成了 Token Core (tcx-wasm)，实现以下自托管核心能力：

| 功能 | API | 说明 |
|------|-----|------|
| 创建钱包 | `create_keystore` | 本地生成 HD 钱包，助记词仅显示一次 |
| 导入钱包 | `create_keystore` + mnemonic | 从助记词恢复钱包 |
| 派生账户 | `derive_accounts` | 派生 ETH 地址 |
| 签名交易 | `sign_tx` | 浏览器端本地签名 |
| 导出助记词 | `export_mnemonic` | 仅在备份时使用一次 |
| 缓存管理 | `cache_keystore` / `clear_cached_keystore` | 会话内密钥缓存 |

**所有密钥操作 100% 在浏览器端完成，不经过任何服务器。**

## ⚠️ 安全声明

- 本项目为 imToken 10周年 AI 共创活动参赛作品
- 所有演示优先使用测试网（Sepolia）
- 本工具不存储用户的助记词、私钥或密码
- 交易签名完全在本地进行，不经过任何服务器

## 📝 License

MIT
