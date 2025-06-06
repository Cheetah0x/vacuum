import { useState, useEffect } from "react"
import { RelaySwapService, buildRelayExecutionPlan, type RelayExecutionPlan } from "../utils"
import type { ChainSelection } from "./useMultiChainBalances"

export const useConsolidation = (address: string | undefined) => {
  const [consolidating, setConsolidating] = useState(false)
  const [consolidationQuote, setConsolidationQuote] = useState<any>(null)
  const [executionPlan, setExecutionPlan] = useState<RelayExecutionPlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Build execution plan when quote is received
  useEffect(() => {
    if (consolidationQuote) {
      try {
        const plan = buildRelayExecutionPlan(consolidationQuote)
        setExecutionPlan(plan)
      } catch (err) {
        console.error("Error building execution plan:", err)
        setError("Failed to parse consolidation quote")
      }
    }
  }, [consolidationQuote])

  const getConsolidationQuote = async (
    chainSelections: ChainSelection[],
    destinationChain: number
  ) => {
    if (!address) return

    const selectedChains = chainSelections.filter(
      (chain) => chain.selected && Number.parseFloat(chain.amount) > 0,
    )

    if (selectedChains.length === 0) {
      setError("Please select at least one chain and amount to consolidate")
      return
    }

    setConsolidating(true)
    setError(null)

    try {
      const origins = selectedChains.map((chain) => ({
        chainName: chain.chainName,
        amount: RelaySwapService.parseUsdcAmount(chain.amount),
      }))

      const swapRequest = RelaySwapService.buildSwapRequest(address, destinationChain, origins)

      console.log("Swap request:", swapRequest)
      const quote = await RelaySwapService.getSwapQuote(swapRequest)
      setConsolidationQuote(quote)
    } catch (err) {
      setError("Failed to get consolidation quote")
      console.error("Error getting quote:", err)
    } finally {
      setConsolidating(false)
    }
  }

  const resetConsolidation = () => {
    setConsolidationQuote(null)
    setExecutionPlan(null)
    setError(null)
  }

  return {
    consolidating,
    consolidationQuote,
    executionPlan,
    error,
    getConsolidationQuote,
    resetConsolidation,
    setError
  }
} 