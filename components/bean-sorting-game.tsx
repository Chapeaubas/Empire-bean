"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { X, Clock, Coffee, Check, AlertTriangle } from "lucide-react"

interface BeanSortingGameProps {
  onComplete: (score: number, reward: number) => void
  onClose: () => void
  difficultyLevel?: number
  baseReward?: number
}

type BeanType = "arabica" | "robusta" | "defect"
type Bean = {
  id: number
  type: BeanType
  position: { x: number; y: number }
  rotation: number
  sorted: boolean
}

export default function BeanSortingGame({
  onComplete,
  onClose,
  difficultyLevel = 1,
  baseReward = 100,
}: BeanSortingGameProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "complete">("intro")
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds game
  const [beans, setBeans] = useState<Bean[]>([])
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [selectedBin, setSelectedBin] = useState<BeanType | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Initialize game
  useEffect(() => {
    if (gameState === "playing") {
      // Generate beans based on difficulty
      const beanCount = 10 + difficultyLevel * 5
      const newBeans: Bean[] = []

      for (let i = 0; i < beanCount; i++) {
        // Determine bean type (more defects at higher difficulties)
        let type: BeanType
        const rand = Math.random()
        if (rand < 0.4) type = "arabica"
        else if (rand < 0.8) type = "robusta"
        else type = "defect"

        newBeans.push({
          id: i,
          type,
          position: {
            x: 20 + Math.random() * 60, // percentage of container width
            y: 20 + Math.random() * 60, // percentage of container height
          },
          rotation: Math.random() * 360,
          sorted: false,
        })
      }

      setBeans(newBeans)

      // Start timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameState, difficultyLevel])

  const startGame = () => {
    setGameState("playing")
    setTimeLeft(30)
    setScore(0)
    setMistakes(0)
  }

  const endGame = () => {
    setGameState("complete")
    // Calculate reward based on score and difficulty
    const accuracyPercentage = beans.length > 0 ? (score / beans.length) * 100 : 0
    const reward = Math.floor(baseReward * difficultyLevel * (accuracyPercentage / 100))
    onComplete(score, reward)
  }

  const handleBeanClick = (beanId: number) => {
    if (!selectedBin) return

    setBeans((prev) =>
      prev.map((bean) => {
        if (bean.id === beanId && !bean.sorted) {
          // Check if correctly sorted
          const correct = bean.type === selectedBin
          if (correct) {
            setScore((prev) => prev + 1)
          } else {
            setMistakes((prev) => prev + 1)
          }

          return { ...bean, sorted: true }
        }
        return bean
      }),
    )

    // Check if all beans are sorted
    const allSorted = beans.every((bean) => bean.sorted || bean.id === beanId)
    if (allSorted) {
      endGame()
    }
  }

  const getBeanColor = (type: BeanType) => {
    switch (type) {
      case "arabica":
        return "bg-amber-700"
      case "robusta":
        return "bg-amber-900"
      case "defect":
        return "bg-gray-700"
    }
  }

  const getBinColor = (type: BeanType) => {
    switch (type) {
      case "arabica":
        return selectedBin === type ? "bg-amber-600 border-amber-400" : "bg-amber-800 border-amber-700"
      case "robusta":
        return selectedBin === type ? "bg-amber-800 border-amber-600" : "bg-amber-950 border-amber-900"
      case "defect":
        return selectedBin === type ? "bg-gray-600 border-gray-400" : "bg-gray-800 border-gray-700"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col border-2 border-amber-600">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold flex items-center">
            <Coffee className="h-5 w-5 mr-2 text-amber-300" />
            Bean Sorting Challenge
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {gameState === "intro" && (
          <div className="flex-1 overflow-auto p-6 text-center">
            <div className="mb-6">
              <Coffee className="h-16 w-16 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-bold mb-2">Sort the Coffee Beans!</h3>
              <p className="text-amber-200 mb-4">
                Sort the beans into the correct bins as quickly as possible. Be careful not to make mistakes!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-amber-700/50 p-3 rounded-lg text-center">
                <div className="w-8 h-4 bg-amber-700 rounded-full mx-auto mb-2"></div>
                <h4 className="font-bold">Arabica</h4>
                <p className="text-xs">Light brown, oval</p>
              </div>

              <div className="bg-amber-700/50 p-3 rounded-lg text-center">
                <div className="w-8 h-4 bg-amber-900 rounded-full mx-auto mb-2"></div>
                <h4 className="font-bold">Robusta</h4>
                <p className="text-xs">Dark brown, round</p>
              </div>

              <div className="bg-amber-700/50 p-3 rounded-lg text-center">
                <div className="w-8 h-4 bg-gray-700 rounded-full mx-auto mb-2"></div>
                <h4 className="font-bold">Defects</h4>
                <p className="text-xs">Discolored, irregular</p>
              </div>
            </div>

            <div className="bg-amber-700/30 p-4 rounded-lg mb-6">
              <h4 className="font-bold mb-2 flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                Game Rules
              </h4>
              <ul className="text-sm text-left list-disc list-inside space-y-1">
                <li>You have 30 seconds to sort as many beans as possible</li>
                <li>First select a bin, then click on beans to sort them</li>
                <li>Correct sorts earn points, mistakes reduce your score</li>
                <li>Your reward is based on accuracy and speed</li>
              </ul>
            </div>

            <Button
              variant="default"
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              Start Sorting!
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center bg-amber-900/50">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-300" />
                <span className="font-bold">{timeLeft}s</span>
              </div>

              <div className="flex items-center">
                <span className="mr-4">
                  Score: <span className="font-bold">{score}</span>
                </span>
                <span>
                  Mistakes: <span className="font-bold text-red-400">{mistakes}</span>
                </span>
              </div>
            </div>

            <div className="flex-1 relative p-4" ref={gameAreaRef}>
              {/* Beans */}
              {beans.map(
                (bean) =>
                  !bean.sorted && (
                    <button
                      key={bean.id}
                      className={`absolute w-8 h-4 ${getBeanColor(bean.type)} rounded-full cursor-pointer transition-transform hover:scale-110`}
                      style={{
                        left: `${bean.position.x}%`,
                        top: `${bean.position.y}%`,
                        transform: `rotate(${bean.rotation}deg)`,
                      }}
                      onClick={() => handleBeanClick(bean.id)}
                      disabled={!selectedBin}
                    />
                  ),
              )}
            </div>

            <div className="p-4 bg-amber-900/50 border-t border-amber-700">
              <div className="text-center mb-2">Select a bin, then click beans to sort them:</div>
              <div className="grid grid-cols-3 gap-4">
                <button
                  className={`p-3 rounded-lg border-2 ${getBinColor("arabica")} flex flex-col items-center`}
                  onClick={() => setSelectedBin("arabica")}
                >
                  <div className="w-8 h-4 bg-amber-700 rounded-full mb-1"></div>
                  <span className="text-sm font-bold">Arabica</span>
                </button>

                <button
                  className={`p-3 rounded-lg border-2 ${getBinColor("robusta")} flex flex-col items-center`}
                  onClick={() => setSelectedBin("robusta")}
                >
                  <div className="w-8 h-4 bg-amber-900 rounded-full mb-1"></div>
                  <span className="text-sm font-bold">Robusta</span>
                </button>

                <button
                  className={`p-3 rounded-lg border-2 ${getBinColor("defect")} flex flex-col items-center`}
                  onClick={() => setSelectedBin("defect")}
                >
                  <div className="w-8 h-4 bg-gray-700 rounded-full mb-1"></div>
                  <span className="text-sm font-bold">Defects</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === "complete" && (
          <div className="flex-1 overflow-auto p-6 text-center">
            <div className="mb-6">
              {score > 7 ? (
                <>
                  <Check className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold mb-2">Excellent Sorting!</h3>
                  <p className="text-amber-200">You sorted the beans with great accuracy and speed.</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                  <h3 className="text-2xl font-bold mb-2">Needs Improvement</h3>
                  <p className="text-amber-200">You can improve your sorting skills with more practice.</p>
                </>
              )}
            </div>

            <div className="mb-4">
              <h4 className="font-bold">Final Score: {score}</h4>
              <h4 className="font-bold">Mistakes: {mistakes}</h4>
              <h4 className="font-bold">Reward: {formatCurrency(calculateReward())}</h4>
            </div>

            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  function calculateReward() {
    const accuracyPercentage = beans.length > 0 ? (score / beans.length) * 100 : 0
    // Cap the reward to a reasonable amount based on the baseReward
    const reward = Math.floor(baseReward * difficultyLevel * (accuracyPercentage / 100))
    return reward
  }
}
