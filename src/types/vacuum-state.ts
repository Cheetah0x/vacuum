export interface VacuumState {
  // Wallet state
  address?: string
  isConnected: boolean
  balance?: any

  // Multi-chain balances
  multiChainData?: any
  balancesLoading: boolean
  chainSelections: any[]
  fetchMultiChainBalances: () => void
  handleChainSelectionChange: (index: number, field: "selected" | "amount", value: boolean | string) => void
  handleMaxClick: (index: number) => void

  // Consolidation
  destinationChain: number
  setDestinationChain: (chainId: number) => void
  consolidating: boolean
  executionPlan?: any
  handleGetConsolidationQuote: () => void

  // Transaction execution
  executing: boolean
  currentTxIndex: number
  isExecutionComplete: boolean | null
  executeNextTransaction: () => void

  // Error handling
  error?: string | null
  setError: (error: string | null) => void

  // Utility functions
  resetExecution: () => void

  // Calculated values
  totalSelectedAmount: number
  totalSelectedUsdValue: number
}
