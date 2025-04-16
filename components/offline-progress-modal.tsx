"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Clock, Coffee, X } from "lucide-react"

interface OfflineProgressModalProps {
  offlineData: {
    totalEarned: number
    businessEarnings: {
      businessId: string
      name: string
      earned: number
      cycles: number
    }[]
    timeAway: number
  }
  onCollect: () => void
  onClose: () => void
}

export default function OfflineProgressModal({ offlineData, onCollect, onClose }: OfflineProgressModalProps) {
  const { totalEarned, businessEarnings, timeAway } = offlineData

  // Format time away
  const formatTimeAway = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-md w-full max-h-[80vh] flex flex-col border-2 border-amber-600">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold flex items-center">
            <Coffee className="h-5 w-5 mr-2 text-amber-300" />
            Offline Progress
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center bg-amber-700/50 px-3 py-1 rounded-lg">
              <Clock className="h-4 w-4 mr-2 text-amber-300" />
              <span>Away for {formatTimeAway(timeAway)}</span>
            </div>
          </div>

          <div className="bg-amber-700/50 rounded-lg p-4 mb-4 text-center">
            <h3 className="text-lg font-bold mb-1">Total Earnings</h3>
            <div className="text-2xl font-bold text-amber-300">{formatCurrency(totalEarned)}</div>
          </div>

          <h3 className="font-bold mb-2">Business Earnings</h3>

          {businessEarnings.length > 0 ? (
            <div className="space-y-2">
              {businessEarnings.map((business) => (
                <div key={business.businessId} className="bg-amber-700/30 rounded-lg p-3 flex justify-between">
                  <div>
                    <div className="font-bold">{business.name}</div>
                    <div className="text-xs text-amber-300">{business.cycles} cycles completed</div>
                  </div>
                  <div className="text-right font-bold">{formatCurrency(business.earned)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-amber-300 bg-amber-700/30 rounded-lg">
              <p>No businesses generated income while you were away.</p>
              <p className="text-sm mt-1">Hire managers to earn while offline!</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-amber-700 flex justify-between">
          <Button variant="outline" onClick={onClose} className="border-amber-600 text-amber-300">
            Close
          </Button>
          <Button
            variant="default"
            onClick={onCollect}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          >
            Collect {formatCurrency(totalEarned)}
          </Button>
        </div>
      </div>
    </div>
  )
}
