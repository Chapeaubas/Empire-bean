"use client"

import { X, TrendingUp, Coffee, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StatsModalProps {
  totalEarnings: number
  totalClicks: number
  timePlayed: number
  businesses: {
    [key: string]: {
      owned: number
      level: number
      hasManager: boolean
      speedMultiplier: number
      profitMultiplier: number
      lastCollected: number | null
      progress: number
    }
  }
  businessData: {
    id: string
    name: string
    icon: string
    baseCost: number
    baseRevenue: number
    baseTime: number
    costMultiplier: number
    revenueMultiplier: number
  }[]
  incomePerSecond: number
  ownedUpgrades: string[]
  upgradeData: {
    id: string
    businessId: string
    name: string
    cost: number
    multiplier: number
    type: string
    description: string
  }[]
  onClose: () => void
}

export default function StatsModal({
  totalEarnings,
  totalClicks,
  timePlayed,
  businesses,
  businessData,
  incomePerSecond,
  ownedUpgrades,
  upgradeData,
  onClose,
}: StatsModalProps) {
  // Format time for display (hh:mm:ss)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`
    } else {
      return `${mins}m ${secs}s`
    }
  }

  // Calculate earnings per click
  const earningsPerClick = totalClicks > 0 ? totalEarnings / totalClicks : 0

  // Calculate total businesses owned
  const totalBusinessesOwned = Object.values(businesses).reduce((total, business) => {
    return total + business.owned
  }, 0)

  // Calculate total managers hired
  const totalManagersHired = Object.values(businesses).filter((b) => b.hasManager).length

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-amber-300" />
            Game Statistics
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-amber-300 hover:text-amber-100 hover:bg-amber-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-3 mb-4 bg-amber-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-amber-600">
                Overview
              </TabsTrigger>
              <TabsTrigger value="businesses" className="data-[state=active]:bg-amber-600">
                Businesses
              </TabsTrigger>
              <TabsTrigger value="upgrades" className="data-[state=active]:bg-amber-600">
                Upgrades
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Coffee className="h-4 w-4 mr-2 text-amber-300" />
                    General Statistics
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-amber-200">Total Earnings:</span>
                      <span className="font-bold">{formatCurrency(totalEarnings)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-amber-200">Current Income Rate:</span>
                      <span className="font-bold">{formatCurrency(incomePerSecond)}/sec</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-amber-200">Total Clicks:</span>
                      <span className="font-bold">{formatNumber(totalClicks)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-amber-200">Earnings Per Click:</span>
                      <span className="font-bold">{formatCurrency(earningsPerClick)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-amber-200">Time Played:</span>
                      <span className="font-bold">{formatTime(timePlayed)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-amber-300" />
                    Achievements
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-amber-200">Businesses Owned:</span>
                        <span>{totalBusinessesOwned}</span>
                      </div>
                      <Progress
                        value={(totalBusinessesOwned / 100) * 100}
                        className="h-2 bg-amber-900"
                        indicatorClassName="bg-amber-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-amber-200">Managers Hired:</span>
                        <span>
                          {totalManagersHired}/{businessData.length}
                        </span>
                      </div>
                      <Progress
                        value={(totalManagersHired / businessData.length) * 100}
                        className="h-2 bg-amber-900"
                        indicatorClassName="bg-amber-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-amber-200">Upgrades Purchased:</span>
                        <span>
                          {ownedUpgrades.length}/{upgradeData.length}
                        </span>
                      </div>
                      <Progress
                        value={(ownedUpgrades.length / upgradeData.length) * 100}
                        className="h-2 bg-amber-900"
                        indicatorClassName="bg-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-amber-700/50 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-300" />
                  Milestones
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-amber-800/50 p-3 rounded-lg">
                    <div className="text-center text-amber-300 font-bold mb-1">
                      Next at {formatCurrency(totalEarnings * 2)}
                    </div>
                    <div className="text-center text-sm">Double your current earnings</div>
                  </div>

                  <div className="bg-amber-800/50 p-3 rounded-lg">
                    <div className="text-center text-amber-300 font-bold mb-1">
                      Next at {formatNumber(totalClicks * 2)} clicks
                    </div>
                    <div className="text-center text-sm">Double your current clicks</div>
                  </div>

                  <div className="bg-amber-800/50 p-3 rounded-lg">
                    <div className="text-center text-amber-300 font-bold mb-1">
                      Next at {formatCurrency(incomePerSecond * 10)}/sec
                    </div>
                    <div className="text-center text-sm">10x your current income rate</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="businesses" className="mt-0">
              <div className="space-y-3">
                {businessData.map((business) => {
                  const businessState = businesses[business.id]
                  const isOwned = businessState && businessState.owned > 0

                  return (
                    <div key={business.id} className={`bg-amber-700/50 rounded-lg p-3 ${!isOwned ? "opacity-70" : ""}`}>
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-amber-600 rounded-full mr-3 text-xl">
                          {business.icon}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold">{business.name}</h3>
                          <div className="text-sm text-amber-300">
                            {isOwned ? (
                              <>
                                Owned: {businessState.owned} • {businessState.hasManager ? "Managed" : "Manual"}
                              </>
                            ) : (
                              "Not purchased yet"
                            )}
                          </div>
                        </div>

                        {isOwned && (
                          <div className="text-right">
                            <div className="text-amber-300 font-bold">
                              {formatCurrency(
                                business.baseRevenue * businessState.owned * businessState.profitMultiplier,
                              )}
                            </div>
                            <div className="text-xs">
                              {(business.baseTime / businessState.speedMultiplier).toFixed(1)}s cycle
                            </div>
                          </div>
                        )}
                      </div>

                      {isOwned && (
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-amber-800/50 p-2 rounded">
                            <div className="text-amber-300">Speed Multiplier</div>
                            <div className="font-bold">{businessState.speedMultiplier.toFixed(2)}x</div>
                          </div>

                          <div className="bg-amber-800/50 p-2 rounded">
                            <div className="text-amber-300">Profit Multiplier</div>
                            <div className="font-bold">{businessState.profitMultiplier.toFixed(2)}x</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="upgrades" className="mt-0">
              <div className="space-y-3">
                {upgradeData.map((upgrade) => {
                  const isOwned = ownedUpgrades.includes(upgrade.id)
                  const targetBusiness =
                    upgrade.businessId === "all"
                      ? "All Businesses"
                      : businessData.find((b) => b.id === upgrade.businessId)?.name || upgrade.businessId

                  return (
                    <div
                      key={upgrade.id}
                      className={`bg-amber-700/50 rounded-lg p-3 ${isOwned ? "border border-green-400" : ""}`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold">{upgrade.name}</h3>
                          <div className="text-sm text-amber-300">
                            {targetBusiness} • {upgrade.type === "speed" ? "Speed" : "Profit"} • {upgrade.multiplier}x
                          </div>
                          <div className="text-sm mt-1">{upgrade.description}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-amber-300 font-bold">{formatCurrency(upgrade.cost)}</div>
                          <div
                            className={`text-xs mt-1 px-2 py-1 rounded ${isOwned ? "bg-green-600" : "bg-amber-800"}`}
                          >
                            {isOwned ? "Purchased" : "Not Purchased"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t border-amber-700 flex justify-end">
          <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-700">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
