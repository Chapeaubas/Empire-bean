"use client"

import { Coffee, Clock, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface OrderProps {
  order: {
    id: number
    type: string
    beans: string
    milk: string
    extra: string | null
    difficulty: number
    reward: number
    timeLimit: number
  }
  onSubmit: () => void
  isCoffeeBrewedReady: boolean
}

export default function OrderCard({ order, onSubmit, isCoffeeBrewedReady }: OrderProps) {
  return (
    <Card className="border-amber-300 bg-white">
      <CardContent className="pt-3 px-3">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center">
            <Coffee className="mr-1 text-amber-600 h-4 w-4" />
            <h3 className="font-bold text-sm pixel-text">{order.type}</h3>
          </div>
          <div className="flex items-center text-amber-700">
            <Coins className="mr-1 h-3 w-3" />
            <span className="pixel-text text-xs">{Math.floor(order.reward)} $GRIND</span>
          </div>
        </div>

        <div className="space-y-0.5 text-xs">
          <div className="flex justify-between">
            <span className="font-medium pixel-text">Beans:</span>
            <span className="text-amber-700 pixel-text">{order.beans}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium pixel-text">Milk:</span>
            <span className="text-amber-700 pixel-text">{order.milk}</span>
          </div>

          {order.extra && order.extra !== "None" && (
            <div className="flex justify-between">
              <span className="font-medium pixel-text">Extra:</span>
              <span className="text-amber-700 pixel-text">{order.extra}</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center text-xs">
          <Clock className="mr-1 h-3 w-3 text-amber-600" />
          <span className="pixel-text">Time limit: {order.timeLimit}s</span>
        </div>
      </CardContent>

      <CardFooter className="pt-1 pb-3 px-3">
        <Button
          onClick={onSubmit}
          className="w-full bg-amber-600 hover:bg-amber-700 pixel-text text-xs py-1"
          disabled={!isCoffeeBrewedReady}
        >
          Serve Coffee
        </Button>
      </CardFooter>
    </Card>
  )
}
