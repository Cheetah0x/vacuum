interface RelayOrigin {
  chainId: number
  currency: string
  amount: string
  user: string
}

interface RelaySwapRequest {
  user: string
  recipient: string
  origins: RelayOrigin[]
  destinationCurrency: string
  destinationChainId: number
  tradeType: "EXACT_INPUT" | "EXACT_OUTPUT"
}

interface RelaySwapResponse {
  steps: Array<{
    id: string
    action: string
    description: string
    kind: string
    requestId: string
    items: Array<{
      status: string
      data: {
        from: string
        to: string
        data: string
        value: string
        maxFeePerGas: string
        maxPriorityFeePerGas: string
        chainId: number
      }
      check: {
        endpoint: string
        method: string
      }
    }>
  }>
  fees: any
  breakdown: any
  balances: any
  details: any
}

// Chain ID mapping for supported chains
export const CHAIN_IDS = {
  "eth-mainnet": 1,
  "matic-mainnet": 137,
  "optimism-mainnet": 10,
  "arbitrum-mainnet": 42161,
  "base-mainnet": 8453,
} as const

// USDC contract addresses by chain
export const USDC_ADDRESSES = {
  1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Ethereum
  137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // Polygon
  10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // Optimism
  42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // Arbitrum
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base
} as const

export const RelaySwapService = {
  async getSwapQuote(request: RelaySwapRequest): Promise<RelaySwapResponse> {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }

    try {
      const response = await fetch("https://api.relay.link/execute/swap/multi-input", options)

      if (!response.ok) {
        throw new Error(`Relay API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error calling Relay API:", error)
      throw error
    }
  },

  buildSwapRequest(
    userAddress: string,
    destinationChainId: number,
    origins: Array<{ chainName: string; amount: string }>,
  ): RelaySwapRequest {
    const relayOrigins: RelayOrigin[] = origins.map((origin) => {
      const chainId = CHAIN_IDS[origin.chainName as keyof typeof CHAIN_IDS]
      const usdcAddress = USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES]

      return {
        chainId,
        currency: usdcAddress,
        amount: origin.amount,
        user: userAddress,
      }
    })

    const destinationUsdcAddress = USDC_ADDRESSES[destinationChainId as keyof typeof USDC_ADDRESSES]

    return {
      user: userAddress,
      recipient: userAddress,
      origins: relayOrigins,
      destinationCurrency: destinationUsdcAddress,
      destinationChainId,
      tradeType: "EXACT_INPUT",
    }
  },

  getChainName(chainId: number): string {
    const chainMap = {
      1: "Ethereum",
      137: "Polygon",
      10: "Optimism",
      42161: "Arbitrum",
      8453: "Base",
    } as const

    return chainMap[chainId as keyof typeof chainMap] || `Chain ${chainId}`
  },

  parseUsdcAmount(amount: string, decimals: number = 6): string {
    // Convert human-readable amount to wei (USDC has 6 decimals)
    const parsed = parseFloat(amount)
    return Math.floor(parsed * Math.pow(10, decimals)).toString()
  },

  formatUsdcAmount(amount: string, decimals: number = 6): string {
    // Convert wei amount to human-readable (USDC has 6 decimals)
    const parsed = parseFloat(amount)
    return (parsed / Math.pow(10, decimals)).toFixed(2)
  },
}
