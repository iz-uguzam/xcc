import React, { useEffect } from 'react';
import {
  Shield,
  Wallet,
  TrendingUp,
  Lock,
  Unlock,
  ArrowRight,
  Eye,
  History,
  Crown,
  Layers,
  Activity,
} from 'lucide-react';
import { SovereignCard, SovereignButton, SovereignBadge } from '@/components/common/SovereignUI';
import { useAppStore } from '@/stores/appStore';
import { useWallet } from '@/hooks/useWallet';
import { formatAmount, shortenAddress } from '@/lib/utils';
import { SEPOLIA_CONFIG } from '@/constants';

interface DashboardProps {
  onStake: () => void;
  onApprovals: () => void;
}

export function DashboardScreen({ onStake, onApprovals }: DashboardProps) {
  const {
    wallet,
    ethBalance,
    pufETHBalance,
    stETHBalance,
    wstETHBalance,
    stakingHistory,
    activeApprovals,
  } = useAppStore();
  const { refreshBalances, lockWallet, isLoading } = useWallet();

  useEffect(() => {
    if (wallet.address) {
      refreshBalances();
      const interval = setInterval(refreshBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [wallet.address, refreshBalances]);

  return (
    <div className="min-h-screen bg-sovereign-bg">
      {/* Header */}
      <div className="border-b border-sovereign-border bg-sovereign-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-sovereign-gold/30 bg-sovereign-gold/5 flex items-center justify-center">
              <span className="text-sm font-bold text-sovereign-gold">权</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-sovereign-text">主权仪表盘</p>
              <p className="text-xs text-sovereign-text-muted font-mono">
                {shortenAddress(wallet.address || '', 6)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SovereignBadge variant="info">{SEPOLIA_CONFIG.name}</SovereignBadge>
            <button
              onClick={lockWallet}
              className="p-2 rounded-lg border border-sovereign-border hover:border-sovereign-gold/30 text-sovereign-text-muted hover:text-sovereign-gold transition-all"
              title="锁定钱包"
            >
              <Lock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-6 space-y-4">
        {/* Sovereignty Banner */}
        <SovereignCard variant="gold" glow className="animate-fade-in">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-sovereign-gold" />
            <div>
              <p className="text-sm font-bold text-sovereign-gold">我是主人</p>
              <p className="text-xs text-sovereign-text-secondary">
                我掌控我的资产 · 我批准我的权限 · 我做出我的决策
              </p>
            </div>
          </div>
        </SovereignCard>

        {/* Asset Overview */}
        <SovereignCard className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-4 w-4 text-sovereign-gold" />
            <h3 className="text-sm font-semibold text-sovereign-text">我掌控的资产</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">⟠</span>
                <span className="text-sm text-sovereign-text-secondary">ETH</span>
              </div>
              <span className="text-lg font-bold text-sovereign-text">
                {formatAmount(ethBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🟡</span>
                <span className="text-sm text-sovereign-text-secondary">pufETH</span>
              </div>
              <span className="text-lg font-bold text-sovereign-gold">
                {formatAmount(pufETHBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">◎</span>
                <span className="text-sm text-sovereign-text-secondary">stETH</span>
              </div>
              <span className="text-sm font-medium text-sovereign-text">
                {formatAmount(stETHBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">◉</span>
                <span className="text-sm text-sovereign-text-secondary">wstETH</span>
              </div>
              <span className="text-sm font-medium text-sovereign-text">
                {formatAmount(wstETHBalance)}
              </span>
            </div>
          </div>
        </SovereignCard>

        {/* My Decisions */}
        <SovereignCard className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-sovereign-gold" />
            <h3 className="text-sm font-semibold text-sovereign-text">我的决策</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SovereignButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={onStake}
            >
              <TrendingUp className="h-4 w-4 mr-1.5" />
              质押
            </SovereignButton>
            <SovereignButton
              variant="secondary"
              size="md"
              className="w-full"
              onClick={onApprovals}
            >
              <Shield className="h-4 w-4 mr-1.5" />
              授权管理
            </SovereignButton>
          </div>
        </SovereignCard>

        {/* My Approved Permissions */}
        {activeApprovals.length > 0 && (
          <SovereignCard className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-sovereign-gold" />
                <h3 className="text-sm font-semibold text-sovereign-text">我批准的权限</h3>
              </div>
              <SovereignBadge variant="warning">{activeApprovals.length}</SovereignBadge>
            </div>
            <div className="space-y-2">
              {activeApprovals.slice(0, 3).map((approval, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-sovereign-text-secondary">
                    {approval.tokenSymbol} → {shortenAddress(approval.spender, 4)}
                  </span>
                  <SovereignBadge variant={approval.isUnlimited ? 'danger' : 'info'}>
                    {approval.isUnlimited ? '无限' : '有限'}
                  </SovereignBadge>
                </div>
              ))}
            </div>
          </SovereignCard>
        )}

        {/* Staking History */}
        {stakingHistory.length > 0 && (
          <SovereignCard className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-sovereign-gold" />
              <h3 className="text-sm font-semibold text-sovereign-text">我的质押记录</h3>
            </div>
            <div className="space-y-2">
              {stakingHistory.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b border-sovereign-border/50 last:border-0">
                  <div>
                    <p className="text-xs text-sovereign-text-muted">
                      {new Date(record.timestamp).toLocaleDateString('zh-CN')}
                    </p>
                    <p className="text-sm text-sovereign-text">
                      {record.amount} {record.asset}
                    </p>
                  </div>
                  <SovereignBadge
                    variant={
                      record.status === 'confirmed'
                        ? 'success'
                        : record.status === 'pending'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {record.status === 'confirmed' ? '已确认' : record.status === 'pending' ? '待确认' : '失败'}
                  </SovereignBadge>
                </div>
              ))}
            </div>
          </SovereignCard>
        )}

        {/* Security Footer */}
        <div className="rounded-lg border border-sovereign-border/50 bg-sovereign-dark/20 p-4 animate-fade-in">
          <div className="flex items-start gap-2">
            <Eye className="h-3.5 w-3.5 text-sovereign-text-muted shrink-0 mt-0.5" />
            <div className="text-xs text-sovereign-text-muted leading-relaxed">
              <p className="font-medium text-sovereign-text-secondary mb-1">安全边界</p>
              <p>• 所有密钥操作由 Token Core (tcx-wasm) 在浏览器端完成</p>
              <p>• 本工具不存储你的助记词、私钥或密码</p>
              <p>• 交易签名完全在本地进行，不经过任何服务器</p>
              <p>• 当前使用 {SEPOLIA_CONFIG.name} 进行演示</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
