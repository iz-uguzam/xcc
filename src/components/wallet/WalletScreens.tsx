import React, { useState } from 'react';
import { Shield, Key, FileKey, ArrowRight, Lock, Eye, AlertTriangle } from 'lucide-react';
import { SovereignCard, SovereignButton, SovereignInput } from '@/components/common/SovereignUI';
import { SovereigntyDeclaration } from '@/components/security/SecurityComponents';
import { SOVEREIGNTY_DECLARATIONS } from '@/constants';

interface WelcomeScreenProps {
  onCreateWallet: () => void;
  onImportWallet: () => void;
  onPasskeyWallet: () => void;
}

export function WelcomeScreen({ onCreateWallet, onImportWallet, onPasskeyWallet }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-sovereign-bg flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-sovereign-gold/30 bg-sovereign-gold/5 shadow-[0_0_40px_rgba(255,215,0,0.15)] animate-pulse-gold">
            <span className="text-5xl font-bold text-sovereign-gold">权</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-sovereign-text mb-3 tracking-tight">
          权 <span className="text-sovereign-text-muted text-lg font-normal">Q</span>
        </h1>
        <p className="text-sovereign-text-secondary text-lg max-w-md mx-auto leading-relaxed">
          你的资产、你的决策、你的控制权
          <br />
          <span className="text-sovereign-gold font-semibold">从不交给任何人</span>
        </p>
      </div>

      {/* Sovereignty Declaration */}
      <SovereignCard variant="gold" glow className="max-w-md w-full mb-8 animate-fade-in">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-sovereign-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-sovereign-gold mb-1">主权宣言</p>
            <p className="text-xs text-sovereign-text-secondary leading-relaxed">
              本工具基于 Token Core 构建，所有密钥操作均在你的浏览器本地完成。
              我们绝不保管你的助记词、私钥或密码。你的资产，始终由你100%控制。
            </p>
          </div>
        </div>
      </SovereignCard>

      {/* Action Buttons */}
      <div className="max-w-md w-full space-y-3 animate-fade-in">
        <SovereignButton variant="primary" size="lg" className="w-full" onClick={onCreateWallet}>
          <Key className="h-5 w-5 mr-2" />
          创建主权钱包
          <ArrowRight className="h-4 w-4 ml-auto" />
        </SovereignButton>

        <SovereignButton variant="secondary" size="lg" className="w-full" onClick={onImportWallet}>
          <FileKey className="h-5 w-5 mr-2" />
          导入已有钱包
          <ArrowRight className="h-4 w-4 ml-auto" />
        </SovereignButton>

        <SovereignButton variant="ghost" size="lg" className="w-full" onClick={onPasskeyWallet}>
          <Lock className="h-5 w-5 mr-2" />
          Passkey 钱包
        </SovereignButton>
      </div>

      {/* Security Footer */}
      <div className="max-w-md w-full mt-8 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-1.5 text-xs text-sovereign-text-muted">
          <Shield className="h-3 w-3" />
          <span>由 Token Core (tcx-wasm) 提供自托管密钥管理</span>
        </div>
        <p className="text-xs text-sovereign-text-muted mt-1">
          当前使用 Sepolia 测试网 · 仅供演示
        </p>
      </div>
    </div>
  );
}

interface CreateWalletScreenProps {
  onCreateWallet: (password: string) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function CreateWalletScreen({ onCreateWallet, onBack, isLoading, error, clearError }: CreateWalletScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sovereigntyConfirmed, setSovereigntyConfirmed] = useState(false);

  const canProceed =
    password.length >= 8 &&
    password === confirmPassword &&
    sovereigntyConfirmed;

  return (
    <div className="min-h-screen bg-sovereign-bg p-6">
      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          className="text-sovereign-text-muted hover:text-sovereign-text mb-6 text-sm"
        >
          ← 返回
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-sovereign-text mb-2">创建主权钱包</h2>
          <p className="text-sovereign-text-secondary text-sm">
            你的助记词和私钥将在浏览器本地生成，<span className="text-sovereign-gold">绝不离开你的设备</span>。
          </p>
        </div>

        <div className="space-y-4">
          <SovereignInput
            label="设置密码"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError(); }}
            placeholder="至少8位字符"
            error={password.length > 0 && password.length < 8 ? '密码至少8位' : undefined}
          />

          <SovereignInput
            label="确认密码"
            type="password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
            placeholder="再次输入密码"
            error={confirmPassword.length > 0 && password !== confirmPassword ? '密码不一致' : undefined}
          />

          <SovereigntyDeclaration
            declaration={SOVEREIGNTY_DECLARATIONS.walletCreation}
            confirmed={sovereigntyConfirmed}
            onConfirm={setSovereigntyConfirmed}
          />

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <SovereignButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => onCreateWallet(password)}
            disabled={!canProceed || isLoading}
            loading={isLoading}
          >
            <Key className="h-5 w-5 mr-2" />
            生成我的钱包
          </SovereignButton>
        </div>

        <div className="mt-6 rounded-lg border border-sovereign-border/50 bg-sovereign-dark/20 p-4">
          <div className="flex items-start gap-2">
            <Eye className="h-3.5 w-3.5 text-sovereign-text-muted shrink-0 mt-0.5" />
            <p className="text-xs text-sovereign-text-muted leading-relaxed">
              钱包创建后，你将看到12个助记词。这是恢复钱包的唯一方式，请务必安全备份。
              本工具不会存储你的助记词，关闭后将无法再次查看。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ImportWalletScreenProps {
  onImportWallet: (mnemonic: string, password: string) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function ImportWalletScreen({ onImportWallet, onBack, isLoading, error, clearError }: ImportWalletScreenProps) {
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [sovereigntyConfirmed, setSovereigntyConfirmed] = useState(false);

  const canProceed =
    mnemonic.trim().split(/\s+/).length >= 12 &&
    password.length >= 8 &&
    sovereigntyConfirmed;

  return (
    <div className="min-h-screen bg-sovereign-bg p-6">
      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          className="text-sovereign-text-muted hover:text-sovereign-text mb-6 text-sm"
        >
          ← 返回
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-sovereign-text mb-2">导入主权钱包</h2>
          <p className="text-sovereign-text-secondary text-sm">
            输入你的助记词恢复钱包。助记词仅在浏览器本地处理，<span className="text-sovereign-gold">不会发送到任何服务器</span>。
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sovereign-text-secondary mb-1.5">
              助记词
            </label>
            <textarea
              value={mnemonic}
              onChange={(e) => { setMnemonic(e.target.value); clearError(); }}
              placeholder="输入12或24个助记词，用空格分隔"
              rows={3}
              className="w-full rounded-lg border border-sovereign-border bg-sovereign-dark/50 px-4 py-2.5 text-sovereign-text placeholder-sovereign-text-muted focus:border-sovereign-gold focus:outline-none focus:ring-1 focus:ring-sovereign-gold/50 transition-all text-sm font-mono resize-none"
            />
          </div>

          <SovereignInput
            label="设置密码"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError(); }}
            placeholder="至少8位字符，用于加密本地密钥库"
            error={password.length > 0 && password.length < 8 ? '密码至少8位' : undefined}
          />

          <SovereigntyDeclaration
            declaration={SOVEREIGNTY_DECLARATIONS.walletCreation}
            confirmed={sovereigntyConfirmed}
            onConfirm={setSovereigntyConfirmed}
          />

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <SovereignButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => onImportWallet(mnemonic, password)}
            disabled={!canProceed || isLoading}
            loading={isLoading}
          >
            <FileKey className="h-5 w-5 mr-2" />
            恢复我的钱包
          </SovereignButton>
        </div>

        <div className="mt-6 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5" />
            <p className="text-xs text-orange-300/80 leading-relaxed">
              请确保你在私密环境下操作。不要在公共网络或他人设备上导入助记词。
              导入完成后，建议清除浏览器中的助记词输入记录。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BackupMnemonicScreenProps {
  mnemonic: string;
  onConfirmed: () => void;
}

export function BackupMnemonicScreen({ mnemonic, onConfirmed }: BackupMnemonicScreenProps) {
  const [confirmed, setConfirmed] = useState(false);
  const words = mnemonic.trim().split(/\s+/);

  return (
    <div className="min-h-screen bg-sovereign-bg p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-sovereign-text mb-2">备份助记词</h2>
          <p className="text-sovereign-text-secondary text-sm">
            这是你的12个助记词，是恢复钱包的唯一方式。请将其抄写在纸上并妥善保管。
          </p>
        </div>

        <SovereignCard variant="danger" className="mb-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold text-sm">安全警告</p>
              <p className="text-xs text-sovereign-text-secondary mt-1">
                • 绝不截图或拍照保存助记词<br />
                • 绝不通过网络传输助记词<br />
                • 绝不向任何人展示助记词<br />
                • 本工具不会存储你的助记词，关闭此页面后将无法再次查看
              </p>
            </div>
          </div>
        </SovereignCard>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {words.map((word, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg border border-sovereign-border bg-sovereign-dark/50 px-3 py-2"
            >
              <span className="text-xs text-sovereign-text-muted w-5">{index + 1}.</span>
              <span className="text-sm text-sovereign-text font-mono">{word}</span>
            </div>
          ))}
        </div>

        <SovereigntyDeclaration
          declaration="我已将助记词安全备份，我理解丢失助记词将导致永久失去对资产的访问权。"
          confirmed={confirmed}
          onConfirm={setConfirmed}
        />

        <SovereignButton
          variant="primary"
          size="lg"
          className="w-full mt-6"
          onClick={onConfirmed}
          disabled={!confirmed}
        >
          我已安全备份，继续
        </SovereignButton>
      </div>
    </div>
  );
}
