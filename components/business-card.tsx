"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ChevronDown, ChevronUp, Clock, Award } from "lucide-react"

interface BusinessCardProps {
  business: {
    id: string
    name: string
    icon: string
    baseCost: number
    baseRevenue: number
    baseTime: number
    costMultiplier: number
    revenueMultiplier: number
  }
  businessState?: {
    owned: number
    level: number
    hasManager: boolean
    speedMultiplier: number
    profitMultiplier: number
    lastCollected: number | null
    progress: number
  }
  cash: number
  onBuy: () => void
  onBuy10: () => void
  onBuy100: () => void
  onBuyMax: () => void
  onCollect: (e: React.MouseEvent) => void
  onStart: () => void
  timeRemaining: string
  onClick?: () => void
}

export default function BusinessCard({
  business,
  businessState,
  cash,
  onBuy,
  onBuy10,
  onBuy100,
  onBuyMax,
  onCollect,
  onStart,
  timeRemaining,
  onClick,
}: BusinessCardProps) {
  const [showBuyOptions, setShowBuyOptions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState<"x1" | "x10" | "x100" | "all">("x1")

  // Use a default value if businessState is undefined
  const state = businessState || {
    owned: 0,
    level: 0,
    hasManager: false,
    speedMultiplier: 1,
    profitMultiplier: 1,
    lastCollected: null,
    progress: 0,
  }

  // Calculate current cost
  const calculateCost = (amount = 1) => {
    let totalCost = 0
    for (let i = 0; i < amount; i++) {
      totalCost += business.baseCost * Math.pow(business.costMultiplier, state.owned + i)
    }
    return totalCost
  }

  const currentCost = calculateCost()
  const cost10 = calculateCost(10)
  const cost100 = calculateCost(100)

  // Calculate current revenue
  const currentRevenue = business.baseRevenue * state.owned * state.profitMultiplier

  // Calculate time to complete with speed multiplier
  const cycleTime = business.baseTime / state.speedMultiplier

  // Check if business is ready to collect
  const isReady = state.progress >= 100

  // Check if business can be started
  const canStart = state.owned > 0 && state.progress === 0 && !state.hasManager

  // Animation for collection
  useEffect(() => {
    if (isReady && !isAnimating) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isReady, isAnimating])

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick()

    if (isReady) {
      onCollect(e)
    }
  }

  // Calculate how many businesses can be afforded with current cash
  const calculateMaxAffordable = () => {
    let count = 0
    let totalCost = 0
    let nextCost = currentCost

    while (cash >= totalCost + nextCost) {
      count++
      totalCost += nextCost
      nextCost = business.baseCost * Math.pow(business.costMultiplier, state.owned + count)
    }

    return totalCost
  }

  // Function to buy maximum affordable businesses
  const buyMaxAffordable = () => {
    onBuyMax()
  }

  return (
    <div
      className={`bg-gradient-to-b from-amber-700 to-amber-800 rounded-lg overflow-hidden border-2 transition-all duration-300 shadow-lg
        ${state.owned > 0 ? "border-amber-400" : "border-amber-600"}
        ${isReady ? "animate-pulse-subtle" : ""}
        ${isAnimating ? "scale-105" : ""}
      `}
    >
      {/* Business Header */}
      <div
        className="flex items-center p-3 bg-gradient-to-r from-amber-800 to-amber-900 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-12 h-12 flex items-center justify-center bg-amber-600 rounded-full mr-3 text-2xl shadow-inner">
          {business.icon}
        </div>

        <div className="flex-1">
          <h3 className="font-bold flex items-center">
            {business.name}
            {state.hasManager && <Award className="h-4 w-4 ml-2 text-green-400" />}
          </h3>
          <div className="text-sm text-amber-300">
            Owned: <span className="font-bold">{state.owned}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-amber-300 font-bold">{formatCurrency(currentRevenue)}</div>
          <div className="text-xs text-amber-200 flex items-center justify-end">
            <Clock className="h-3 w-3 mr-1" />
            {cycleTime}s
          </div>
        </div>

        <div className="ml-2">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-amber-300" />
          ) : (
            <ChevronDown className="h-5 w-5 text-amber-300" />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {state.owned > 0 && (
        <div className={`px-3 py-2 bg-amber-800/50 ${isReady ? "bg-green-900/20" : ""}`} onClick={handleClick}>
          <div className="flex justify-between text-xs mb-1">
            <span>{state.hasManager ? "Auto-collecting" : "Progress"}</span>
            <span className="text-amber-300">{timeRemaining}</span>
          </div>
          <Progress
            value={state.progress}
            className="h-3 bg-amber-900"
            indicatorClassName={`${isReady ? "bg-green-500" : "bg-amber-500"} transition-all duration-300`}
          />
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && state.owned > 0 && (
        <div className="p-3 bg-amber-800/30 border-t border-amber-700">
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div className="text-amber-200">Base Revenue:</div>
            <div className="text-right">{formatCurrency(business.baseRevenue)}</div>

            <div className="text-amber-200">Revenue Multiplier:</div>
            <div className="text-right">{state.profitMultiplier.toFixed(2)}x</div>

            <div className="text-amber-200">Speed Multiplier:</div>
            <div className="text-right">{state.speedMultiplier.toFixed(2)}x</div>

            <div className="text-amber-200">Cycle Time:</div>
            <div className="text-right">{cycleTime}s</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-3 flex flex-col space-y-2 bg-amber-800/20">
        {/* Buy Button with Amount Toggle */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <Button
              variant="default"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 flex items-center justify-between"
              disabled={
                cash <
                (purchaseAmount === "all"
                  ? calculateMaxAffordable()
                  : purchaseAmount === "x100"
                    ? cost100
                    : purchaseAmount === "x10"
                      ? cost10
                      : currentCost)
              }
              onClick={() => {
                if (purchaseAmount === "x1") onBuy()
                else if (purchaseAmount === "x10") onBuy10()
                else if (purchaseAmount === "x100") onBuy100()
                else if (purchaseAmount === "all") buyMaxAffordable()
              }}
            >
              <span>Buy {purchaseAmount}</span>
              <span>
                {formatCurrency(
                  purchaseAmount === "all"
                    ? calculateMaxAffordable()
                    : purchaseAmount === "x100"
                      ? cost100
                      : purchaseAmount === "x10"
                        ? cost10
                        : currentCost,
                )}
              </span>
            </Button>
          </div>

          <Button
            variant="outline"
            className="bg-amber-700 border-amber-500 text-amber-200 hover:bg-amber-800"
            onClick={() => {
              setPurchaseAmount((prev) => {
                if (prev === "x1") return "x10"
                if (prev === "x10") return "x100"
                if (prev === "x100") return "all"
                return "x1"
              })
            }}
          >
            {purchaseAmount}
          </Button>
        </div>

        {/* Collect/Start Button */}
        {state.owned > 0 && !state.hasManager && (
          <Button
            variant="default"
            className={`w-full ${
              isReady
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 animate-pulse"
                : canStart
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  : "bg-gray-600"
            }`}
            onClick={(e) => (isReady ? onCollect(e) : canStart ? onStart() : null)}
            disabled={!isReady && !canStart}
          >
            {isReady ? `Collect ${formatCurrency(currentRevenue)}` : canStart ? "Start Production" : "In Progress..."}
          </Button>
        )}

        {/* Manager Indicator */}
        {state.hasManager && state.owned > 0 && (
          <div className="text-center text-xs text-green-300 bg-green-900/30 py-2 rounded flex items-center justify-center">
            <Award className="h-4 w-4 mr-1" />
            Manager Hired - Auto-collecting!
          </div>
        )}
      </div>
    </div>
  )
}
