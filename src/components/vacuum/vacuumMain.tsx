
import React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { useVacuumState } from "../../hooks"
import { WalletStep } from "./Wallet"
import { DiscoveryStep } from "./Discovery"
import { SelectionStep } from "./Selection"
import { ReviewStep } from "./Review"
import { ExecutionStep } from "./Execution"

const STEPS = [
  { id: "wallet", title: "Connect Wallet", description: "Connect your wallet to get started" },
  { id: "discovery", title: "Discover USDC", description: "Scan for USDC across chains" },
  { id: "selection", title: "Select Sources", description: "Choose what to consolidate" },
  { id: "review", title: "Review & Quote", description: "Review your consolidation plan" },
  { id: "execution", title: "Execute", description: "Complete the consolidation" },
]

export const VacuumWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0)
  const vacuumState = useVacuumState()
  const { isConnected, multiChainData, chainSelections, executionPlan, isExecutionComplete } = vacuumState

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return isConnected
      case 1:
        return multiChainData?.items && multiChainData.items.length > 0
      case 2:
        return chainSelections.some((chain) => chain.selected && Number.parseFloat(chain.amount) > 0)
      case 3:
        return executionPlan !== null
      case 4:
        return true
      default:
        return false
    }
  }

  const canGoBack = () => {
    return currentStep > 0 && !vacuumState.executing
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && canProceedToNext()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (canGoBack()) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WalletStep {...vacuumState} />
      case 1:
        return <DiscoveryStep {...vacuumState} />
      case 2:
        return <SelectionStep {...vacuumState} />
      case 3:
        return <ReviewStep {...vacuumState} />
      case 4:
        return <ExecutionStep {...vacuumState} />
      default:
        return null
    }
  }

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with Wallet Connection */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                USDC Vacuum
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Consolidate USDC across chains</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isConnected && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
              >
                Connected
              </Badge>
            )}
            <ConnectButton
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
              chainStatus={{
                smallScreen: "icon",
                largeScreen: "full",
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-6 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
              </h2>
              <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
            </div>

            <Progress value={progressPercentage} className="w-full" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{STEPS[currentStep].description}</span>
              {isExecutionComplete && (
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  🎉 Complete!
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Step Content */}
        <Card className="mb-6">{renderStep()}</Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack} disabled={!canGoBack()} className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceedToNext()} className="flex items-center gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(0)
                vacuumState.resetExecution()
              }}
              className="flex items-center gap-2"
            >
              Start Over
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
