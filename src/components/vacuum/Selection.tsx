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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Configure Consolidation</h2>
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
                    chain.selected ? "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/50" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={chain.selected}
                          onCheckedChange={(checked) =>
                            handleChainSelectionChange(index, "selected", checked as boolean)
                          }
                        />
                        <div className="flex items-center gap-2">
                          <ChainIcon 
                            chainName={chain.chainName} 
                            size={24}
                            className="w-6 h-6"
                          />
                          <div>
                            <div className="font-medium">
                              {chain.chainName.replace("-mainnet", "").replace("-", " ")}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <TokenIcon symbol="USDC" size={16} className="w-4 h-4" />
                              Available: {formatUnits(BigInt(chain.maxAmount), 6)} USDC
                            </div>
                          </div>
                        </div>
                      </div>

                      {chain.selected && <Badge variant="secondary">Selected</Badge>}
                    </div>

                    {chain.selected && (
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label htmlFor={`amount-${index}`} className="text-sm">
                            Amount to consolidate
                          </Label>
                          <Input
                            id={`amount-${index}`}
                            type="text"
                            value={chain.amount}
                            onChange={(e) => {
                              const value = e.target.value
                              // Only allow numbers and decimal point
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                handleChainSelectionChange(index, "amount", value)
                              }
                            }}
                            placeholder="0.00"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button variant="outline" onClick={() => handleMaxClick(index)} className="mb-0">
                            Max
                          </Button>
                        </div>
                      </div>
                    )}
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
