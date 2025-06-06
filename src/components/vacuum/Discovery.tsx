import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import type { VacuumState } from "../../types/vacuum-state"
import { ChainIcon } from "../ChainIcon"
import { TokenIcon } from "../TokenIcon"
import { getChainDisplayName } from "../../utils/helpers"


interface DiscoveryStepProps extends VacuumState {}

export const DiscoveryStep: React.FC<DiscoveryStepProps> = ({
  multiChainData,
  balancesLoading,
  fetchMultiChainBalances,
  isConnected,
}) => {
  const hasScanned = multiChainData?.items && multiChainData.items.length > 0
  const hasUSDC =
    hasScanned &&
    multiChainData.items.some(
      (chain: any) => chain.items?.length > 0 && Number.parseFloat(chain.items[0].balance || "0") / 1000000 > 0,
    )

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Discover Your USDC</h2>
        <p className="text-muted-foreground">Scan across multiple blockchains to find your USDC holdings.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Multi-Chain Scanner</CardTitle>
            <CardDescription>
              We'll check Ethereum, Polygon, Optimism, Arbitrum, and Base for your USDC balances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <Button
                onClick={fetchMultiChainBalances}
                disabled={balancesLoading || !isConnected}
                size="lg"
                className="flex items-center gap-2"
              >
                {balancesLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning Chains...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    {hasScanned ? "Scan Again" : "Start Scan"}
                  </>
                )}
              </Button>
            </div>

            {balancesLoading && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Scanning across multiple chains... This may take a moment.</p>
              </div>
            )}

            {hasScanned && !balancesLoading && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Scan Results</h3>
                  {hasUSDC ? (
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      USDC Found
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      No USDC Found
                    </Badge>
                  )}
                </div>

                <div className="grid gap-3">
                  {multiChainData.items.map((chainData: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center">
                            <ChainIcon 
                              chainName={chainData.chain_name} 
                              size={32}
                              className="w-8 h-8"
                            />
                          </div>
                          <div>
                            <div className="font-medium">
                              {getChainDisplayName(chainData.chain_name)}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          {chainData.hasError ? (
                            <Badge variant="destructive">Error</Badge>
                          ) : chainData.items?.length > 0 &&
                            Number.parseFloat(chainData.items[0].balance || "0") / 1000000 > 0 ? (
                            <div>
                              <div className="font-bold text-lg flex items-center gap-1">
                                {(Number.parseFloat(chainData.items[0].balance || "0") / 1000000).toFixed(2)}
                                <TokenIcon symbol="USDC" size={20} className="w-5 h-5" />
                              </div>
                              <div className="text-sm text-emerald-600">
                                ${Number.parseFloat(chainData.items[0].quote || "0").toLocaleString()}
                              </div>
                            </div>
                          ) : (
                            <Badge variant="outline">No USDC</Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
