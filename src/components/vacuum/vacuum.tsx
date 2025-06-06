import type React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { formatEther, formatUnits } from "viem"
import {
  Wallet,
  Search,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  DollarSign,
  Zap,
  TrendingUp,
  RefreshCw,
  Copy,
  Play,
  Target,
} from "lucide-react"
import { getChainNameFromId } from "../../utils"
import { useVacuumState } from "../../hooks"
import { chainIcons } from "../../utils/helpers"

export const Vacuum: React.FC = () => {
  const {
    // Wallet state
    address,
    isConnected,
    balance,

    // Multi-chain balances
    multiChainData,
    balancesLoading,
    chainSelections,
    fetchMultiChainBalances,
    handleChainSelectionChange,
    handleMaxClick,

    // Consolidation
    destinationChain,
    setDestinationChain,
    consolidating,
    executionPlan,
    handleGetConsolidationQuote,

    // Transaction execution
    executing,
    currentTxIndex,
    isExecutionComplete,
    executeNextTransaction,

    // Error handling
    error,
    setError,

    // Utility functions
    resetExecution,

    // Calculated values
    totalSelectedAmount,
    totalSelectedUsdValue,
  } = useVacuumState()

  const availableDestinationChains = [
    { id: 1, name: "Ethereum", icon: "🔷" },
    { id: 137, name: "Polygon", icon: "🟣" },
    { id: 10, name: "Optimism", icon: "🔴" },
    { id: 42161, name: "Arbitrum", icon: "🔵" },
    { id: 8453, name: "Base", icon: "🔵" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Fragmentation Vacuum Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Consolidate your USDC holdings across multiple blockchains
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Wallet Connection - Top Left */}
          <div className="lg:col-span-4">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 h-full">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Wallet</h3>
                  {isConnected && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />}
                </div>

                <div className="space-y-4">
                  <ConnectButton
                    accountStatus={{
                      smallScreen: "avatar",
                      largeScreen: "full",
                    }}
                    chainStatus={{
                      smallScreen: "icon",
                      largeScreen: "full",
                    }}
                    showBalance={{
                      smallScreen: false,
                      largeScreen: true,
                    }}
                  />

                  {isConnected && address && (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">Address</div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono flex-1 truncate text-slate-900 dark:text-white">
                            {address}
                          </code>
                          <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                            <Copy className="w-3 h-3 text-slate-500" />
                          </button>
                        </div>
                      </div>

                      {balance && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div className="text-xs text-slate-500 mb-1">ETH Balance</div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {Number.parseFloat(formatEther(balance.value)).toFixed(4)} ETH
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* USDC Discovery - Top Center */}
          <div className="lg:col-span-4">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 h-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Discover USDC</h3>
                  </div>
                  <button
                    onClick={fetchMultiChainBalances}
                    disabled={balancesLoading || !isConnected}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white text-sm rounded-lg transition-colors"
                  >
                    {balancesLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Scan
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {!isConnected ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-slate-500">Connect wallet to scan</p>
                    </div>
                  ) : balancesLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Scanning...</p>
                    </div>
                  ) : multiChainData?.items ? (
                    multiChainData.items.map((chainData: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {chainIcons[chainData.chain_name] || "⚡"}
                          </span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {chainData.chain_name}
                          </span>
                        </div>
                        <div className="text-right">
                          {chainData.hasError ? (
                            <span className="text-xs text-red-500">Error</span>
                          ) : chainData.items?.length > 0 ? (
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">
                                {Number.parseFloat(
                                  chainData.items[0].balance || "0",
                                ).toLocaleString()}
                              </div>
                              <div className="text-xs text-emerald-600">
                                $
                                {Number.parseFloat(
                                  chainData.items[0].quote || "0",
                                ).toLocaleString()}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">No USDC</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-slate-500">Click scan to discover USDC</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats - Top Right */}
          <div className="lg:col-span-4">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 h-full">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Summary</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">
                      Selected Amount
                    </div>
                    <div className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                      {totalSelectedAmount.toLocaleString()} USDC
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <div className="text-xs text-blue-700 dark:text-blue-300">USD Value</div>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      ${totalSelectedUsdValue.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="text-xs text-purple-700 dark:text-purple-300">Destination</div>
                    <div className="text-sm font-bold text-purple-900 dark:text-purple-100">
                      {availableDestinationChains.find((c) => c.id === destinationChain)?.name ||
                        "Select Chain"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Panel - Bottom Left */}
          {chainSelections.length > 0 && (
            <div className="lg:col-span-6">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Configure Consolidation
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Destination Selection */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Destination Chain
                      </label>
                      <select
                        value={destinationChain.toString()}
                        onChange={(e) => setDestinationChain(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {availableDestinationChains.map((chain) => (
                          <option key={chain.id} value={chain.id.toString()}>
                            {chain.icon} {chain.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Source Selection */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Select Sources
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {chainSelections.map((chain, index) => (
                          <div
                            key={chain.chainName}
                            className={`p-3 border rounded-lg transition-all ${
                              chain.selected
                                ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20"
                                : "border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <input
                                type="checkbox"
                                checked={chain.selected}
                                onChange={(e) =>
                                  handleChainSelectionChange(index, "selected", e.target.checked)
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-sm">
                                  {chainIcons[chain.chainName] || "⚡"}
                                </span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {chain.chainName}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500">
                                {formatUnits(BigInt(chain.maxAmount), 6)} USDC
                              </div>
                            </div>
                            {chain.selected && (
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={chain.amount}
                                  onChange={(e) =>
                                    handleChainSelectionChange(index, "amount", e.target.value)
                                  }
                                  placeholder="Amount"
                                  max={chain.maxAmount}
                                  min="0"
                                  step="0.01"
                                  className="flex-1 px-2 py-1 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                  onClick={() => handleMaxClick(index)}
                                  className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                                >
                                  Max
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleGetConsolidationQuote}
                      disabled={consolidating || totalSelectedAmount === 0 || !isConnected}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {consolidating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Getting Quote...
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4" />
                          Get Quote
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Execution Panel - Bottom Right */}
          {executionPlan && (
            <div className="lg:col-span-6">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">Execute Plan</h3>
                    </div>
                    <button
                      onClick={resetExecution}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Quote Summary */}
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-blue-700 dark:text-blue-300">Input: </span>
                          <span className="font-bold text-blue-900 dark:text-blue-100">
                            {executionPlan.summary.totalInput} USDC
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700 dark:text-blue-300">Output: </span>
                          <span className="font-bold text-blue-900 dark:text-blue-100">
                            {executionPlan.summary.totalOutput} USDC
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700 dark:text-blue-300">Impact: </span>
                          <span className="font-bold text-blue-900 dark:text-blue-100">
                            {executionPlan.summary.totalImpact}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700 dark:text-blue-300">Time: </span>
                          <span className="font-bold text-blue-900 dark:text-blue-100">
                            ~{executionPlan.summary.timeEstimate}s
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fees */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-center">
                        <div className="text-xs text-slate-600 dark:text-slate-400">Gas</div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {executionPlan.totalFees.gas} ETH
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-center">
                        <div className="text-xs text-slate-600 dark:text-slate-400">Relayer</div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {executionPlan.totalFees.relayer} USDC
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-center">
                        <div className="text-xs text-slate-600 dark:text-slate-400">Service</div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {executionPlan.totalFees.relayerService} USDC
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Progress
                        </span>
                        <span className="text-xs text-slate-500">
                          {currentTxIndex} / {executionPlan.transactions.length}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(currentTxIndex / executionPlan.transactions.length) * 100}%`,
                          }}
                        ></div>
                      </div>

                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {executionPlan.transactions.map((tx, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-2 p-2 rounded text-xs ${
                              index < currentTxIndex
                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                                : index === currentTxIndex
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {index < currentTxIndex ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : index === currentTxIndex ? (
                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <div className="w-3 h-3 border border-current rounded-full opacity-50" />
                              )}
                            </div>
                            <span className="flex-1 truncate">
                              {index + 1}. {getChainNameFromId(tx.chainId)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Execute Button */}
                    {!isExecutionComplete ? (
                      <button
                        onClick={executeNextTransaction}
                        disabled={executing}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {executing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4" />
                            Execute Tx {currentTxIndex + 1}
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                          Complete! 🎉
                        </div>
                        <button
                          onClick={resetExecution}
                          className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          Start New Consolidation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
