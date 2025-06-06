import { parseUnits, type Address, type Hex } from "viem"

export interface RelayTransactionRequest {
  from: Address
  to: Address
  data: Hex
  value: bigint
  chainId: number
  gas?: bigint
  gasPrice?: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  requestId: string
}

export interface RelayApprovalDetails {
  approvalAmount: string
  spenderAddress: Address
  tokenAddress: Address
  chainId: number
}

export interface RelayExecutionPlan {
  transactions: RelayTransactionRequest[]
  totalFees: {
    gas: string
    relayer: string
    relayerGas: string
    relayerService: string
    app: string
  }
  summary: {
    totalInput: string
    totalOutput: string
    totalImpact: string
    timeEstimate: number
  }
}

/**
 * Build individual transaction request from Relay step data using Viem
 */
export function buildRelayTransactionRequest(step: any): RelayTransactionRequest {
  if (!step) {
    throw new Error("No step provided")
  }

  const item = step.items?.[0]
  if (!item) {
    throw new Error("No transaction item found in Relay step")
  }

  const txData = item.data
  if (!txData) {
    throw new Error("No transaction data found in Relay step item")
  }

  // Build the transaction request using Viem types
  const transactionRequest: RelayTransactionRequest = {
    from: txData.from as Address,
    to: txData.to as Address,
    data: (txData.data || "0x") as Hex,
    value: BigInt(txData.value || "0"),
    chainId: Number(txData.chainId) || 1,
    requestId: step.requestId || "",
  }

  // Add gas parameters if present
  if (txData.gas) {
    transactionRequest.gas = BigInt(txData.gas)
  }

  if (txData.gasPrice) {
    transactionRequest.gasPrice = BigInt(txData.gasPrice)
  }

  if (txData.maxFeePerGas) {
    transactionRequest.maxFeePerGas = BigInt(txData.maxFeePerGas)
  }

  if (txData.maxPriorityFeePerGas) {
    transactionRequest.maxPriorityFeePerGas = BigInt(txData.maxPriorityFeePerGas)
  }

  return transactionRequest
}

/**
 * Build all transaction requests from Relay multi-input response
 */
export function buildRelayExecutionPlan(relayQuote: any): RelayExecutionPlan {
  if (!relayQuote?.steps || relayQuote.steps.length === 0) {
    throw new Error("No steps found in Relay quote")
  }

  // Build transaction for each step
  const transactions: RelayTransactionRequest[] = relayQuote.steps.map((step: any) => {
    return buildRelayTransactionRequest(step)
  })

  // Extract fee information
  const fees = relayQuote.fees || {}
  const totalFees = {
    gas: fees.gas?.amountFormatted || "0",
    relayer: fees.relayer?.amountFormatted || "0",
    relayerGas: fees.relayerGas?.amountFormatted || "0",
    relayerService: fees.relayerService?.amountFormatted || "0",
    app: fees.app?.amountFormatted || "0",
  }

  // Extract summary information
  const details = relayQuote.details || {}
  const summary = {
    totalInput: details.currencyIn?.amountFormatted || "0",
    totalOutput: details.currencyOut?.amountFormatted || "0",
    totalImpact: details.totalImpact?.usd || "0",
    timeEstimate: details.timeEstimate || 0,
  }

  return {
    transactions,
    totalFees,
    summary,
  }
}

/**
 * Extract approval details for USDC token approvals
 * Note: For multi-input swaps, we might need multiple approvals
 */
export function extractRelayApprovalDetails(quote: any): RelayApprovalDetails[] {
  if (!quote?.steps) {
    throw new Error("No steps in Relay quote")
  }

  const approvalDetails: RelayApprovalDetails[] = []

  // For each step, we might need to approve the token spend
  quote.steps.forEach((step: any) => {
    const item = step.items?.[0]
    if (!item?.data) return

    const txData = item.data
    const spenderAddress = txData.to as Address
    const chainId = Number(txData.chainId)

    // For USDC transfers, the 'to' address is the USDC contract
    // The spender in the approval would be the relay contract
    // We'll extract this from the transaction data if it's a transfer

    // Check if this is a USDC transfer (ERC20 transfer function signature)
    if (txData.data && txData.data.startsWith("0xa9059cbb")) {
      // This is a transfer() call to USDC contract
      // The amount is embedded in the data, but for approvals we typically
      // want to approve the relay contract to spend our tokens

      // For Relay, the spender is typically the relay contract address
      // which should be extractable from the transaction or quote details
      const approvalAmount = quote.details?.currencyIn?.amount || "0"

      approvalDetails.push({
        approvalAmount,
        spenderAddress, // This might need adjustment based on actual Relay implementation
        tokenAddress: txData.to as Address, // USDC contract address
        chainId,
      })
    }
  })

  return approvalDetails
}

/**
 * Group transactions by chain for easier execution
 */
export function groupTransactionsByChain(
  transactions: RelayTransactionRequest[],
): Record<number, RelayTransactionRequest[]> {
  return transactions.reduce((groups, tx) => {
    const chainId = tx.chainId
    if (!groups[chainId]) {
      groups[chainId] = []
    }
    groups[chainId].push(tx)
    return groups
  }, {} as Record<number, RelayTransactionRequest[]>)
}

/**
 * Get chain name from chain ID for display purposes
 */
export function getChainNameFromId(chainId: number): string {
  const chainNames: Record<number, string> = {
    1: "Ethereum",
    137: "Polygon",
    10: "Optimism",
    42161: "Arbitrum",
    8453: "Base",
  }
  return chainNames[chainId] || `Chain ${chainId}`
}

/**
 * Calculate total gas cost across all transactions
 */
export function calculateTotalGasCost(transactions: RelayTransactionRequest[]): {
  totalGasUnits: bigint
  chainBreakdown: Record<number, { gasUnits: bigint; chainName: string }>
} {
  let totalGasUnits = 0n
  const chainBreakdown: Record<number, { gasUnits: bigint; chainName: string }> = {}

  transactions.forEach((tx) => {
    const gasUnits = tx.gas || 0n
    totalGasUnits += gasUnits

    if (!chainBreakdown[tx.chainId]) {
      chainBreakdown[tx.chainId] = {
        gasUnits: 0n,
        chainName: getChainNameFromId(tx.chainId),
      }
    }
    chainBreakdown[tx.chainId].gasUnits += gasUnits
  })

  return { totalGasUnits, chainBreakdown }
}
