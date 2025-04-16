"use client"

import type React from "react"

import { useState } from "react"
import { Award, Check, Lock, Star, Trophy, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AchievementsPanelProps {
  achievements: {
    id: string
    name: string
    description: string
    requirement: {
      type: string
      value: number
    }
    reward: {
      type: string
      value: number
    }
    icon: string
  }[]
  unlockedAchievements: { [key: string]: boolean }
  stats: {
    totalEarnings: number
    totalClicks: number
    totalCustomersServed: number
    maxBusinessOwned: number
    prestigeLevel: number
    beanSortingHighScore: number
  }
}

export default function AchievementsPanel({ achievements, unlockedAchievements, stats }: AchievementsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "unlocked" | "locked">("all")

  // Filter achievements based on active category
  const filteredAchievements = achievements.filter((achievement) => {
    if (activeCategory === "all") return true
    if (activeCategory === "unlocked") return unlockedAchievements[achievement.id]
    if (activeCategory === "locked") return !unlockedAchievements[achievement.id]
    return true
  })

  // Calculate progress for each achievement
  const getAchievementProgress = (achievement: (typeof achievements)[0]) => {
    const { requirement } = achievement
    let current = 0

    switch (requirement.type) {
      case "earnings":
        current = stats.totalEarnings
        break
      case "businesses":
        current = stats.maxBusinessOwned
        break
      case "minigame":
        current = stats.beanSortingHighScore
        break
      case "customers":
        current = stats.totalCustomersServed
        break
      case "prestige":
        current = stats.prestigeLevel
        break
      default:
        current = 0
    }

    return Math.min(100, (current / requirement.value) * 100)
  }

  // Get icon component for achievement
  const getAchievementIcon = (iconString: string) => {
    switch (iconString) {
      case "💰":
        return <Award className="h-6 w-6 text-amber-300" />
      case "👑":
        return <Trophy className="h-6 w-6 text-amber-300" />
      case "🏆":
        return <Star className="h-6 w-6 text-amber-300" />
      case "🤝":
        return <Check className="h-6 w-6 text-amber-300" />
      case "✨":
        return <TrendingUp className="h-6 w-6 text-amber-300" />
      default:
        return <Award className="h-6 w-6 text-amber-300" />
    }
  }

  return (
    <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Trophy className="h-5 w-5 mr-2 text-amber-300" />
        Achievements
      </h2>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveCategory(value as any)}>
        <TabsList className="grid grid-cols-3 mb-4 bg-amber-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-amber-600">
            All
          </TabsTrigger>
          <TabsTrigger value="unlocked" className="data-[state=active]:bg-amber-600">
            Unlocked
          </TabsTrigger>
          <TabsTrigger value="locked" className="data-[state=active]:bg-amber-600">
            Locked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-3">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={unlockedAchievements[achievement.id]}
                progress={getAchievementProgress(achievement)}
                icon={getAchievementIcon(achievement.icon)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="mt-0">
          <div className="space-y-3">
            {filteredAchievements.length > 0 ? (
              filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlockedAchievements[achievement.id]}
                  progress={getAchievementProgress(achievement)}
                  icon={getAchievementIcon(achievement.icon)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-amber-300">
                <p>No achievements unlocked yet.</p>
                <p className="text-sm mt-2">Keep playing to unlock achievements!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="mt-0">
          <div className="space-y-3">
            {filteredAchievements.length > 0 ? (
              filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlockedAchievements[achievement.id]}
                  progress={getAchievementProgress(achievement)}
                  icon={getAchievementIcon(achievement.icon)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-amber-300">
                <p>All achievements unlocked!</p>
                <p className="text-sm mt-2">Congratulations, you've mastered the game!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AchievementCardProps {
  achievement: {
    id: string
    name: string
    description: string
    requirement: {
      type: string
      value: number
    }
    reward: {
      type: string
      value: number
    }
  }
  unlocked: boolean
  progress: number
  icon: React.ReactNode
}

function AchievementCard({ achievement, unlocked, progress, icon }: AchievementCardProps) {
  const { name, description, requirement, reward } = achievement

  // Format requirement text
  const getRequirementText = () => {
    switch (requirement.type) {
      case "earnings":
        return `Earn ${formatCurrency(requirement.value)}`
      case "businesses":
        return `Own ${requirement.value} of any business`
      case "minigame":
        return `Score ${requirement.value} in bean sorting`
      case "customers":
        return `Serve ${requirement.value} customers`
      case "prestige":
        return `Reach prestige level ${requirement.value}`
      default:
        return `Reach ${requirement.value}`
    }
  }

  // Format reward text
  const getRewardText = () => {
    switch (reward.type) {
      case "cash":
        return `${formatCurrency(reward.value)} cash`
      case "multiplier":
        return `${reward.value}x multiplier`
      default:
        return `${reward.value} reward`
    }
  }

  return (
    <div
      className={`rounded-lg p-3 border-2 ${
        unlocked ? "bg-amber-700 border-green-500" : "bg-amber-700/50 border-amber-600"
      }`}
    >
      <div className="flex items-start">
        <div className="mr-3 bg-amber-800 p-2 rounded-full">
          {unlocked ? icon : <Lock className="h-6 w-6 text-amber-400" />}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold">{name}</h3>
            {unlocked && <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Unlocked</span>}
          </div>
          <p className="text-sm text-amber-300 mb-2">{description}</p>

          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>{getRequirementText()}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-amber-900"
              indicatorClassName={unlocked ? "bg-green-500" : "bg-amber-500"}
            />
          </div>

          <div className="text-xs flex items-center">
            <Trophy className="h-3 w-3 mr-1 text-amber-300" />
            <span>Reward: {getRewardText()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
