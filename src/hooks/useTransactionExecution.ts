import { useState, useEffect } from "react"
import { useSendTransaction, useSwitchChain } from "wagmi"
import type { RelayExecutionPlan } from "../utils"

export const useTransactionExecution = (
  currentChainId: number | undefined,
  executionPlan: RelayExecutionPlan | null,
  isConnected: boolean
) => {
  const [executing, setExecuting] = useState(false)
  const [currentTxIndex, setCurrentTxIndex] = useState(0)
  const [completedTxs, setCompletedTxs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const { sendTransaction } = useSendTransaction()
  const { switchChain } = useSwitchChain()

  // Clear execution state when wallet disconnects or execution plan changes
  useEffect(() => {
    if (!isConnected || !executionPlan) {
      setCurrentTxIndex(0)
      setCompletedTxs([])
      setExecuting(false)
      setError(null)
    }
  }, [isConnected, executionPlan])

  const executeNextTransaction = async () => {
    if (!executionPlan || !executionPlan.transactions[currentTxIndex]) return

    const tx = executionPlan.transactions[currentTxIndex]

    try {
      setExecuting(true)
      setError(null)

      // Switch to the correct chain if needed
      if (currentChainId !== tx.chainId) {
        await switchChain({ chainId: tx.chainId })
        // Wait a bit for chain switch to complete
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Send the transaction
      const result = await sendTransaction({
        to: tx.to,
        data: tx.data,
        value: tx.value,
        gas: tx.gas,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      })

      // Mark transaction as completed - use request ID as identifier
      const txIdentifier =
        typeof result === "string" ? result : tx.requestId || `tx-${currentTxIndex}`
      setCompletedTxs((prev) => [...prev, txIdentifier])
      setCurrentTxIndex((prev) => prev + 1)
    } catch (err) {
      console.error("Transaction failed:", err)
      setError(`Transaction failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setExecuting(false)
    }
  }

  const resetExecution = () => {
    setCurrentTxIndex(0)
    setCompletedTxs([])
    setExecuting(false)
    setError(null)
  }

  const isExecutionComplete = executionPlan && currentTxIndex >= executionPlan.transactions.length

  return {
    executing,
    currentTxIndex,
    completedTxs,
    error,
    isExecutionComplete,
    executeNextTransaction,
    resetExecution,
    setError
  }
} 