"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { Sparkles, TrendingUp, RefreshCw, Coffee, X } from "lucide-react"

interface PrestigeModalProps {
  currentCash: number
  totalEarnings: number
  ownedBusinesses: number
  currentPrestigeLevel: number
  onPrestige: () => void
  onClose: () => void
}

export default function PrestigeModal({
  currentCash,
  totalEarnings,
  ownedBusinesses,
  currentPrestigeLevel,
  onPrestige,
  onClose,
}: PrestigeModalProps) {
  const [confirmed, setConfirmed] = useState(false)

  // Calculate new prestige level and multiplier
  const calculatePrestigeGain = () => {
    // Base formula: log10(totalEarnings / 1e6) rounded down, minimum 1
    const baseGain = Math.max(1, Math.floor(Math.log10(totalEarnings / 1e6)))

    // Bonus based on owned businesses
    const businessBonus = Math.floor(ownedBusinesses / 10) * 0.1

    return Math.max(1, baseGain + businessBonus)
  }

  const newPrestigeLevel = calculatePrestigeGain()
  const multiplierIncrease = newPrestigeLevel - currentPrestigeLevel
  const newMultiplier = newPrestigeLevel

  // Requirements to prestige
  const minimumEarnings = 1e6 // $1 million
  const canPrestige = totalEarnings >= minimumEarnings

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col border-2 border-amber-600">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-300" />
            Coffee Bean Rebirth
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="text-center mb-6">
            <div className="bg-amber-700/50 p-4 rounded-lg inline-block mb-4">
              <RefreshCw className="h-12 w-12 text-amber-300 animate-spin-slow" />
            </div>
            <h3 className="text-xl font-bold mb-2">Reset Your Progress, Multiply Your Future</h3>
            <p className="text-amber-200">
              Start fresh with premium coffee beans that permanently boost all future earnings!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-amber-700/50 rounded-lg p-4">
              <h4 className="font-bold mb-2 flex items-center">
                <Coffee className="h-4 w-4 mr-2 text-amber-300" />
                Current Status
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Cash:</span>
                  <span className="font-bold">{formatCurrency(currentCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Earnings:</span>
                  <span className="font-bold">{formatCurrency(totalEarnings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Businesses Owned:</span>
                  <span className="font-bold">{ownedBusinesses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Multiplier:</span>
                  <span className="font-bold">{currentPrestigeLevel}x</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-700/50 rounded-lg p-4">
              <h4 className="font-bold mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-amber-300" />
                After Rebirth
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>New Cash:</span>
                  <span className="font-bold">$4</span>
                </div>
                <div className="flex justify-between">
                  <span>Businesses:</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span>New Multiplier:</span>
                  <span className="font-bold text-green-400">
                    {newMultiplier}x {multiplierIncrease > 0 && `(+${multiplierIncrease})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Permanent Boost:</span>
                  <span className="font-bold text-green-400">+{((newMultiplier - 1) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-700/30 rounded-lg p-4 mb-6">
            <h4 className="font-bold mb-2">Rebirth Requirements</h4>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span>Total Earnings:</span>
                <span>
                  {formatCurrency(totalEarnings)} / {formatCurrency(minimumEarnings)}
                </span>
              </div>
              <Progress
                value={(Math.min(totalEarnings, minimumEarnings) / minimumEarnings) * 100}
                className="h-2 bg-amber-900"
                indicatorClassName={canPrestige ? "bg-green-500" : "bg-amber-500"}
              />
            </div>
            <p className="text-sm text-amber-200 mt-2">
              {canPrestige
                ? "You've reached the minimum requirements for rebirth!"
                : `You need at least ${formatCurrency(minimumEarnings)} in total earnings to rebirth.`}
            </p>
          </div>

          <div className="bg-amber-950/50 rounded-lg p-4 border border-amber-800">
            <h4 className="font-bold mb-2 text-amber-300">What You'll Keep</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-amber-200">
              <li>Prestige level and multipliers</li>
              <li>Achievements and statistics</li>
              <li>Game knowledge and experience</li>
            </ul>

            <h4 className="font-bold mb-2 mt-4 text-amber-300">What You'll Lose</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-amber-200">
              <li>All businesses and their levels</li>
              <li>All cash and managers</li>
              <li>All upgrades and temporary boosts</li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-amber-700 flex justify-between">
          {!confirmed ? (
            <>
              <Button variant="outline" onClick={onClose} className="border-amber-600 text-amber-300">
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => setConfirmed(true)}
                disabled={!canPrestige}
                className={canPrestige ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-500"}
              >
                {canPrestige ? "Prepare for Rebirth" : "Cannot Rebirth Yet"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setConfirmed(false)} className="border-amber-600 text-amber-300">
                Wait, Go Back
              </Button>
              <Button
                variant="default"
                onClick={onPrestige}
                className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Confirm Rebirth
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
