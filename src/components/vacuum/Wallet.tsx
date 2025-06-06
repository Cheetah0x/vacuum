"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle, AlertCircle, Zap, ArrowRightLeft, Shield } from "lucide-react"
import type { VacuumState } from "../../types/vacuum-state"

interface WalletStepProps extends VacuumState {}

export const WalletStep: React.FC<WalletStepProps> = ({ isConnected }) => {
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The Fragmentation Vacuum helps you consolidate scattered assets across multiple chains into your chain of choice.
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
              Please connect your wallet using the button in the top right corner to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Wallet Connected
              </CardTitle>
              <CardDescription>
                Great! Your wallet is connected and ready to go.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  )
}
