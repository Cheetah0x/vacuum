import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Target, DollarSign } from "lucide-react"
import { formatUnits } from "viem"
import type { VacuumState } from "../../types/vacuum-state"

import { ChainIcon } from "../ChainIcon"
import { TokenIcon } from "../TokenIcon"
import { getChainDisplayName } from "../../utils/helpers"

interface SelectionStepProps extends VacuumState {}


const availableDestinationChains = [
  { id: 1, name: "Ethereum", chainName: "eth-mainnet" },
  { id: 137, name: "Polygon", chainName: "matic-mainnet" },
  { id: 10, name: "Optimism", chainName: "optimism-mainnet" },
  { id: 42161, name: "Arbitrum", chainName: "arbitrum-mainnet" },
  { id: 8453, name: "Base", chainName: "base-mainnet" },
]

export const SelectionStep: React.FC<SelectionStepProps> = ({
  chainSelections,
  destinationChain,
  setDestinationChain,
  handleChainSelectionChange,
  handleMaxClick,
  totalSelectedAmount,
  totalSelectedUsdValue,
}) => {
  const selectedDestination = availableDestinationChains.find((c) => c.id === destinationChain)

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Consolidate </h2>
        <p className="text-muted-foreground">Select which chains to consolidate from and choose your destination.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Destination Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Destination Chain</CardTitle>
            <CardDescription>Choose where you want to consolidate your USDC</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={destinationChain.toString()} onValueChange={(value: string) => setDestinationChain(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select destination chain" />
              </SelectTrigger>
              <SelectContent>
                {availableDestinationChains.map((chain) => (
                  <SelectItem key={chain.id} value={chain.id.toString()}>
                    <div className="flex items-center gap-2">
                      <ChainIcon 
                        chainName={chain.chainName} 
                        size={20}
                        className="w-5 h-5"
                      />
                      <span>{chain.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Source Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Source Chains</CardTitle>
            <CardDescription>Select which chains to consolidate from and specify amounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {chainSelections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No USDC balances found. Please go back and scan for balances.
              </div>
            ) : (
              chainSelections.map((chain, index) => (
                <Card
                  key={chain.chainName}
                  className={`p-4 transition-all ${
                    Number.parseFloat(chain.amount || "0") > 0 ? "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ChainIcon 
                        chainName={chain.chainName} 
                        size={24}
                        className="w-6 h-6"
                      />
                      <div>
                        <div className="font-medium">
                          {getChainDisplayName(chain.chainName)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <TokenIcon symbol="USDC" size={16} className="w-4 h-4" />
                          Available: {formatUnits(BigInt(chain.maxAmount), 6)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <Input
                          type="text"
                          value={chain.amount || ""}
                          onChange={(e) => {
                            const value = e.target.value
                            // Only allow numbers and decimal point
                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                              handleChainSelectionChange(index, "amount", value)
                              // Automatically select/deselect based on amount
                              const hasAmount = value !== '' && Number.parseFloat(value || "0") > 0
                              handleChainSelectionChange(index, "selected", hasAmount)
                            }
                          }}
                          onFocus={(e) => {
                            // Select all text when focused if it's "0" or empty
                            if (e.target.value === "0" || e.target.value === "") {
                              e.target.select()
                            }
                          }}
                          placeholder="0"
                          className="w-24 text-right"
                        />
                      </div>
                      <Button variant="outline" onClick={() => handleMaxClick(index)} size="sm">
                        Max
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {totalSelectedAmount > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Consolidation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                  <div className="text-sm text-emerald-700 dark:text-emerald-300">Total Amount</div>
                  <div className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                    {totalSelectedAmount.toLocaleString()} USDC
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                  <div className="text-sm text-blue-700 dark:text-blue-300">Destination</div>
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <ChainIcon 
                      chainName={selectedDestination?.chainName || ""} 
                      size={20}
                      className="w-5 h-5"
                    />
                    {selectedDestination?.name}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
