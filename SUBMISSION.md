# 权 Q — 提交材料

---

## 一、中文简介

**权（Q）** 是一款极致强调钱包主权与自托管控制的 Puffer 流动性质押 Mini App，为 imToken 10周年 AI 共创活动参赛作品，重点冲击"最能体现自托管、控制权与钱包主权表达"奖项。

它不是又一个质押工具——它是一个**主权宣言**。

通过深度集成 Token Core（tcx-wasm）实现全链路本地密钥管理，结合 Token UI 设计系统与安全材料，从视觉、交互、文案到流程，每一处都在传递一个核心理念："你的资产、你的决策、你的控制权，从不交给任何人"。

用户在这里不是"使用一个质押工具"，而是**作为自己资产的真正主人**，在完全自托管的环境下，清醒、安全、有掌控感地完成 Puffer 质押。

### 核心特性

1. **主权钱包入口**：使用 Token Core (tcx-wasm) 实现完整自托管——创建钱包、导入助记词，所有密钥操作 100% 在浏览器端完成，助记词/私钥永不离开浏览器。

2. **Puffer 主权质押流程**：支持 ETH / stETH / wstETH 质押铸造 pufETH，每一步都让用户明确感受到"这是我自己的决定"，提供清晰的方案对比让用户自主选择。

3. **极致控制权表达**：交易前完整预览 + 可手动编辑原始交易数据，多层用户确认（每次确认都强化主权感），自定义 Gas、手动调整参数等高级控制选项，"我是主人"仪表盘。

4. **安全与透明边界**：深度集成 Token UI Security 材料，每一步都有清晰风险提示和"后果由我自己承担"的声明，授权风险、合约风险等详细解释。

5. **资产主权管理**：pufETH 余额与收益实时显示，质押历史（完全本地或用户可控记录），随时撤回授权 / 退出质押的便捷路径。

---

## 二、English Introduction

**Q** (权) is a Puffer liquid staking Mini App that radically emphasizes wallet sovereignty and self-custody control, created for the imToken 10th Anniversary AI Co-Creation Event, targeting the "Best Expression of Self-Custody, Control, and Wallet Sovereignty" award.

It is not just another staking tool — it is a **declaration of sovereignty**.

By deeply integrating Token Core (tcx-wasm) for full-chain local key management, combined with the Token UI design system and security materials, every pixel, interaction, and word conveys one core principle: "Your assets, your decisions, your control — never handed over to anyone."

Users here are not "using a staking tool" — they are **acting as the true owners of their assets**, completing Puffer staking in a fully self-custodial environment with clarity, security, and a sense of mastery.

### Core Features

1. **Sovereign Wallet Entry**: Full self-custody via Token Core (tcx-wasm) — create wallets, import mnemonics, with 100% of key operations performed in-browser. Mnemonics and private keys never leave the browser.

2. **Puffer Sovereign Staking Flow**: Stake ETH / stETH / wstETH to mint pufETH. Every step reinforces "this is my own decision," with clear option comparisons for autonomous choice.

3. **Ultimate Control Expression**: Full transaction preview + raw data editing, multi-layer user confirmations (each reinforcing sovereignty), custom Gas settings, manual parameter adjustments, and an "I Am the Owner" dashboard.

4. **Security & Transparency Boundaries**: Deep integration of Token UI Security materials, clear risk warnings at every step, "I bear the consequences" declarations, and detailed explanations of approval and contract risks.

5. **Asset Sovereignty Management**: Real-time pufETH balance and yield display, staking history (fully local or user-controlled), convenient paths to revoke approvals and exit staking.

---

## 三、创作笔记：主权设计理念

### 设计哲学

**权（Q）** 的设计哲学可以用一个字概括：**权**。

在中文里，"权"既意味着"权力"（power），也意味着"权利"（rights）。这个双关正是本作品的核心——用户既拥有对自己资产的权力（可以自由支配），也拥有不可剥夺的权利（自托管、隐私、控制权）。

### 主权设计的三大支柱

#### 1. 自托管（Self-Custody）—— 技术实现

自托管不是一句口号，而是通过技术实现的承诺：

- **Token Core (tcx-wasm) 深度集成**：所有密钥操作——创建钱包、导入助记词、派生账户、签名交易——全部通过 tcx-wasm 在浏览器端完成。没有任何密钥材料经过网络传输。
- **零后端架构**：本应用不设后端服务器，纯前端应用。用户的 keystore 加密后存储在浏览器 localStorage 中，密码仅存在于用户记忆和当前会话中。
- **助记词一次性展示**：创建钱包时，助记词仅展示一次，用户必须手抄备份。展示完毕后，助记词不会再次出现在界面上——这是对安全最佳实践的严格遵守。
- **会话密钥管理**：使用 tcx-wasm 的 `cache_keystore` / `clear_cached_keystore` 管理会话内密钥缓存，锁屏时立即清除。

#### 2. 控制权（Control）—— 交互设计

控制权不是被动拥有的，而是通过交互主动行使的：

- **交易预览面板**：每笔交易在签名前都完整展示——合约地址、函数名、参数、Gas 费用。用户不是"盲签"，而是"知情签"。
- **原始数据编辑**：高级用户可以切换到十六进制编辑模式，直接修改交易 calldata。这是对"我的交易，我做主"的极致表达。
- **自定义 Gas**：Gas Price / Gas Limit / Max Fee / Priority Fee 全部可调。用户不是被动接受 Gas 估算，而是主动决定愿意支付多少。
- **多层确认流程**：风险确认 → 交易确认 → 主权确认（三步确认流程）。每一步确认都在强化"这是我自己的决定"的意识。
- **主权声明机制**：关键操作前必须勾选确认主权声明，如"我理解此操作的后果，由我自己承担全部责任"。这不是法律免责，而是主权意识的仪式化表达。

#### 3. 主权意识（Sovereignty Awareness）—— 视觉与文案

主权意识需要被感知，而不仅仅是被理解：

- **"我是主人"仪表盘**：不是"我的钱包"，而是"我是主人"——强调人的主体性，而非工具的从属性。仪表盘展示"我掌控的资产"、"我批准的权限"、"我做的决策"。
- **深色 + 金色视觉语言**：深蓝黑底色代表安全与稳重，金色点缀代表权力与主权。这不是装饰，而是视觉隐喻。
- **主权宣言**：在关键节点展示主权宣言，如"本工具绝不保管你的助记词、私钥，你始终拥有100%控制权"。这不是提示，而是承诺。
- **安全边界说明**：每一步都有清晰的安全边界说明，让用户知道"什么是安全的"、"什么是需要警惕的"、"什么是完全由自己负责的"。

### Token Core 集成的深度

本作品对 Token Core 的集成不是浅层的"调用了几个 API"，而是深度融入了产品的每一个环节：

1. **钱包生命周期**：从创建（`create_keystore`）到派生（`derive_accounts`）到签名（`sign_tx`）到缓存管理（`cache_keystore` / `clear_cached_keystore`），Token Core 覆盖了钱包的完整生命周期。
2. **安全模型对齐**：Token Core 的安全模型——密钥不离开 WASM 内存、密码学安全的密钥派生、加密存储——与产品的自托管理念完全对齐。
3. **用户体验增强**：Token Core 的高性能 WASM 实现使得密钥操作在浏览器端也能快速完成，不会因为"本地化"而牺牲用户体验。

### Token UI Security 材料的应用

本作品深度应用了 Token UI Security SKILL.md 中定义的安全规范：

1. **四级风险等级系统**：Info / Warning / Danger / Block，每个等级有对应的视觉样式和交互约束。
2. **交易预览规范**：完整展示交易数据，包括合约地址、函数名、参数，确保用户不是"盲签"。
3. **授权风险提示**：ERC-20 approve 操作时，明确解释授权的含义和风险，特别是无限授权的危险。
4. **安全清单**：每笔交易前的安全检查清单，包括合约验证状态、函数解码状态、授权额度检查等。
5. **地址显示规范**：使用缩短地址 + 完整地址可展开的方式，既保证可读性又确保可验证性。

### 为什么这个作品最能体现自托管、控制权与钱包主权

1. **技术层面**：Token Core (tcx-wasm) 的深度集成确保了自托管不是口号，而是技术现实。所有密钥操作在浏览器端完成，零服务器依赖。
2. **交互层面**：多层确认、交易预览、原始数据编辑、自定义 Gas——每一个交互都在强化用户的控制权意识。
3. **视觉层面**：深色 + 金色的视觉语言、"我是主人"仪表盘、主权宣言——每一个视觉元素都在传递主权意识。
4. **文案层面**：从"你的资产、你的决策、你的控制权"到"我理解此操作的后果，由我自己承担全部责任"——每一句文案都在强化主权意识。
5. **流程层面**：从钱包创建到质押完成，整个流程都在让用户感受到"我是自己资产的主人"，而不是"我在使用一个工具"。

**权（Q）** 不是一个功能堆砌的产品，而是一个理念驱动的作品。每一个设计决策都服务于"自托管、控制权、钱包主权"这个核心理念。
