import React from 'react';
import { Shield, X, AlertTriangle, ArrowLeft } from 'lucide-react';
import { SovereignCard, SovereignButton, SovereignBadge } from '@/components/common/SovereignUI';
import { RiskBanner } from '@/components/security/SecurityComponents';
import { useAppStore } from '@/stores/appStore';
import { shortenAddress } from '@/lib/utils';

interface ApprovalsProps {
  onBack: () => void;
}

export function ApprovalsScreen({ onBack }: ApprovalsProps) {
  const { activeApprovals, setActiveApprovals } = useAppStore();

  const handleRevoke = (index: number) => {
    const newApprovals = [...activeApprovals];
    newApprovals.splice(index, 1);
    setActiveApprovals(newApprovals);
  };

  return (
    <div className="min-h-screen bg-sovereign-bg p-6">
      <div className="max-w-lg mx-auto">
        <button
          onClick={onBack}
          className="text-sovereign-text-muted hover:text-sovereign-text mb-6 text-sm flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          返回仪表盘
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-sovereign-text mb-2">授权管理</h2>
          <p className="text-sovereign-text-secondary text-sm">
            查看和管理你批准的合约权限。作为资产的主人，你有权随时撤回任何授权。
          </p>
        </div>

        <RiskBanner
          level="info"
          title="关于 ERC-20 授权"
          description="ERC-20 approve 操作允许合约代表你花费代币。无限授权（uint256.max）意味着合约可以转走你所有的该代币。建议仅授权所需数量，并定期审查已授权的合约。"
          className="mb-6"
        />

        {activeApprovals.length === 0 ? (
          <SovereignCard variant="default">
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-sovereign-text-muted mx-auto mb-3" />
              <p className="text-sovereign-text-secondary text-sm">
                当前没有活跃的授权
              </p>
              <p className="text-sovereign-text-muted text-xs mt-1">
                当你质押 stETH 或 wstETH 时，需要先授权 Puffer Vault 合约
              </p>
            </div>
          </SovereignCard>
        ) : (
          <div className="space-y-3">
            {activeApprovals.map((approval, index) => (
              <SovereignCard
                key={index}
                variant={approval.isUnlimited ? 'danger' : 'default'}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-sovereign-text">
                        {approval.tokenSymbol}
                      </span>
                      {approval.isUnlimited && (
                        <SovereignBadge variant="danger">无限授权</SovereignBadge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-sovereign-text-muted">授权给:</span>
                        <span className="text-xs text-sovereign-text font-mono">
                          {shortenAddress(approval.spender, 6)}
                        </span>
                        <span className="text-xs text-sovereign-text-muted">
                          ({approval.spenderName})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-sovereign-text-muted">授权额度:</span>
                        <span className="text-xs text-sovereign-text">
                          {approval.isUnlimited ? '无限' : approval.allowance}
                        </span>
                      </div>
                    </div>
                    {approval.isUnlimited && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <AlertTriangle className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-400">
                          无限授权意味着该合约可以转走你所有的 {approval.tokenSymbol}
                        </p>
                      </div>
                    )}
                  </div>
                  <SovereignButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleRevoke(index)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    撤回
                  </SovereignButton>
                </div>
              </SovereignCard>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-lg border border-sovereign-border/50 bg-sovereign-dark/20 p-4">
          <div className="flex items-start gap-2">
            <Shield className="h-3.5 w-3.5 text-sovereign-gold shrink-0 mt-0.5" />
            <p className="text-xs text-sovereign-text-muted leading-relaxed">
              撤回授权操作将构建一笔将授权额度设为 0 的交易，需要你签名确认。
              这是你的权利——你随时可以收回你授予的权限。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
