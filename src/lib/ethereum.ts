import { createPublicClient, http, formatEther, formatUnits, parseEther, parseUnits, type Hex } from 'viem';
import { sepolia } from 'viem/chains';
import { SEPOLIA_CONFIG, PUFFER_ADDRESSES } from '@/constants';

// Create public client for reading blockchain data
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(SEPOLIA_CONFIG.rpcUrl),
});

// ERC20 ABI (minimal)
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: 'remaining', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const;

/**
 * Get ETH balance for an address
 */
export async function getEthBalance(address: string): Promise<string> {
  try {
    const balance = await publicClient.getBalance({
      address: address as Hex,
    });
    return formatEther(balance);
  } catch (error) {
    console.error('Failed to get ETH balance:', error);
    return '0';
  }
}

/**
 * Get ERC-20 token balance
 */
export async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string
): Promise<string> {
  try {
    const balance = await publicClient.readContract({
      address: tokenAddress as Hex,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [walletAddress as Hex],
    });
    const decimals = await publicClient.readContract({
      address: tokenAddress as Hex,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });
    return formatUnits(balance as bigint, decimals as number);
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return '0';
  }
}

/**
 * Get ERC-20 allowance
 */
export async function getTokenAllowance(
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<string> {
  try {
    const allowance = await publicClient.readContract({
      address: tokenAddress as Hex,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [ownerAddress as Hex, spenderAddress as Hex],
    });
    const decimals = await publicClient.readContract({
      address: tokenAddress as Hex,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });
    return formatUnits(allowance as bigint, decimals as number);
  } catch (error) {
    console.error('Failed to get allowance:', error);
    return '0';
  }
}

/**
 * Get transaction count (nonce) for an address
 */
export async function getNonce(address: string): Promise<number> {
  try {
    return await publicClient.getTransactionCount({
      address: address as Hex,
    });
  } catch (error) {
    console.error('Failed to get nonce:', error);
    return 0;
  }
}

/**
 * Get current gas price
 */
export async function getGasPrice(): Promise<{
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}> {
  try {
    const block = await publicClient.getBlock();
    const baseFee = block.baseFeePerGas || BigInt(1000000000); // 1 Gwei fallback
    const maxPriorityFeePerGas = BigInt(1000000000); // 1 Gwei
    const maxFeePerGas = baseFee * BigInt(2) + maxPriorityFeePerGas;
    return {
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    };
  } catch (error) {
    console.error('Failed to get gas price:', error);
    return {
      maxFeePerGas: '3000000000',
      maxPriorityFeePerGas: '1000000000',
    };
  }
}

/**
 * Build a deposit transaction for Puffer Vault
 */
export function buildDepositTx(amountWei: string): {
  to: string;
  value: string;
  data: string;
} {
  // deposit() function selector = 0xd0e30db0
  return {
    to: PUFFER_ADDRESSES.pufferVault,
    value: amountWei,
    data: '0xd0e30db0',
  };
}

/**
 * Build an ERC-20 approve transaction
 */
export function buildApproveTx(
  tokenAddress: string,
  spenderAddress: string,
  amountWei: string
): {
  to: string;
  value: string;
  data: string;
} {
  const approveSelector = '0x095ea7b3';
  const paddedSpender = spenderAddress.replace('0x', '').toLowerCase().padStart(64, '0');
  const paddedAmount = BigInt(amountWei).toString(16).padStart(64, '0');
  return {
    to: tokenAddress,
    value: '0',
    data: approveSelector + paddedSpender + paddedAmount,
  };
}

/**
 * Decode a function selector from calldata
 */
export function decodeFunctionSelector(data: string): string {
  if (!data || data.length < 10) return 'Unknown';
  const selector = data.slice(0, 10).toLowerCase();
  const knownSelectors: Record<string, string> = {
    '0xd0e30db0': 'deposit()',
    '0x6e553f65': 'deposit(uint256)',
    '0x095ea7b3': 'approve(address,uint256)',
    '0xa9059cbb': 'transfer(address,uint256)',
    '0x23b872dd': 'transferFrom(address,address,uint256)',
    '0x2e1a7d4d': 'withdraw(uint256)',
    '0x51cff8d9': 'withdraw(uint256,address)',
  };
  return knownSelectors[selector] || `Unknown (${selector})`;
}

/**
 * Send a raw signed transaction
 */
export async function broadcastTransaction(signedTx: string): Promise<string> {
  const hash = await publicClient.sendRawTransaction({
    serializedTransaction: signedTx as Hex,
  });
  return hash;
}

export { parseEther, parseUnits, formatEther, formatUnits };
export { PUFFER_ADDRESSES, SEPOLIA_CONFIG };
