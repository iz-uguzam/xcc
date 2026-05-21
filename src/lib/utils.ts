import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SEPOLIA_CONFIG } from '@/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatAmount(value: string, decimals = 6): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  if (num === 0) return '0';
  if (num < 0.000001) return '<0.000001';
  return num.toFixed(decimals).replace(/\.?0+$/, '');
}

export function weiToGwei(wei: string): string {
  const gwei = BigInt(wei) / BigInt(1000000000);
  return gwei.toString();
}

export function gweiToWei(gwei: string): string {
  return (BigInt(Math.floor(parseFloat(gwei) * 1e9))).toString();
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function getExplorerUrl(hash: string, type: 'tx' | 'address' = 'tx'): string {
  return `${SEPOLIA_CONFIG.blockExplorer}/${type}/${hash}`;
}
