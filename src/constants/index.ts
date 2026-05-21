// Puffer protocol contract addresses on Sepolia testnet
export const PUFFER_ADDRESSES = {
  // Puffer Vault on Sepolia
  pufferVault: '0xB2690E7dd3E38B4D525Dc9620a4E0e7Ff61E9F84' as `0x${string}`,
  // pufETH token on Sepolia
  pufETH: '0x9E0f4c6dB0507E67C7E4D58C7468249033F8b18C' as `0x${string}`,
  // stETH on Sepolia
  stETH: '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F' as `0x${string}`,
  // wstETH on Sepolia
  wstETH: '0xB82381A3fBD3FaFA77B3a7bE693342618240067b' as `0x${string}`,
} as const;

// Sepolia testnet config
export const SEPOLIA_CONFIG = {
  chainId: 11155111,
  name: 'Sepolia Testnet',
  rpcUrl: 'https://rpc.sepolia.org',
  blockExplorer: 'https://sepolia.etherscan.io',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
} as const;

// Risk levels from Token UI Security SKILL
export type RiskLevel = 'info' | 'warning' | 'danger' | 'block';

export const RISK_COLORS: Record<RiskLevel, string> = {
  info: '#4b9cd3',
  warning: '#fc8c4d',
  danger: '#f3636f',
  block: '#dc2626',
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  info: '信息',
  warning: '警告',
  danger: '危险',
  block: '阻止',
};

// Sovereignty declarations
export const SOVEREIGNTY_DECLARATIONS = {
  walletCreation: '我理解：本工具绝不保管我的助记词或私钥，所有密钥材料仅存在于我的浏览器本地。',
  transactionSign: '我确认：这是我自己的决定，我理解此操作的后果，由我自己承担全部责任。',
  approvalGrant: '我理解：授权允许合约访问我的代币，我可以在任何时候撤回此授权。',
  stakingEntry: '我确认：我自愿将资产质押到 Puffer 协议，我已了解相关风险并自行承担。',
} as const;

// Puffer staking options
export const STAKING_OPTIONS = [
  {
    id: 'eth',
    name: 'ETH',
    fullName: 'Ethereum',
    description: '直接使用 ETH 质押，最简单的方式',
    apy: '~3.5%',
    risk: '低' as const,
    lockPeriod: '无锁定期',
    icon: '⟠',
  },
  {
    id: 'steth',
    name: 'stETH',
    fullName: 'Lido Staked ETH',
    description: '使用 Lido 的 stETH 质押，享受流动性质押收益',
    apy: '~3.2%',
    risk: '中' as const,
    lockPeriod: '无锁定期',
    icon: '◎',
  },
  {
    id: 'wsteth',
    name: 'wstETH',
    fullName: 'Wrapped Staked ETH',
    description: '使用 wstETH 质押，非重基代币，收益自动累积',
    apy: '~3.2%',
    risk: '中' as const,
    lockPeriod: '无锁定期',
    icon: '◉',
  },
] as const;

// Security checklist items
export const SECURITY_CHECKLIST = [
  { id: 'contract_verified', label: '合约已验证', description: '目标合约已在 Etherscan/Sourcify 上验证源代码' },
  { id: 'function_decoded', label: '函数已解码', description: '交易调用的函数已被识别和解码' },
  { id: 'no_infinite_approval', label: '无无限授权', description: '授权额度未设置为无限值' },
  { id: 'recipient_checked', label: '接收方已确认', description: '资产接收地址已由用户确认' },
  { id: 'gas_reasonable', label: 'Gas 费合理', description: 'Gas 费用在正常范围内' },
  { id: 'no_blind_sign', label: '非盲签', description: '交易内容已完整展示给用户' },
] as const;
