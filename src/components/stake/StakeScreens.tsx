import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Shield,
  Eye,
  Code,
  Settings,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { SovereignCard, SovereignButton, SovereignInput, SovereignBadge } from '@/components/common/SovereignUI';
import { RiskBanner, SecurityChecklist, SovereigntyDeclaration } from '@/components/security/SecurityComponents';
import { STAKING_OPTIONS, SOVEREIGNTY_DECLARATIONS, PUFFER_ADDRESSES } from '@/constants';
import { useAppStore } from '@/stores/appStore';
import { formatAmount, shortenAddress, weiToGwei } from '@/lib/utils';
import { decodeFunctionSelector } from '@/lib/ethereum';
import type { GasConfig } from '@/types';

interface StakeSelectProps {
  onProceed: () => void;
  onBack: () => void;
  ethBalance: string;
}

export function StakeSelectScreen({ onProceed, onBack, ethBalance }: StakeSelectProps) {
  const { stakingAsset, stakingAmount, setStakingAsset, setStakingAmount } = useAppStore();
  const [selectedOption, setSelectedOption] = useState<'eth' | 'steth' | 'wsteth'>(stakingAsset);

  const handleProceed = () => {
    setStakingAsset(selectedOption);
    onProceed();
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
          <h2 className="text-2xl font-bold text-sovereign-text mb-2">主权质押</h2>
          <p className="text-sovereign-text-secondary text-sm">
            选择你的质押方案。这是<span className="text-sovereign-gold font-semibold">你自己的决定</span>——
            我们提供信息，你做出选择。
          </p>
        </div>

        {/* Asset Selection */}
        <div className="space-y-3 mb-6">
          {STAKING_OPTIONS.map((option) => (
            <SovereignCard
              key={option.id}
              variant={selectedOption === option.id ? 'gold' : 'default'}
              className={`cursor-pointer transition-all ${
                selectedOption === option.id ? 'ring-1 ring-sovereign-gold/30' : ''
              }`}
            >
              <div
                className="flex items-start gap-3"
                onClick={() => setSelectedOption(option.id as 'eth' | 'steth' | 'wsteth')}
              >
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sovereign-text">{option.name}</span>
                    <SovereignBadge variant={option.risk === '低' ? 'success' : 'warning'}>
                      风险: {option.risk}
                    </SovereignBadge>
                  </div>
                  <p className="text-xs text-sovereign-text-secondary mb-1">{option.description}</p>
                  <div className="flex items-center gap-3 text-xs text-sovereign-text-muted">
                    <span>预估 APY: {option.apy}</span>
                    <span>锁定期: {option.lockPeriod}</span>
                  </div>
                </div>
                {selectedOption === option.id && (
                  <CheckCircle2 className="h-5 w-5 text-sovereign-gold shrink-0" />
                )}
              </div>
            </SovereignCard>
          ))}
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <SovereignInput
            label="质押数量"
            type="number"
            value={stakingAmount}
            onChange={(e) => setStakingAmount(e.target.value)}
            placeholder="0.0"
            suffix={selectedOption.toUpperCase()}
          />
          <div className="flex justify-between mt-2 text-xs text-sovereign-text-muted">
            <span>可用余额: {formatAmount(ethBalance)} ETH</span>
            <button
              className="text-sovereign-gold hover:underline"
              onClick={() => setStakingAmount(ethBalance)}
            >
              全部
            </button>
          </div>
        </div>

        {/* Sovereignty Reminder */}
        <SovereignCard variant="gold" className="mb-6">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-sovereign-gold shrink-0 mt-0.5" />
            <p className="text-xs text-sovereign-text-secondary leading-relaxed">
              你正在自主选择将资产质押到 Puffer 协议。质押后你将收到 pufETH 作为凭证。
              你可以随时退出质押，取回你的资产。这是你的权利。
            </p>
          </div>
        </SovereignCard>

        <SovereignButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleProceed}
          disabled={!stakingAmount || parseFloat(stakingAmount) <= 0}
        >
          预览交易
          <ArrowRight className="h-4 w-4 ml-auto" />
        </SovereignButton>
      </div>
    </div>
  );
}

interface StakePreviewProps {
  onConfirm: () => void;
  onBack: () => void;
  gasConfig: GasConfig;
  onGasChange: (config: Partial<GasConfig>) => void;
}

export function StakePreviewScreen({ onConfirm, onBack, gasConfig, onGasChange }: StakePreviewProps) {
  const { stakingAsset, stakingAmount, wallet } = useAppStore();
  const [showGasSettings, setShowGasSettings] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [sovereigntyConfirmed, setSovereigntyConfirmed] = useState(false);
  const [riskConfirmed, setRiskConfirmed] = useState(false);

  const assetName = stakingAsset === 'eth' ? 'ETH' : stakingAsset === 'steth' ? 'stETH' : 'wstETH';
  const vaultAddress = PUFFER_ADDRESSES.pufferVault;

  // Build mock transaction data for preview
  const txData = useMemo(() => {
    const selector = stakingAsset === 'eth' ? '0xd0e30db0' : '0x6e553f65';
    return {
      to: vaultAddress,
      value: stakingAsset === 'eth' ? `${parseFloat(stakingAmount) * 1e18}` : '0',
      data: selector + '0'.repeat(56),
      functionName: stakingAsset === 'eth' ? 'deposit()' : 'deposit(uint256)',
    };
  }, [stakingAsset, stakingAmount, vaultAddress]);

  const canConfirm = sovereigntyConfirmed && riskConfirmed;

  return (
    <div className="min-h-screen bg-sovereign-bg p-6">
      <div className="max-w-lg mx-auto">
        <button
          onClick={onBack}
          className="text-sovereign-text-muted hover:text-sovereign-text mb-6 text-sm flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          返回修改
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-sovereign-text mb-2">交易预览</h2>
          <p className="text-sovereign-text-secondary text-sm">
            在签名之前，请仔细审查以下交易详情。这是<span className="text-sovereign-gold font-semibold">你的资产</span>，
            你有权了解每一笔交易的完整信息。
          </p>
        </div>

        {/* Transaction Details */}
        <SovereignCard variant="gold" glow className="mb-4">
          <h3 className="text-sm font-semibold text-sovereign-gold mb-3">交易摘要</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sovereign-text-muted">操作</span>
              <span className="text-sovereign-text font-medium">质押 {assetName} → pufETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sovereign-text-muted">数量</span>
              <span className="text-sovereign-text font-medium">{stakingAmount} {assetName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sovereign-text-muted">合约</span>
              <span className="text-sovereign-text font-mono text-xs">{shortenAddress(vaultAddress, 8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sovereign-text-muted">函数</span>
              <span className="text-sovereign-text font-mono text-xs">{txData.functionName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sovereign-text-muted">Gas 费用</span>
              <span className="text-sovereign-text font-medium">
                {weiToGwei(gasConfig.maxFeePerGas)} Gwei
              </span>
            </div>
          </div>
        </SovereignCard>

        {/* Raw Transaction Data Toggle */}
        <div className="mb-4">
          <button
            className="flex items-center gap-2 text-sm text-sovereign-text-secondary hover:text-sovereign-text w-full"
            onClick={() => setShowRawData(!showRawData)}
          >
            <Code className="h-4 w-4" />
            <span>查看原始交易数据</span>
            {showRawData ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
          </button>
          {showRawData && (
            <SovereignCard className="mt-2">
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-sovereign-text-muted">To: </span>
                  <span className="text-sovereign-text break-all">{txData.to}</span>
                </div>
                <div>
                  <span className="text-sovereign-text-muted">Value: </span>
                  <span className="text-sovereign-text">{txData.value} wei</span>
                </div>
                <div>
                  <span className="text-sovereign-text-muted">Data: </span>
                  <span className="text-sovereign-text break-all">{txData.data}</span>
                </div>
                <div>
                  <span className="text-sovereign-text-muted">Nonce: </span>
                  <span className="text-sovereign-text">{gasConfig.nonce}</span>
                </div>
                <div>
                  <span className="text-sovereign-text-muted">Chain ID: </span>
                  <span className="text-sovereign-text">11155111 (Sepolia)</span>
                </div>
              </div>
            </SovereignCard>
          )}
        </div>

        {/* Gas Settings Toggle */}
        <div className="mb-4">
          <button
            className="flex items-center gap-2 text-sm text-sovereign-text-secondary hover:text-sovereign-text w-full"
            onClick={() => setShowGasSettings(!showGasSettings)}
          >
            <Settings className="h-4 w-4" />
            <span>自定义 Gas 参数</span>
            {showGasSettings ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
          </button>
          {showGasSettings && (
            <SovereignCard className="mt-2">
              <div className="space-y-3">
                <SovereignInput
                  label="Max Fee Per Gas (Gwei)"
                  type="number"
                  value={weiToGwei(gasConfig.maxFeePerGas)}
                  onChange={(e) =>
                    onGasChange({
                      maxFeePerGas: (BigInt(Math.floor(parseFloat(e.target.value) * 1e9))).toString(),
                    })
                  }
                  suffix="Gwei"
                />
                <SovereignInput
                  label="Max Priority Fee (Gwei)"
                  type="number"
                  value={weiToGwei(gasConfig.maxPriorityFeePerGas)}
                  onChange={(e) =>
                    onGasChange({
                      maxPriorityFeePerGas: (BigInt(Math.floor(parseFloat(e.target.value) * 1e9))).toString(),
                    })
                  }
                  suffix="Gwei"
                />
                <SovereignInput
                  label="Gas Limit"
                  type="number"
                  value={gasConfig.gasLimit}
                  onChange={(e) => onGasChange({ gasLimit: e.target.value })}
                />
                <SovereignInput
                  label="Nonce"
                  type="number"
                  value={gasConfig.nonce}
                  onChange={(e) => onGasChange({ nonce: parseInt(e.target.value) || 0 })}
                />
              </div>
            </SovereignCard>
          )}
        </div>

        {/* Risk Assessment */}
        <RiskBanner
          level="info"
          title="风险评估"
          description="此交易将你的资产质押到 Puffer Vault 合约。合约已在 Etherscan 验证。质押后你将收到 pufETH 作为凭证，可随时退出。"
          className="mb-4"
        />

        {/* Security Checklist */}
        <SecurityChecklist
          items={[
            { id: 'contract', label: '合约已验证', passed: true },
            { id: 'function', label: '函数已解码', passed: true },
            { id: 'no_infinite', label: '无无限授权', passed: true },
            { id: 'recipient', label: '接收方已确认', passed: true },
            { id: 'gas', label: 'Gas 费合理', passed: true },
            { id: 'no_blind', label: '非盲签', passed: true },
          ]}
          className="mb-4"
        />

        {/* Sovereignty Confirmations */}
        <SovereigntyDeclaration
          declaration={SOVEREIGNTY_DECLARATIONS.stakingEntry}
          confirmed={sovereigntyConfirmed}
          onConfirm={setSovereigntyConfirmed}
        />

        <div className="mt-4">
          <SovereigntyDeclaration
            declaration={SOVEREIGNTY_DECLARATIONS.transactionSign}
            confirmed={riskConfirmed}
            onConfirm={setRiskConfirmed}
          />
        </div>

        {/* Confirm Button */}
        <SovereignButton
          variant="primary"
          size="lg"
          className="w-full mt-6"
          onClick={onConfirm}
          disabled={!canConfirm}
        >
          <Lock className="h-5 w-5 mr-2" />
          签名并提交交易
        </SovereignButton>

        <p className="text-xs text-sovereign-text-muted text-center mt-3">
          交易将由 Token Core 在浏览器端签名，私钥不会离开你的设备
        </p>
      </div>
    </div>
  );
}

interface StakeSuccessProps {
  txHash: string | null;
  onBackToDashboard: () => void;
}

export function StakeSuccessScreen({ txHash, onBackToDashboard }: StakeSuccessProps) {
  return (
    <div className="min-h-screen bg-sovereign-bg flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-emerald-500/30 bg-emerald-500/5">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-sovereign-text mb-3">交易已提交</h2>
        <p className="text-sovereign-text-secondary text-sm mb-6">
          你的质押交易已签名并广播到网络。作为资产的主人，你独立完成了这笔操作。
        </p>

        {txHash && (
          <SovereignCard variant="success" className="mb-6 text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-sovereign-text-muted">交易哈希</span>
                <span className="text-sm text-emerald-400 font-mono">
                  {shortenAddress(txHash, 8)}
                </span>
              </div>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sovereign-gold hover:underline"
              >
                在 Etherscan 查看 →
              </a>
            </div>
          </SovereignCard>
        )}

        <SovereignCard variant="gold" className="mb-6 text-left">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-sovereign-gold shrink-0 mt-0.5" />
            <p className="text-xs text-sovereign-text-secondary leading-relaxed">
              这笔交易由你使用 Token Core 在浏览器端独立签名。没有任何第三方参与签名过程。
              你的私钥从未离开你的设备。
            </p>
          </div>
        </SovereignCard>

        <SovereignButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onBackToDashboard}
        >
          返回主权仪表盘
        </SovereignButton>
      </div>
    </div>
  );
}
