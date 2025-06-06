"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Loader2, DollarSign, Clock, Zap } from "lucide-react"
import type { VacuumState } from "../../types/vacuum-state"

interface ReviewStepProps extends VacuumState {}

const availableDestinationChains = [
  { id: 1, name: "Ethereum", icon: "🔷" },
  { id: 137, name: "Polygon", icon: "🟣" },
  { id: 10, name: "Optimism", icon: "🔴" },
  { id: 42161, name: "Arbitrum", icon: "🔵" },
  { id: 8453, name: "Base", icon: "🔵" },
]

export const ReviewStep: React.FC<ReviewStepProps> = ({
  chainSelections,
  destinationChain,
  totalSelectedAmount,
  totalSelectedUsdValue,
  executionPlan,
  consolidating,
  handleGetConsolidationQuote,
  isConnected,
}) => {
  const selectedChains = chainSelections.filter((chain) => chain.selected && Number.parseFloat(chain.amount) > 0)
  const selectedDestination = availableDestinationChains.find((c) => c.id === destinationChain)

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Review & Get Quote</h2>
        <p className="text-muted-foreground">Review your consolidation plan and get a detailed quote with fees.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Consolidation Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Consolidation Plan</CardTitle>
            <CardDescription>Summary of your USDC consolidation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-xl font-bold">{totalSelectedAmount.toLocaleString()} USDC</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">USD Value</div>
                <div className="text-xl font-bold">${totalSelectedUsdValue.toLocaleString()}</div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Source Chains ({selectedChains.length})</h4>
              <div className="space-y-2">
                {selectedChains.map((chain, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">{chain.chainName.replace("-mainnet", "").replace("-", " ")}</span>
                    <span className="font-medium">{Number.parseFloat(chain.amount).toLocaleString()} USDC</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Destination</h4>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <span className="text-lg">{selectedDestination?.icon}</span>
                <span className="font-medium">{selectedDestination?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card>
          <CardHeader>
            <CardTitle>Get Quote</CardTitle>
            <CardDescription>Get detailed pricing and fee information for your consolidation</CardDescription>
          </CardHeader>
          <CardContent>
            {!executionPlan ? (
              <div className="text-center py-6">
                <Button
                  onClick={handleGetConsolidationQuote}
                  disabled={consolidating || totalSelectedAmount === 0 || !isConnected}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {consolidating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Getting Quote...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5" />
                      Get Detailed Quote
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">This will calculate exact fees and execution time</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Quote Ready
                  </Badge>
                </div>

                {/* Quote Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <div className="text-sm text-blue-700 dark:text-blue-300">Input Amount</div>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {executionPlan.summary.totalInput} USDC
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                    <div className="text-sm text-emerald-700 dark:text-emerald-300">Output Amount</div>
                    <div className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                      {executionPlan.summary.totalOutput} USDC
                    </div>
                  </div>
                </div>

                {/* Fees Breakdown */}
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Fee Breakdown
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="text-xs text-muted-foreground">Gas Fees</div>
                      <div className="font-semibold">{executionPlan.totalFees.gas} ETH</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="text-xs text-muted-foreground">Relayer Fee</div>
                      <div className="font-semibold">{executionPlan.totalFees.relayer} USDC</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="text-xs text-muted-foreground">Service Fee</div>
                      <div className="font-semibold">{executionPlan.totalFees.relayerService} USDC</div>
                    </div>
                  </div>
                </Card>

                {/* Additional Info */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Estimated Time</span>
                  </div>
                  <span className="font-medium">~{executionPlan.summary.timeEstimate}s</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Price Impact</span>
                  </div>
                  <span className="font-medium">{executionPlan.summary.totalImpact}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
