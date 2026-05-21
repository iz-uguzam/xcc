export interface WalletState {
  isInitialized: boolean;
  keystoreJson: string | null;
  address: string | null;
  derivationPath: string;
  isLocked: boolean;
}

export interface AccountInfo {
  address: string;
  derivationPath: string;
  chain: string;
  chainId: string;
  network: string;
}

export interface StakingState {
  asset: 'eth' | 'steth' | 'wsteth';
  amount: string;
  estimatedPufETH: string;
  gasEstimate: string;
}

export interface TransactionPreview {
  to: string;
  value: string;
  data: string;
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  nonce: number;
  chainId: number;
  decodedFunction?: {
    name: string;
    params: { name: string; type: string; value: string }[];
  };
}

export interface RiskAssessment {
  level: 'info' | 'warning' | 'danger' | 'block';
  title: string;
  description: string;
  checklist: { id: string; label: string; passed: boolean; description: string }[];
}

export interface SovereigntyConfirmation {
  id: string;
  declaration: string;
  confirmed: boolean;
  timestamp?: number;
}

export interface DashboardData {
  ethBalance: string;
  pufETHBalance: string;
  stETHBalance: string;
  wstETHBalance: string;
  totalStaked: string;
  estimatedAPY: string;
  stakingHistory: StakingRecord[];
  activeApprovals: ApprovalRecord[];
}

export interface StakingRecord {
  id: string;
  type: 'stake' | 'unstake';
  asset: string;
  amount: string;
  pufETHReceived: string;
  txHash: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface ApprovalRecord {
  token: string;
  tokenSymbol: string;
  spender: string;
  spenderName: string;
  allowance: string;
  isUnlimited: boolean;
}

export interface GasConfig {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  gasLimit: string;
  nonce: number;
}

export type AppView =
  | 'welcome'
  | 'create-wallet'
  | 'import-wallet'
  | 'passkey-wallet'
  | 'backup-mnemonic'
  | 'dashboard'
  | 'stake'
  | 'stake-preview'
  | 'stake-confirm'
  | 'stake-success'
  | 'transaction-detail'
  | 'approvals'
  | 'sovereign-declaration';
