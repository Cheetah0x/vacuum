import { useState, useEffect } from "react"
import { GoldrushTokenBalances } from "../utils"

interface ChainSelection {
  chainName: string
  selected: boolean
  amount: string
  maxAmount: string
  usdValue: string
}

export const useMultiChainBalances = (address: string | undefined, isConnected: boolean) => {
  const [multiChainData, setMultiChainData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chainSelections, setChainSelections] = useState<ChainSelection[]>([])

  // Clear data when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setMultiChainData(null)
      setError(null)
      setChainSelections([])
    }
  }, [isConnected])

  // Update chain selections when USDC data is loaded
  useEffect(() => {
    if (multiChainData?.items) {
      const selections: ChainSelection[] = multiChainData.items
        .filter((chainData: any) => chainData.items?.length > 0)
        .map((chainData: any) => {
          const usdcToken = chainData.items[0] // Should only be USDC
          return {
            chainName: chainData.chain_name,
            selected: false,
            amount: "",
            maxAmount: usdcToken.balance || "0",
            usdValue: usdcToken.quote || "0",
          }
        })
      setChainSelections(selections)
    }
  }, [multiChainData])

  const fetchMultiChainBalances = async () => {
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      const data = await GoldrushTokenBalances(address)
      setMultiChainData(data)
    } catch (err) {
      setError("Failed to fetch multi-chain balances")
      console.error("Error fetching balances:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChainSelectionChange = (
    index: number,
    field: "selected" | "amount",
    value: boolean | string,
  ) => {
    setChainSelections((prev) => {
      const updated = [...prev]
      if (field === "selected") {
        updated[index].selected = value as boolean
        if (!value) updated[index].amount = "" // Clear amount if deselected
      } else {
        updated[index].amount = value as string
      }
      return updated
    })
  }

  const handleMaxClick = (index: number) => {
    setChainSelections((prev) => {
      const updated = [...prev]
      updated[index].amount = updated[index].maxAmount
      return updated
    })
  }

  return {
    multiChainData,
    loading,
    error,
    chainSelections,
    fetchMultiChainBalances,
    handleChainSelectionChange,
    handleMaxClick,
    setError
  }
}

export type { ChainSelection } 