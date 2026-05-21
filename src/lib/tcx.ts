import init, {
  create_keystore,
  derive_accounts,
  sign_tx,
  export_mnemonic,
  cache_keystore,
  clear_cached_keystore,
} from '@consenlabs/tcx-wasm';

let wasmInitialized = false;

export async function initWasm(): Promise<void> {
  if (wasmInitialized) return;
  await init();
  wasmInitialized = true;
}

export function isWasmReady(): boolean {
  return wasmInitialized;
}

/**
 * Create a new HD wallet with a random mnemonic
 * All key material stays in the browser - NEVER sent to any server
 */
export async function createWallet(password: string): Promise<{
  keystoreJson: string;
  mnemonic: string;
}> {
  await initWasm();
  const keystoreJson = create_keystore(
    JSON.stringify({
      password,
      network: 'MAINNET',
    })
  );
  // Export mnemonic once for backup display
  const mnemonicResult = JSON.parse(
    export_mnemonic(
      JSON.stringify({
        keystoreJson,
        key: password,
      })
    )
  );
  return {
    keystoreJson,
    mnemonic: mnemonicResult.mnemonic,
  };
}

/**
 * Import wallet from existing mnemonic phrase
 * The mnemonic is processed locally - NEVER leaves the browser
 */
export async function importWallet(
  mnemonic: string,
  password: string
): Promise<{
  keystoreJson: string;
}> {
  await initWasm();
  const keystoreJson = create_keystore(
    JSON.stringify({
      password,
      mnemonic: mnemonic.trim(),
      network: 'MAINNET',
    })
  );
  return { keystoreJson };
}

/**
 * Derive Ethereum account from keystore
 * Derivation happens entirely in-browser via tcx-wasm
 */
export async function deriveEthereumAccount(
  keystoreJson: string,
  password: string
): Promise<{
  address: string;
  derivationPath: string;
}> {
  await initWasm();
  const accountsJson = derive_accounts(
    JSON.stringify({
      keystoreJson,
      key: password,
      accounts: [
        {
          chain: 'ETHEREUM',
          derivationPath: "m/44'/60'/0'/0/0",
        },
      ],
    })
  );
  const accounts = JSON.parse(accountsJson);
  return {
    address: accounts[0]?.address || '',
    derivationPath: "m/44'/60'/0'/0/0",
  };
}

/**
 * Sign an EVM transaction
 * Signing happens entirely in-browser via tcx-wasm
 */
export async function signTransaction(
  keystoreJson: string,
  password: string,
  txData: {
    to: string;
    value: string;
    data: string;
    gasLimit: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    nonce: number;
    chainId: number;
  }
): Promise<string> {
  await initWasm();
  const result = JSON.parse(
    sign_tx(
      JSON.stringify({
        keystoreJson,
        key: password,
        chain: 'ETHEREUM',
        derivationPath: "m/44'/60'/0'/0/0",
        input: {
          to: txData.to,
          value: txData.value,
          data: txData.data,
          gasLimit: txData.gasLimit,
          maxFeePerGas: txData.maxFeePerGas,
          maxPriorityFeePerGas: txData.maxPriorityFeePerGas,
          nonce: txData.nonce,
          chainId: txData.chainId,
        },
      })
    )
  );
  return result.signedTx || result.rawTx || '';
}

/**
 * Cache keystore in WASM memory for session use
 */
export async function cacheKeystore(
  keystoreJson: string,
  password: string
): Promise<void> {
  await initWasm();
  cache_keystore(
    JSON.stringify({
      keystoreJson,
      key: password,
    })
  );
}

/**
 * Clear cached keystore from WASM memory
 */
export async function clearCache(): Promise<void> {
  await initWasm();
  clear_cached_keystore();
}
