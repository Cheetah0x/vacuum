import { useState } from "react"
import { useAccount, useBalance } from "wagmi"
import { useMultiChainBalances } from "./useMultiChainBalances"
import { useConsolidation } from "./useConsolidation"
import { useTransactionExecution } from "./useTransactionExecution"

export const useVacuumState = () => {
  const { address, isConnected, chainId: currentChainId } = useAccount()
  const { data: balance } = useBalance({ address })
  
  const [destinationChain, setDestinationChain] = useState<number>(8453) // Default to Base
  const [globalError, setGlobalError] = useState<string | null>(null)

  // Multi-chain balances hook
  const {
    multiChainData,
    loading: balancesLoading,
    error: balancesError,
    chainSelections,
    fetchMultiChainBalances,
    handleChainSelectionChange,
    handleMaxClick,
    setError: setBalancesError
  } = useMultiChainBalances(address, isConnected)

  // Consolidation hook
  const {
    consolidating,
    consolidationQuote,
    executionPlan,
    error: consolidationError,
    getConsolidationQuote,
    resetConsolidation,
    setError: setConsolidationError
  } = useConsolidation(address)

  // Transaction execution hook
  const {
    executing,
    currentTxIndex,
    completedTxs,
    error: executionError,
    isExecutionComplete,
    executeNextTransaction,
    resetExecution,
    setError: setExecutionError
  } = useTransactionExecution(currentChainId, executionPlan, isConnected)

  // Combine all errors
  const error = globalError || balancesError || consolidationError || executionError

  // Helper to get consolidation quote
  const handleGetConsolidationQuote = () => {
    getConsolidationQuote(chainSelections, destinationChain)
  }

  // Helper to reset all state
  const resetAllState = () => {
    resetConsolidation()
    resetExecution()
    setGlobalError(null)
    setBalancesError(null)
    setConsolidationError(null)
    setExecutionError(null)
  }

  // Helper to set any error
  const setError = (error: string | null) => {
    setGlobalError(error)
  }

  // Calculate totals
  const totalSelectedAmount = chainSelections
    .filter((chain) => chain.selected && Number.parseFloat(chain.amount) > 0)
    .reduce((sum, chain) => sum + Number.parseFloat(chain.amount), 0)

  const totalSelectedUsdValue = chainSelections
    .filter((chain) => chain.selected && Number.parseFloat(chain.amount) > 0)
    .reduce((sum, chain) => {
      const ratio = Number.parseFloat(chain.amount) / Number.parseFloat(chain.maxAmount || "1")
      return sum + Number.parseFloat(chain.usdValue) * ratio
    }, 0)

  return {
    // Wallet state
    address,
    isConnected,
    currentChainId,
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
    consolidationQuote,
    executionPlan,
    handleGetConsolidationQuote,

    // Transaction execution
    executing,
    currentTxIndex,
    completedTxs,
    isExecutionComplete,
    executeNextTransaction,

    // Error handling
    error,
    setError,

    // Utility functions
    resetAllState,
    resetConsolidation,
    resetExecution,

    // Calculated values
    totalSelectedAmount,
    totalSelectedUsdValue,
  }
} 