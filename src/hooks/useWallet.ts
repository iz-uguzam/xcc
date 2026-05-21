import { useState, useCallback } from 'react';
import { useAppStore } from '@/stores/appStore';
import {
  initWasm,
  createWallet,
  importWallet,
  deriveEthereumAccount,
  signTransaction,
  cacheKeystore,
  clearCache,
} from '@/lib/tcx';
import {
  getEthBalance,
  getTokenBalance,
  getNonce,
  getGasPrice,
  broadcastTransaction,
  PUFFER_ADDRESSES,
} from '@/lib/ethereum';

export function useWallet() {
  const {
    wallet,
    walletPassword,
    setWallet,
    setWalletPassword,
    setBalances,
    setGasConfig,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateWallet = useCallback(
    async (password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await initWasm();
        const result = await createWallet(password);
        const account = await deriveEthereumAccount(result.keystoreJson, password);
        await cacheKeystore(result.keystoreJson, password);
        setWallet({
          isInitialized: true,
          keystoreJson: result.keystoreJson,
          address: account.address,
          derivationPath: account.derivationPath,
          isLocked: false,
        });
        setWalletPassword(password);
        return result.mnemonic;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(`创建钱包失败: ${msg}`);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setWallet, setWalletPassword]
  );

  const handleImportWallet = useCallback(
    async (mnemonic: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await initWasm();
        const result = await importWallet(mnemonic, password);
        const account = await deriveEthereumAccount(result.keystoreJson, password);
        await cacheKeystore(result.keystoreJson, password);
        setWallet({
          isInitialized: true,
          keystoreJson: result.keystoreJson,
          address: account.address,
          derivationPath: account.derivationPath,
          isLocked: false,
        });
        setWalletPassword(password);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(`导入钱包失败: ${msg}`);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setWallet, setWalletPassword]
  );

  const refreshBalances = useCallback(async () => {
    if (!wallet.address) return;
    try {
      const [eth, pufETH, stETH, wstETH] = await Promise.all([
        getEthBalance(wallet.address),
        getTokenBalance(PUFFER_ADDRESSES.pufETH, wallet.address),
        getTokenBalance(PUFFER_ADDRESSES.stETH, wallet.address),
        getTokenBalance(PUFFER_ADDRESSES.wstETH, wallet.address),
      ]);
      setBalances({ eth, pufETH, stETH, wstETH });
    } catch (err) {
      console.error('Failed to refresh balances:', err);
    }
  }, [wallet.address, setBalances]);

  const refreshGasConfig = useCallback(async () => {
    if (!wallet.address) return;
    try {
      const [gasPrice, nonce] = await Promise.all([
        getGasPrice(),
        getNonce(wallet.address),
      ]);
      setGasConfig({
        maxFeePerGas: gasPrice.maxFeePerGas,
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
        nonce,
      });
    } catch (err) {
      console.error('Failed to refresh gas config:', err);
    }
  }, [wallet.address, setGasConfig]);

  const handleSignAndSend = useCallback(
    async (txData: {
      to: string;
      value: string;
      data: string;
      gasLimit: string;
      maxFeePerGas: string;
      maxPriorityFeePerGas: string;
      nonce: number;
      chainId: number;
    }) => {
      if (!wallet.keystoreJson || !walletPassword) return null;
      try {
        setIsLoading(true);
        setError(null);
        const signedTx = await signTransaction(wallet.keystoreJson, walletPassword, txData);
        const txHash = await broadcastTransaction(signedTx);
        return txHash;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(`交易失败: ${msg}`);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet.keystoreJson, walletPassword]
  );

  const handleLockWallet = useCallback(async () => {
    await clearCache();
    useAppStore.getState().lockWallet();
  }, []);

  const handleUnlockWallet = useCallback(
    async (password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        if (!wallet.keystoreJson) return false;
        await deriveEthereumAccount(wallet.keystoreJson, password);
        await cacheKeystore(wallet.keystoreJson, password);
        useAppStore.getState().unlockWallet(password);
        return true;
      } catch {
        setError('密码错误');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet.keystoreJson]
  );

  return {
    wallet,
    isLoading,
    error,
    createWallet: handleCreateWallet,
    importWallet: handleImportWallet,
    refreshBalances,
    refreshGasConfig,
    signAndSend: handleSignAndSend,
    lockWallet: handleLockWallet,
    unlockWallet: handleUnlockWallet,
    clearError: () => setError(null),
  };
}
