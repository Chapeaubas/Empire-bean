"use client"

import type React from "react"

import { useState } from "react"
import BusinessCard from "@/components/business-card"
import { Button } from "@/components/ui/button"
import { Coffee, DollarSign, Clock, TrendingUp, Award, Filter } from "lucide-react"

interface BusinessGridProps {
  businesses: any[]
  businessStates: any
  cash: number
  onBuy: (id: string) => void
  onBuy10: (id: string) => void
  onBuy100: (id: string) => void
  onBuyMax: (id: string) => void
  onCollect: (id: string, e: React.MouseEvent) => void
  onStart: (id: string) => void
  getTimeRemaining: (id: string) => string
  onClick: () => void
}

export default function BusinessGrid({
  businesses,
  businessStates,
  cash,
  onBuy,
  onBuy10,
  onBuy100,
  onBuyMax,
  onCollect,
  onStart,
  getTimeRemaining,
  onClick,
}: BusinessGridProps) {
  const [sortBy, setSortBy] = useState<"default" | "profit" | "time" | "roi">("default")
  const [filterOwned, setFilterOwned] = useState(false)

  // Sort businesses based on selected criteria
  const sortedBusinesses = [...businesses].sort((a, b) => {
    const stateA = businessStates[a.id]
    const stateB = businessStates[b.id]

    // If filtering owned, put owned businesses first
    if (filterOwned) {
      if ((stateA?.owned || 0) === 0 && (stateB?.owned || 0) > 0) return 1
      if ((stateA?.owned || 0) > 0 && (stateB?.owned || 0) === 0) return -1
    }

    switch (sortBy) {
      case "profit":
        const revenueA = a.baseRevenue * (stateA?.owned || 0) * (stateA?.profitMultiplier || 1)
        const revenueB = b.baseRevenue * (stateB?.owned || 0) * (stateB?.profitMultiplier || 1)
        return revenueB - revenueA

      case "time":
        const timeA = a.baseTime / (stateA?.speedMultiplier || 1)
        const timeB = b.baseTime / (stateB?.speedMultiplier || 1)
        return timeA - timeB

      case "roi":
        // Return on investment (revenue per second per cost)
        const roiA =
          (stateA?.owned || 0) === 0
            ? 0
            : (a.baseRevenue * (stateA?.owned || 0) * (stateA?.profitMultiplier || 1)) /
              (a.baseTime / (stateA?.speedMultiplier || 1)) /
              a.baseCost
        const roiB =
          (stateB?.owned || 0) === 0
            ? 0
            : (b.baseRevenue * (stateB?.owned || 0) * (stateB?.profitMultiplier || 1)) /
              (b.baseTime / (stateB?.speedMultiplier || 1)) /
              b.baseCost
        return roiB - roiA

      default:
        // Default sort by ID (original order)
        return businesses.indexOf(a) - businesses.indexOf(b)
    }
  })

  // Filter businesses if needed
  const filteredBusinesses = filterOwned
    ? sortedBusinesses.filter((b) => (businessStates[b.id]?.owned || 0) > 0)
    : sortedBusinesses

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 bg-amber-800/50 p-3 rounded-lg">
        <div className="mr-2 text-amber-300">
          <Filter className="h-4 w-4 inline mr-1" />
          Sort by:
        </div>

        <Button
          variant="outline"
          size="sm"
          className={`${sortBy === "default" ? "bg-amber-600 text-white" : "bg-transparent text-amber-300"}`}
          onClick={() => setSortBy("default")}
        >
          <Coffee className="h-3 w-3 mr-1" />
          Default
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`${sortBy === "profit" ? "bg-amber-600 text-white" : "bg-transparent text-amber-300"}`}
          onClick={() => setSortBy("profit")}
        >
          <DollarSign className="h-3 w-3 mr-1" />
          Profit
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`${sortBy === "time" ? "bg-amber-600 text-white" : "bg-transparent text-amber-300"}`}
          onClick={() => setSortBy("time")}
        >
          <Clock className="h-3 w-3 mr-1" />
          Speed
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`${sortBy === "roi" ? "bg-amber-600 text-white" : "bg-transparent text-amber-300"}`}
          onClick={() => setSortBy("roi")}
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          ROI
        </Button>

        <div className="ml-auto flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filterOwned}
              onChange={() => setFilterOwned(!filterOwned)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors ${filterOwned ? "bg-amber-500" : "bg-amber-800"} relative`}
            >
              <div
                className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform ${filterOwned ? "translate-x-5" : "translate-x-0.5"}`}
              ></div>
            </div>
            <span className="ml-2 text-amber-300 text-sm">Show owned only</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusinesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            businessState={businessStates[business.id]}
            cash={cash}
            onBuy={() => onBuy(business.id)}
            onBuy10={() => onBuy10(business.id)}
            onBuy100={() => onBuy100(business.id)}
            onBuyMax={() => onBuyMax(business.id)}
            onCollect={(e) => onCollect(business.id, e)}
            onStart={() => onStart(business.id)}
            timeRemaining={getTimeRemaining(business.id)}
            onClick={onClick}
          />
        ))}
      </div>

      {filterOwned && filteredBusinesses.length === 0 && (
        <div className="text-center py-10 text-amber-300">
          <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg">You don't own any businesses yet!</p>
          <p className="text-sm mt-2">Purchase your first business to start your coffee empire.</p>
        </div>
      )}
    </div>
  )
}
