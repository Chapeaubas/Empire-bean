"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Coffee, Coins, Zap, Sparkles } from "lucide-react"

interface GlobalActionsBarProps {
  cash: number
  onCollectAll: () => void
  onStartAll: () => void
  readyBusinesses: number
  idleBusinesses: number
  totalRevenue: number
  onPrestige: () => void
  prestigeMultiplier: number
  canPrestige: boolean
}

export default function GlobalActionsBar({
  cash,
  onCollectAll,
  onStartAll,
  readyBusinesses,
  idleBusinesses,
  totalRevenue,
  onPrestige,
  prestigeMultiplier,
  canPrestige,
}: GlobalActionsBarProps) {
  const [showPrestigeConfirm, setShowPrestigeConfirm] = useState(false)

  return (
    <div className="bg-gradient-to-r from-amber-800 to-amber-900 p-2 border-t border-amber-700 sticky bottom-0 z-10">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            className={`bg-gradient-to-r ${
              readyBusinesses > 0
                ? "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 animate-pulse"
                : "from-gray-500 to-gray-600"
            }`}
            onClick={onCollectAll}
            disabled={readyBusinesses === 0}
          >
            <Coffee className="h-4 w-4 mr-2" />
            Collect All ({readyBusinesses})
            {readyBusinesses > 0 && <span className="ml-2">+{formatCurrency(totalRevenue)}</span>}
          </Button>

          <Button
            variant="default"
            className={`bg-gradient-to-r ${
              idleBusinesses > 0
                ? "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                : "from-gray-500 to-gray-600"
            }`}
            onClick={onStartAll}
            disabled={idleBusinesses === 0}
          >
            <Zap className="h-4 w-4 mr-2" />
            Start All ({idleBusinesses})
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {showPrestigeConfirm ? (
            <>
              <div className="text-amber-300 text-sm mr-2">Reset progress for {prestigeMultiplier}x multiplier?</div>
              <Button
                variant="default"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowPrestigeConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  onPrestige()
                  setShowPrestigeConfirm(false)
                }}
              >
                Confirm
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              className={`bg-gradient-to-r ${
                canPrestige
                  ? "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  : "from-gray-500 to-gray-600"
              }`}
              onClick={() => setShowPrestigeConfirm(true)}
              disabled={!canPrestige}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Prestige ({prestigeMultiplier}x)
            </Button>
          )}

          <div className="bg-amber-700 rounded-lg px-3 py-1 flex items-center">
            <Coins className="h-4 w-4 mr-2 text-amber-300" />
            <span className="font-bold">{formatCurrency(cash)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
