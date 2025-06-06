export const chainIcons: Record<string, string> = {
  "eth": "/chains/eth.svg",
  "ethereum": "/chains/eth.svg",
  "matic": "/chains/polygon.svg",
  "polygon": "/chains/polygon.svg",
  "optimism": "/chains/op.svg",
  "op": "/chains/op.svg",
  "arbitrum": "/chains/arb.svg",
  "arb": "/chains/arb.svg",
  "base": "/chains/base.svg",
}

// Function to normalize chain names from API responses
export const normalizeChainName = (chainName: string): string => {
  return chainName
    .toLowerCase()
    .replace("-mainnet", "")
    .replace("-testnet", "")
    .replace("_", "")
    .trim()
}

export const getChainIconData = (chainName: string) => {
  const normalizedName = normalizeChainName(chainName)
  const iconPath = chainIcons[normalizedName]
  
  return {
    src: iconPath,
    alt: chainName,
    hasIcon: !!iconPath
  }
}
