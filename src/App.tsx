import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useWallet } from '@/hooks/useWallet';
import { WelcomeScreen, CreateWalletScreen, ImportWalletScreen, BackupMnemonicScreen } from '@/components/wallet/WalletScreens';
import { StakeSelectScreen, StakePreviewScreen, StakeSuccessScreen } from '@/components/stake/StakeScreens';
import { DashboardScreen } from '@/components/dashboard/DashboardScreen';
import { ApprovalsScreen } from '@/components/security/ApprovalsScreen';
import { initWasm } from '@/lib/tcx';

type AppView =
  | 'welcome'
  | 'create-wallet'
  | 'import-wallet'
  | 'backup-mnemonic'
  | 'dashboard'
  | 'stake'
  | 'stake-preview'
  | 'stake-success'
  | 'approvals';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const {
    wallet,
    createWallet: handleCreateWallet,
    importWallet: handleImportWallet,
    signAndSend,
    refreshBalances,
    refreshGasConfig,
    isLoading,
    error,
    clearError,
  } = useWallet();

  // Initialize WASM on mount
  useEffect(() => {
    initWasm().catch(console.error);
  }, []);

  // Auto-navigate to dashboard when wallet is ready
  useEffect(() => {
    if (wallet.isInitialized && wallet.address) {
      if (currentView === 'create-wallet' || currentView === 'import-wallet' || currentView === 'backup-mnemonic') {
        // Don't auto-navigate during wallet creation flow
      } else if (currentView === 'welcome') {
        setCurrentView('dashboard');
      }
    }
  }, [wallet.isInitialized, wallet.address, currentView]);

  const onCreateWallet = async (password: string) => {
    const result = await handleCreateWallet(password);
    if (result) {
      setMnemonic(result);
      setCurrentView('backup-mnemonic');
    }
  };

  const onImportWallet = async (mnemonicStr: string, password: string) => {
    const success = await handleImportWallet(mnemonicStr, password);
    if (success) {
      setCurrentView('dashboard');
    }
  };

  const onBackupConfirmed = () => {
    setCurrentView('dashboard');
  };

  const onStake = () => {
    refreshGasConfig();
    setCurrentView('stake');
  };

  const onStakePreview = () => {
    setCurrentView('stake-preview');
  };

  const onStakeConfirm = async () => {
    const { stakingAsset, stakingAmount, gasConfig } = useAppStore.getState();
    const amountWei = stakingAsset === 'eth'
      ? (BigInt(Math.floor(parseFloat(stakingAmount) * 1e18))).toString()
      : (BigInt(Math.floor(parseFloat(stakingAmount) * 1e18))).toString();

    const txData = {
      to: PUFFER_ADDRESSES.pufferVault,
      value: stakingAsset === 'eth' ? amountWei : '0',
      data: '0xd0e30db0',
      gasLimit: gasConfig.gasLimit,
      maxFeePerGas: gasConfig.maxFeePerGas,
      maxPriorityFeePerGas: gasConfig.maxPriorityFeePerGas,
      nonce: gasConfig.nonce,
      chainId: 11155111,
    };

    const hash = await signAndSend(txData);
    if (hash) {
      setTxHash(hash);
      useAppStore.getState().addStakingRecord({
        id: Date.now().toString(36),
        type: 'stake',
        asset: stakingAsset.toUpperCase(),
        amount: stakingAmount,
        pufETHReceived: '~' + stakingAmount,
        txHash: hash,
        timestamp: Date.now(),
        status: 'pending',
      });
      setCurrentView('stake-success');
    }
  };

  const onBackToDashboard = () => {
    refreshBalances();
    setCurrentView('dashboard');
  };

  // Import PUFFER_ADDRESSES for stake confirm
  const PUFFER_ADDRESSES = {
    pufferVault: '0xB2690E7dd3E38B4D525Dc9620a4E0e7Ff61E9F84' as const,
  };

  switch (currentView) {
    case 'welcome':
      return (
        <WelcomeScreen
          onCreateWallet={() => setCurrentView('create-wallet')}
          onImportWallet={() => setCurrentView('import-wallet')}
          onPasskeyWallet={() => setCurrentView('create-wallet')}
        />
      );

    case 'create-wallet':
      return (
        <CreateWalletScreen
          onCreateWallet={onCreateWallet}
          onBack={() => setCurrentView('welcome')}
          isLoading={isLoading}
          error={error}
          clearError={clearError}
        />
      );

    case 'import-wallet':
      return (
        <ImportWalletScreen
          onImportWallet={onImportWallet}
          onBack={() => setCurrentView('welcome')}
          isLoading={isLoading}
          error={error}
          clearError={clearError}
        />
      );

    case 'backup-mnemonic':
      return (
        <BackupMnemonicScreen
          mnemonic={mnemonic}
          onConfirmed={onBackupConfirmed}
        />
      );

    case 'dashboard':
      return (
        <DashboardScreen
          onStake={onStake}
          onApprovals={() => setCurrentView('approvals')}
        />
      );

    case 'stake':
      return (
        <StakeSelectScreen
          onProceed={onStakePreview}
          onBack={() => setCurrentView('dashboard')}
          ethBalance={useAppStore.getState().ethBalance}
        />
      );

    case 'stake-preview':
      return (
        <StakePreviewScreen
          onConfirm={onStakeConfirm}
          onBack={() => setCurrentView('stake')}
          gasConfig={useAppStore.getState().gasConfig}
          onGasChange={(config) => useAppStore.getState().setGasConfig(config)}
        />
      );

    case 'stake-success':
      return (
        <StakeSuccessScreen
          txHash={txHash}
          onBackToDashboard={onBackToDashboard}
        />
      );

    case 'approvals':
      return (
        <ApprovalsScreen onBack={() => setCurrentView('dashboard')} />
      );

    default:
      return (
        <WelcomeScreen
          onCreateWallet={() => setCurrentView('create-wallet')}
          onImportWallet={() => setCurrentView('import-wallet')}
          onPasskeyWallet={() => setCurrentView('create-wallet')}
        />
      );
  }
}
