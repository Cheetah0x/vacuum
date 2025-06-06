"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Loader2, CheckCircle, ArrowRight, RefreshCw, AlertCircle } from "lucide-react"
import { getChainNameFromId } from "../../utils"
import type { VacuumState } from "../../types/vacuum-state"

interface ExecutionStepProps extends VacuumState {}

export const ExecutionStep: React.FC<ExecutionStepProps> = ({
  executionPlan,
  executing,
  currentTxIndex,
  isExecutionComplete,
  executeNextTransaction,
  resetExecution,
  error,
  setError,
}) => {
  if (!executionPlan) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Execution Plan</h3>
        <p className="text-muted-foreground">Please go back to the previous step to get a quote first.</p>
      </div>
    )
  }

  const progressPercentage = (currentTxIndex / executionPlan.transactions.length) * 100

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4">
          {isExecutionComplete ? (
            <CheckCircle className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {isExecutionComplete ? "Consolidation Complete! 🎉" : "Execute Consolidation"}
        </h2>
        <p className="text-muted-foreground">
          {isExecutionComplete
            ? "Your USDC has been successfully consolidated!"
            : "Execute your consolidation plan step by step."}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Execution Progress</span>
              <Badge variant={isExecutionComplete ? "default" : "secondary"}>
                {currentTxIndex} / {executionPlan.transactions.length} Complete
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercentage} className="w-full" />

            <div className="text-center text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Steps</CardTitle>
            <CardDescription>Each transaction will be executed sequentially</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {executionPlan.transactions.map((tx: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    index < currentTxIndex
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                      : index === currentTxIndex && executing
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                        : index === currentTxIndex
                          ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                          : "bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index < currentTxIndex ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : index === currentTxIndex && executing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : index === currentTxIndex ? (
                      <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-current rounded-full" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-current rounded-full opacity-50" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium">
                      Step {index + 1}: {getChainNameFromId(tx.chainId)}
                    </div>
                    <div className="text-sm opacity-75">
                      {index < currentTxIndex
                        ? "Completed"
                        : index === currentTxIndex && executing
                          ? "Executing..."
                          : index === currentTxIndex
                            ? "Ready to execute"
                            : "Pending"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            {!isExecutionComplete ? (
              <div className="space-y-4">
                <Button
                  onClick={executeNextTransaction}
                  disabled={executing}
                  size="lg"
                  className="w-full flex items-center gap-2"
                >
                  {executing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Executing Transaction {currentTxIndex + 1}...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      Execute Transaction {currentTxIndex + 1}
                    </>
                  )}
                </Button>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={resetExecution}
                    disabled={executing}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Plan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    Consolidation Complete!
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-300">
                    Your USDC has been successfully consolidated to your destination chain.
                  </p>
                </div>

                <Button variant="outline" onClick={resetExecution} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Start New Consolidation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="flex-1">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="text-destructive hover:text-destructive"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
