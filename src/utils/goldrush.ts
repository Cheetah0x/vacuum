import { GoldRushClient, ChainName } from "@covalenthq/client-sdk"

// Chain name mapping to ensure consistency
const CHAIN_NAME_MAP = {
  [ChainName.ETH_MAINNET]: "eth-mainnet",
  [ChainName.MATIC_MAINNET]: "matic-mainnet",
  [ChainName.OPTIMISM_MAINNET]: "optimism-mainnet",
  [ChainName.ARBITRUM_MAINNET]: "arbitrum-mainnet",
  [ChainName.BASE_MAINNET]: "base-mainnet",
} as const

export const GoldrushTokenBalances = async (walletAddress: string) => {
  console.log(import.meta.env.VITE_GOLDRUSH_API_KEY)
  //TODO: dont do this is prod, not safe
  const client = new GoldRushClient(import.meta.env.VITE_GOLDRUSH_API_KEY)

  try {
    // Define the chains we want to query using the ChainName enum
    const chains = [
      ChainName.ETH_MAINNET,
      ChainName.MATIC_MAINNET,
      ChainName.OPTIMISM_MAINNET,
      ChainName.ARBITRUM_MAINNET,
      ChainName.BASE_MAINNET,
    ]

    // Make concurrent calls to all chains
    const chainPromises = chains.map(async (chainName) => {
      try {
        const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
          chainName,
          walletAddress,
          {
            quoteCurrency: "USD",
          },
        )
        return { ...resp, chainName }
      } catch (error) {
        console.error(`Error fetching balances for ${chainName}:`, error)
        return {
          data: null,
          error: true,
          chainName: chainName,
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        }
      }
    })

    const responses = await Promise.all(chainPromises)

    // Combine all chain data into a single response, filtering for USDC tokens
    const combinedData = {
      items: responses
        .map((resp) => {
          if (resp.error || !resp.data) {
            return {
              chain_name: CHAIN_NAME_MAP[resp.chainName as keyof typeof CHAIN_NAME_MAP],
              items: [],
              hasError: true,
              errorMessage: "errorMessage" in resp ? resp.errorMessage : "Failed to fetch data",
            }
          }

          // Filter items to only include USDC tokens with USD quote values > 0.01
          const filteredItems =
            resp.data.items?.filter(
              (item) =>
                item &&
                item.quote !== null &&
                item.quote !== undefined &&
                parseFloat(item.quote.toString()) > 0.01 &&
                item.contract_ticker_symbol?.toUpperCase() === "USDC",
            ) || []

          return {
            chain_name: CHAIN_NAME_MAP[resp.chainName as keyof typeof CHAIN_NAME_MAP],
            items: filteredItems,
            hasError: false,
          }
        })
        .filter((item) => item.items.length > 0 || item.hasError), // Only include chains with USD balances or errors
    }

    console.log("Combined multi-chain USD balances:", combinedData)
    return combinedData
  } catch (error) {
    console.error("Error fetching multi-chain balances:", error)
    throw error
  }
}
