"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface UpgradeModalProps {
  upgrades: {
    id: string
    businessId: string
    name: string
    cost: number
    multiplier: number
    type: string
    description: string
  }[]
  cash: number
  onBuy: (upgradeId: string) => void
  onClose: () => void
}

export default function UpgradeModal({ upgrades, cash, onBuy, onClose }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-800 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold">Upgrades</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {upgrades.length === 0 ? (
            <div className="text-center py-8 text-amber-200">
              <p>No upgrades available right now.</p>
              <p className="text-sm mt-2">Purchase more businesses to unlock upgrades.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upgrades.map((upgrade) => (
                <div key={upgrade.id} className="bg-amber-700 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{upgrade.name}</h3>
                    <p className="text-sm text-amber-200">{upgrade.description}</p>
                  </div>

                  <Button
                    variant="default"
                    className={cash >= upgrade.cost ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-500"}
                    disabled={cash < upgrade.cost}
                    onClick={() => onBuy(upgrade.id)}
                  >
                    Buy ({formatCurrency(upgrade.cost)})
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
