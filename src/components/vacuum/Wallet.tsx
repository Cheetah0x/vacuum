"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, CheckCircle, Copy, AlertCircle } from "lucide-react"
import { formatEther } from "viem"
import type { VacuumState } from "../../types/vacuum-state"

interface WalletStepProps extends VacuumState {}

export const WalletStep: React.FC<WalletStepProps> = ({ address, isConnected, balance }) => {
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground">
          Connect your wallet to start consolidating your USDC holdings across multiple chains.
        </p>
      </div>

      {!isConnected ? (
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Wallet Required
            </CardTitle>
            <CardDescription>
              Please connect your wallet using the button in the top right corner to continue.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="max-w-md mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Wallet Connected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Address</div>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono flex-1 truncate">{address}</code>
                  <Button variant="ghost" size="sm" onClick={copyAddress} className="h-8 w-8 p-0">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {balance && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">ETH Balance</div>
                  <div className="font-semibold">{Number.parseFloat(formatEther(balance.value)).toFixed(4)} ETH</div>
                </div>
              )}

              <div className="flex items-center justify-center">
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  Ready to proceed
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
