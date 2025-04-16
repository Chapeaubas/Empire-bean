import { Coffee, Star, Coins } from "lucide-react"

interface GameHeaderProps {
  coins: number
  level: number
  score: number
  passiveIncome?: number
}

export default function GameHeader({ coins, level, score, passiveIncome = 0 }: GameHeaderProps) {
  return (
    <header className="w-full bg-amber-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Coffee className="mr-2" />
        <h1 className="text-xl font-bold pixel-text">$GRIND: Bean Hustle</h1>
      </div>

      <div className="flex space-x-6">
        <div className="flex items-center">
          <Star className="mr-1 h-5 w-5 text-amber-300" />
          <span className="pixel-text text-sm">Prestige {level}</span>
        </div>

        <div className="flex items-center">
          <Coins className="mr-1 h-5 w-5 text-amber-300" />
          <span className="pixel-text text-sm">{coins} $GRIND</span>
        </div>

        <div className="flex items-center">
          <span className="pixel-text text-sm">Income: {passiveIncome}/s</span>
        </div>
      </div>
    </header>
  )
}
