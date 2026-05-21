import { create } from 'zustand';
import type { WalletState, StakingRecord, ApprovalRecord, GasConfig } from '@/types';

interface AppState {
  // Wallet
  wallet: WalletState;
  walletPassword: string;
  setWallet: (wallet: Partial<WalletState>) => void;
  setWalletPassword: (password: string) => void;
  lockWallet: () => void;
  unlockWallet: (password: string) => void;

  // Staking
  stakingAsset: 'eth' | 'steth' | 'wsteth';
  stakingAmount: string;
  setStakingAsset: (asset: 'eth' | 'steth' | 'wsteth') => void;
  setStakingAmount: (amount: string) => void;

  // Balances
  ethBalance: string;
  pufETHBalance: string;
  stETHBalance: string;
  wstETHBalance: string;
  setBalances: (balances: {
    eth?: string;
    pufETH?: string;
    stETH?: string;
    wstETH?: string;
  }) => void;

  // Gas
  gasConfig: GasConfig;
  setGasConfig: (config: Partial<GasConfig>) => void;

  // History
  stakingHistory: StakingRecord[];
  addStakingRecord: (record: StakingRecord) => void;

  // Approvals
  activeApprovals: ApprovalRecord[];
  setActiveApprovals: (approvals: ApprovalRecord[]) => void;

  // Sovereignty confirmations
  sovereigntyConfirmed: Record<string, boolean>;
  setSovereigntyConfirmed: (id: string, confirmed: boolean) => void;

  // Transaction
  pendingTxHash: string | null;
  setPendingTxHash: (hash: string | null) => void;

  // Raw tx editing
  rawTxData: string;
  setRawTxData: (data: string) => void;
  isEditingRawTx: boolean;
  setIsEditingRawTx: (editing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Wallet
  wallet: {
    isInitialized: false,
    keystoreJson: null,
    address: null,
    derivationPath: "m/44'/60'/0'/0/0",
    isLocked: false,
  },
  walletPassword: '',
  setWallet: (wallet) =>
    set((state) => ({ wallet: { ...state.wallet, ...wallet } })),
  setWalletPassword: (password) => set({ walletPassword: password }),
  lockWallet: () =>
    set((state) => ({
      wallet: { ...state.wallet, isLocked: true },
      walletPassword: '',
    })),
  unlockWallet: (password) =>
    set((state) => ({
      wallet: { ...state.wallet, isLocked: false },
      walletPassword: password,
    })),

  // Staking
  stakingAsset: 'eth',
  stakingAmount: '',
  setStakingAsset: (asset) => set({ stakingAsset: asset }),
  setStakingAmount: (amount) => set({ stakingAmount: amount }),

  // Balances
  ethBalance: '0',
  pufETHBalance: '0',
  stETHBalance: '0',
  wstETHBalance: '0',
  setBalances: (balances) =>
    set((state) => ({
      ethBalance: balances.eth ?? state.ethBalance,
      pufETHBalance: balances.pufETH ?? state.pufETHBalance,
      stETHBalance: balances.stETH ?? state.stETHBalance,
      wstETHBalance: balances.wstETH ?? state.wstETHBalance,
    })),

  // Gas
  gasConfig: {
    maxFeePerGas: '3000000000',
    maxPriorityFeePerGas: '1000000000',
    gasLimit: '200000',
    nonce: 0,
  },
  setGasConfig: (config) =>
    set((state) => ({ gasConfig: { ...state.gasConfig, ...config } })),

  // History
  stakingHistory: [],
  addStakingRecord: (record) =>
    set((state) => ({
      stakingHistory: [record, ...state.stakingHistory],
    })),

  // Approvals
  activeApprovals: [],
  setActiveApprovals: (approvals) => set({ activeApprovals: approvals }),

  // Sovereignty
  sovereigntyConfirmed: {},
  setSovereigntyConfirmed: (id, confirmed) =>
    set((state) => ({
      sovereigntyConfirmed: { ...state.sovereigntyConfirmed, [id]: confirmed },
    })),

  // Transaction
  pendingTxHash: null,
  setPendingTxHash: (hash) => set({ pendingTxHash: hash }),

  // Raw tx editing
  rawTxData: '',
  setRawTxData: (data) => set({ rawTxData: data }),
  isEditingRawTx: false,
  setIsEditingRawTx: (editing) => set({ isEditingRawTx: editing }),
}));
