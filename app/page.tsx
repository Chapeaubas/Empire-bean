"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Coffee,
  Coins,
  Gift,
  Settings,
  ChevronUp,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  Zap,
  Trophy,
  Volume2,
  VolumeX,
  X,
  RefreshCw,
  Calendar,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import BusinessCard from "@/components/business-card"
import SeasonalEventBanner from "@/components/seasonal-event-banner"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { RANDOM_EVENTS, CUSTOMER_TYPES, SEASONAL_EVENTS, ACHIEVEMENTS } from "@/lib/game-data"
import soundManager from "@/lib/sound-manager"
import { calculateOfflineProgress } from "@/lib/offline-progress"
import BeanSortingGame from "@/components/bean-sorting-game"
import LatteArtGame from "@/components/latte-art-game"
import DailyStreak from "@/components/daily-streak"
import StreakCalendar from "@/components/streak-calendar"
import StreakMilestone from "@/components/streak-milestone"

// Game data remains the same
const BUSINESSES = [
  {
    id: "coffee_cart",
    name: "Coffee Cart",
    icon: "☕",
    baseCost: 4,
    baseRevenue: 1,
    baseTime: 1, // seconds
    costMultiplier: 1.07,
    revenueMultiplier: 1.03,
  },
  {
    id: "coffee_shop",
    name: "Coffee Shop",
    icon: "🏪",
    baseCost: 60,
    baseRevenue: 60,
    baseTime: 3,
    costMultiplier: 1.15,
    revenueMultiplier: 1.05,
  },
  {
    id: "roastery",
    name: "Roastery",
    icon: "🔥",
    baseCost: 720,
    baseRevenue: 540,
    baseTime: 6,
    costMultiplier: 1.14,
    revenueMultiplier: 1.07,
  },
  {
    id: "coffee_plantation",
    name: "Coffee Plantation",
    icon: "🌱",
    baseCost: 8640,
    baseRevenue: 4320,
    baseTime: 12,
    costMultiplier: 1.13,
    revenueMultiplier: 1.09,
  },
  {
    id: "distribution_center",
    name: "Distribution Center",
    icon: "🚚",
    baseCost: 103680,
    baseRevenue: 51840,
    baseTime: 24,
    costMultiplier: 1.12,
    revenueMultiplier: 1.11,
  },
  {
    id: "coffee_brand",
    name: "Coffee Brand",
    icon: "™️",
    baseCost: 1244160,
    baseRevenue: 622080,
    baseTime: 96,
    costMultiplier: 1.11,
    revenueMultiplier: 1.13,
  },
  {
    id: "coffee_chain",
    name: "Coffee Chain",
    icon: "🏢",
    baseCost: 14929920,
    baseRevenue: 7464960,
    baseTime: 384,
    costMultiplier: 1.1,
    revenueMultiplier: 1.15,
  },
  {
    id: "bean_empire",
    name: "Bean Empire",
    icon: "👑",
    baseCost: 179159040,
    baseRevenue: 89579520,
    baseTime: 1536,
    costMultiplier: 1.09,
    revenueMultiplier: 1.17,
  },
]

// Manager data remains the same
const MANAGERS = [
  {
    id: "coffee_cart_manager",
    businessId: "coffee_cart",
    name: "Barista Barry",
    cost: 1000,
    description: "Automatically runs your Coffee Cart",
  },
  {
    id: "coffee_shop_manager",
    businessId: "coffee_shop",
    name: "Manager Mocha",
    cost: 15000,
    description: "Automatically runs your Coffee Shop",
  },
  {
    id: "roastery_manager",
    businessId: "roastery",
    name: "Roaster Riley",
    cost: 100000,
    description: "Automatically runs your Roastery",
  },
  {
    id: "coffee_plantation_manager",
    businessId: "coffee_plantation",
    name: "Planter Penny",
    cost: 500000,
    description: "Automatically runs your Coffee Plantation",
  },
  {
    id: "distribution_center_manager",
    businessId: "distribution_center",
    name: "Distributor Dave",
    cost: 1200000,
    description: "Automatically runs your Distribution Center",
  },
  {
    id: "coffee_brand_manager",
    businessId: "coffee_brand",
    name: "Branding Bella",
    cost: 10000000,
    description: "Automatically runs your Coffee Brand",
  },
  {
    id: "coffee_chain_manager",
    businessId: "coffee_chain",
    name: "Chain Charlie",
    cost: 50000000,
    description: "Automatically runs your Coffee Chain",
  },
  {
    id: "bean_empire_manager",
    businessId: "bean_empire",
    name: "Emperor Espresso",
    cost: 250000000,
    description: "Automatically runs your Bean Empire",
  },
]

// Upgrade data remains the same
const UPGRADES = [
  {
    id: "coffee_cart_speed",
    businessId: "coffee_cart",
    name: "Faster Brewing",
    cost: 5000,
    multiplier: 2,
    type: "speed",
    description: "Coffee Cart produces 2x faster",
  },
  {
    id: "coffee_shop_profit",
    businessId: "coffee_shop",
    name: "Premium Beans",
    cost: 25000,
    multiplier: 2,
    type: "profit",
    description: "Coffee Shop profits 2x higher",
  },
  {
    id: "roastery_speed",
    businessId: "roastery",
    name: "Industrial Roaster",
    cost: 200000,
    multiplier: 2,
    type: "speed",
    description: "Roastery produces 2x faster",
  },
  {
    id: "coffee_plantation_profit",
    businessId: "coffee_plantation",
    name: "Organic Certification",
    cost: 1000000,
    multiplier: 3,
    type: "profit",
    description: "Coffee Plantation profits 3x higher",
  },
  {
    id: "all_businesses_profit",
    businessId: "all",
    name: "Coffee Influencer",
    cost: 5000000,
    multiplier: 2,
    type: "profit",
    description: "All businesses earn 2x more",
  },
  {
    id: "all_businesses_speed",
    businessId: "all",
    name: "Efficiency Training",
    cost: 10000000,
    multiplier: 2,
    type: "speed",
    description: "All businesses produce 2x faster",
  },
]

export default function Home() {
  // All state variables remain the same
  const [cash, setCash] = useState(4)
  const [businesses, setBusinesses] = useState<{
    [key: string]: {
      owned: number
      level: number
      hasManager: boolean
      speedMultiplier: number
      profitMultiplier: number
      lastCollected: number | null
      progress: number
    }
  }>({})
  const [ownedUpgrades, setOwnedUpgrades] = useState<string[]>([])
  const [showManagers, setShowManagers] = useState(false)
  const [showUpgrades, setShowUpgrades] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [dailyRewardAvailable, setDailyRewardAvailable] = useState(true)
  const [dailyRewardTimer, setDailyRewardTimer] = useState(24 * 60 * 60)
  const [prestigeLevel, setPrestigeLevel] = useState(1)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const [coins, setCoins] = useState(50)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<"intro" | "playing" | "shop" | "paused">("intro")
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [autoBrewers, setAutoBrewers] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isCoffeeBrewedReady, setIsCoffeeBrewedReady] = useState(false)
  const [clickPowerLevel, setClickPowerLevel] = useState(1)
  const [currentOrders, setCurrentOrders] = useState<Order[]>([])
  const [machineLevel, setMachineLevel] = useState(1)
  const [speedLevel, setSpeedLevel] = useState(1)
  const [tipLevel, setTipLevel] = useState(1)
  const [selectedIngredients, setSelectedIngredients] = useState<{
    beans: string | null
    milk: string | null
    extra: string | null
  }>({
    beans: null,
    milk: null,
    extra: null,
  })
  const [passiveIncome, setPassiveIncome] = useState(0)
  const [incomeMultiplier, setIncomeMultiplier] = useState(1)
  const [lastAutomaticIncomeTime, setLastAutomaticIncomeTime] = useState(Date.now())
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [activeTab, setActiveTab] = useState("businesses")
  const [showFloatingCash, setShowFloatingCash] = useState(false)
  const [floatingCashAmount, setFloatingCashAmount] = useState(0)
  const [floatingCashPosition, setFloatingCashPosition] = useState({ x: 0, y: 0 })
  const [recentCollections, setRecentCollections] = useState<{ amount: number; time: number }[]>([])

  // New state variables for new features
  const [showPrestigeModal, setShowPrestigeModal] = useState(false)
  const [currentRandomEvent, setCurrentRandomEvent] = useState<any | null>(null)
  const [activeRandomEvents, setActiveRandomEvents] = useState<{ [key: string]: { event: any; endTime: number } }>({})
  const [showBeanSortingGame, setShowBeanSortingGame] = useState(false)
  const [showLatteArtGame, setShowLatteArtGame] = useState(false)
  const [currentCustomers, setCurrentCustomers] = useState<any[]>([])
  const [businessQuality, setBusinessQuality] = useState(1)
  const [totalCustomersServed, setTotalCustomersServed] = useState(0)
  const [currentSeasonalEvent, setCurrentSeasonalEvent] = useState<any | null>(null)
  const [showSeasonalEventBanner, setShowSeasonalEventBanner] = useState(false)
  const [specialBusinesses, setSpecialBusinesses] = useState<any[]>([])
  const [specialUpgrades, setSpecialUpgrades] = useState<any[]>([])
  const [achievements, setAchievements] = useState<{ [key: string]: boolean }>({})
  const [showAchievementToast, setShowAchievementToast] = useState<{
    id: string
    name: string
    description: string
  } | null>(null)
  const [globalMultiplier, setGlobalMultiplier] = useState(1)
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false)
  const [showPrestigeUpgrades, setShowPrestigeUpgrades] = useState(false)
  const [ownedPrestigeUpgrades, setOwnedPrestigeUpgrades] = useState<string[]>([])
  const [prestigePoints, setPrestigePoints] = useState(0)
  const [beanSortingHighScore, setBeanSortingHighScore] = useState(0)
  const [latteArtHighScore, setLatteArtHighScore] = useState(0)
  const [lastOnlineTime, setLastOnlineTime] = useState(Date.now())
  const [showOfflineProgress, setShowOfflineProgress] = useState(false)
  const [offlineProgressData, setOfflineProgressData] = useState<any>(null)
  const [offlineMultiplier, setOfflineMultiplier] = useState(1)
  const [startingCash, setStartingCash] = useState(4)
  const [autoManagerCount, setAutoManagerCount] = useState(0)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [lastStreakClaim, setLastStreakClaim] = useState<number | null>(null)
  const [streakHistory, setStreakHistory] = useState<{ date: number; claimed: boolean }[]>([])
  const [showStreakCalendar, setShowStreakCalendar] = useState(false)
  const [showMilestone, setShowMilestone] = useState<{ days: number; reward: number } | null>(null)
  const [streakProtection, setStreakProtection] = useState(1) // Number of days that can be missed without breaking streak

  // Game types
  type Order = {
    id: number
    type: string
    beans: string
    milk: string
    extra: string | null
    difficulty: number
    reward: number
    timeLimit: number
  }

  // Available ingredients
  const beanTypes = ["Arabica", "Robusta", "Colombian", "Ethiopian"]
  const milkTypes = ["Whole", "Oat", "Almond", "None"]
  const extraTypes = ["Cinnamon", "Caramel", "Vanilla", "None"]

  // Coffee types
  const coffeeTypes = [
    { name: "Espresso", difficulty: 1, baseReward: 5 },
    { name: "Latte", difficulty: 2, baseReward: 8 },
    { name: "Cappuccino", difficulty: 2, baseReward: 10 },
    { name: "Cold Brew", difficulty: 3, baseReward: 12 },
  ]

  // Generate a random order
  const generateOrder = (): Order => {
    const coffeeType = coffeeTypes[Math.floor(Math.random() * coffeeTypes.length)]
    const beans = beanTypes[Math.floor(Math.random() * beanTypes.length)]
    const milk = coffeeType.name === "Espresso" ? "None" : milkTypes[Math.floor(Math.random() * (milkTypes.length - 1))]
    const extra = Math.random() > 0.5 ? extraTypes[Math.floor(Math.random() * (extraTypes.length - 1))] : "None"

    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: coffeeType.name,
      beans,
      milk,
      extra,
      difficulty: coffeeType.difficulty,
      reward: coffeeType.baseReward * incomeMultiplier, // Scale with multiplier instead of level
      timeLimit: 20 - coffeeType.difficulty * 2,
    }
  }

  // Add this function before the return statement
  const playSound = (
    sound: "click" | "success" | "fail" | "levelUp" | "collect" | "buy" | "upgrade" | "achievement" | "prestige",
  ) => {
    if (!soundEnabled) return

    // Play sound using sound manager
    soundManager.play(sound)
  }

  // Handle coffee brewed
  const handleCoffeeBrewed = () => {
    setIsCoffeeBrewedReady(true)
    playSound("success")
    toast({
      title: "Coffee Ready!",
      description: "Your coffee is ready to be served.",
    })
  }

  // Start the game
  const startGame = () => {
    playSound("click")
    setGameState("playing")
    setSecondsPassed(0)
    setScore(0)
    setCurrentOrders([generateOrder(), generateOrder()])
    setIsTimerRunning(true)
    setSelectedIngredients({ beans: null, milk: null, extra: null })
    setIsCoffeeBrewedReady(false)

    // Start background music
    if (musicEnabled) {
      soundManager.playMusic("main")
    }
  }

  // Continue game after shop
  const continueGame = () => {
    playSound("click")
    setGameState("playing")
    // Don't reset score or coins, just continue playing
    setCurrentOrders([generateOrder(), generateOrder()])
    setSelectedIngredients({ beans: null, milk: null, extra: null })
    setIsCoffeeBrewedReady(false)
  }

  // Open shop
  const openShop = () => {
    setGameState("shop")
    setIsTimerRunning(false)
  }

  // Pause game
  const pauseGame = () => {
    playSound("click")
    setGameState("paused")
    setIsTimerRunning(false)
  }

  // Resume game
  const resumeGame = () => {
    playSound("click")
    setGameState("playing")
    setIsTimerRunning(true)
  }

  // Toggle sound
  const toggleSound = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    soundManager.setEnabled(newState)

    // Also update music if sound is toggled off
    if (!newState) {
      soundManager.setMusicEnabled(false)
      setMusicEnabled(false)
    }
  }

  // Toggle music
  const toggleMusic = () => {
    const newState = !musicEnabled
    setMusicEnabled(newState)
    soundManager.setMusicEnabled(newState)

    // Play or stop music based on new state
    if (newState && gameState === "playing") {
      soundManager.playMusic("main")
    } else {
      soundManager.stopMusic()
    }
  }

  // Select ingredient
  const selectIngredient = (type: "beans" | "milk" | "extra", value: string) => {
    setSelectedIngredients((prev) => ({
      ...prev,
      [type]: value,
    }))
    // Reset brewed coffee when ingredients change
    setIsCoffeeBrewedReady(false)
  }

  // Submit coffee
  const submitCoffee = (orderId: number) => {
    // Check if coffee is brewed
    if (!isCoffeeBrewedReady) {
      toast({
        title: "Coffee Not Ready!",
        description: "You need to brew the coffee first.",
        variant: "destructive",
      })
      return
    }

    const order = currentOrders.find((o) => o.id === orderId)
    if (!order) return

    if (!selectedIngredients.beans || !selectedIngredients.milk) {
      toast({
        title: "Incomplete Coffee!",
        description: "You need to select beans and milk type.",
        variant: "destructive",
      })
      return
    }

    // Check if coffee matches order
    const beansMatch = selectedIngredients.beans === order.beans
    const milkMatch = selectedIngredients.milk === order.milk
    const extraMatch = selectedIngredients.extra === order.extra

    const totalMatches = [beansMatch, milkMatch, extraMatch].filter(Boolean).length

    let reward = 0
    let message = ""

    if (totalMatches === 3) {
      reward = Math.floor(order.reward * (1 + (tipLevel - 1) * 0.2))
      message = "Perfect coffee! Extra tip!"
      playSound("success")
    } else if (totalMatches === 2) {
      reward = Math.floor(order.reward * 0.7)
      message = "Good coffee! Customer is satisfied."
      playSound("success")
      playSound("success")
    } else if (totalMatches === 1) {
      reward = Math.floor(order.reward * 0.4)
      message = "Coffee is okay. Customer accepts it."
    } else {
      reward = Math.floor(order.reward * 0.2)
      message = "Wrong coffee! Customer is disappointed."
      playSound("fail")
    }

    setCoins((prev) => prev + reward)
    setScore((prev) => prev + reward)

    toast({
      title: message,
      description: `+${reward} $GRIND`,
      variant: totalMatches >= 2 ? "default" : "destructive",
    })

    // Remove completed order and add a new one
    setCurrentOrders((prev) => [...prev.filter((o) => o.id !== orderId), generateOrder()])

    // Reset selected ingredients and brewed coffee
    setSelectedIngredients({ beans: null, milk: null, extra: null })
    setIsCoffeeBrewedReady(false)
  }

  // Add a function to handle passive income:
  const calculatePassiveIncome = () => {
    const now = Date.now()
    const timeElapsed = (now - lastAutomaticIncomeTime) / 1000 // in seconds

    if (timeElapsed >= 1 && autoBrewers > 0) {
      const income = Math.floor(passiveIncome * timeElapsed)
      setCash((prev) => prev + income)
      setScore((prev) => prev + income)
      setLastAutomaticIncomeTime(now)

      // Only show toast for significant income
      if (income >= 10) {
        toast({
          title: "Passive Income!",
          description: `+${income} $GRIND from auto-brewers`,
        })
      }
    }
  }

  // Upgrade machine
  const upgradeMachine = (type: "machine" | "speed" | "tip" | "clickPower" | "autoBrewer" | "multiplier") => {
    const costs = {
      machine: machineLevel * 50,
      speed: speedLevel * 40,
      tip: tipLevel * 30,
      clickPower: clickPowerLevel * 35,
      autoBrewer: Math.floor(100 * Math.pow(1.5, autoBrewers)),
      multiplier: Math.floor(200 * Math.pow(2, incomeMultiplier - 1)),
    }

    if (coins >= costs[type]) {
      setCoins((prev) => prev - costs[type])
      playSound("upgrade")

      if (type === "machine") {
        setMachineLevel((prev) => prev + 1)
        toast({
          title: "Machine Upgraded!",
          description: "You can now handle more complex orders.",
        })
      } else if (type === "speed") {
        setSpeedLevel((prev) => prev + 1)
        toast({
          title: "Speed Upgraded!",
          description: "You can now brew coffee faster.",
        })
      } else if (type === "tip") {
        setTipLevel((prev) => prev + 1)
        toast({
          title: "Tip Jar Upgraded!",
          description: "Customers leave bigger tips for perfect orders.",
        })
      } else if (type === "clickPower") {
        setClickPowerLevel((prev) => prev + 1)
        toast({
          title: "Click Power Upgraded!",
          description: "Each click now adds more brewing progress!",
        })
      } else if (type === "autoBrewer") {
        setAutoBrewers((prev) => prev + 1)
        // Update passive income based on auto brewers
        setPassiveIncome((prev) => prev + 5 * incomeMultiplier)
        toast({
          title: "Auto-Brewer Purchased!",
          description: "You now earn passive income from automated coffee brewing!",
        })
      } else if (type === "multiplier") {
        setIncomeMultiplier((prev) => prev + 0.5)
        // Update passive income with new multiplier
        setPassiveIncome((prev) => (prev / (incomeMultiplier - 0.5)) * incomeMultiplier)
        toast({
          title: "Income Multiplier Upgraded!",
          description: "All your income is now increased by 50%!",
        })
      }
    } else {
      playSound("fail")
      toast({
        title: "Not enough $GRIND!",
        description: "Keep grinding to earn more $GRIND.",
        variant: "destructive",
      })
    }
  }

  // Initialize businesses
  useEffect(() => {
    const initialBusinesses: any = {}
    BUSINESSES.forEach((business) => {
      initialBusinesses[business.id] = {
        owned: 0,
        level: 0,
        hasManager: false,
        speedMultiplier: 1,
        profitMultiplier: 1,
        lastCollected: null,
        progress: 0,
      }
    })
    setBusinesses(initialBusinesses)

    // Load saved game state including game time
    loadGameState()

    // Check for offline progress when the game loads
    checkOfflineProgress()
  }, [])

  // Check for offline progress
  const checkOfflineProgress = () => {
    const now = Date.now()
    const lastOnline = localStorage.getItem("lastOnlineTime")

    if (lastOnline) {
      const lastOnlineTimestamp = Number.parseInt(lastOnline)

      // Calculate offline progress
      const offlineData = calculateOfflineProgress(
        lastOnlineTimestamp,
        businesses,
        BUSINESSES,
        prestigeLevel,
        globalMultiplier,
        offlineMultiplier,
      )

      // Only show if there's significant earnings or time away
      if (offlineData.totalEarned > 0 || offlineData.timeAway > 5 * 60 * 1000) {
        // 5 minutes
        setOfflineProgressData(offlineData)
        setShowOfflineProgress(true)
      }
    }

    // Update last online time
    setLastOnlineTime(now)
    localStorage.setItem("lastOnlineTime", now.toString())
  }

  // Collect offline earnings
  const collectOfflineEarnings = () => {
    if (!offlineProgressData) return

    setCash((prev) => prev + offlineProgressData.totalEarned)
    setTotalEarnings((prev) => prev + offlineProgressData.totalEarned)

    playSound("collect")
    toast({
      title: "Offline Earnings Collected!",
      description: `You collected ${formatCurrency(offlineProgressData.totalEarned)} from offline progress.`,
    })

    setShowOfflineProgress(false)
    setOfflineProgressData(null)
  }

  // Save game state before unloading
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGameState()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [secondsPassed, cash, totalEarnings, prestigeLevel, prestigePoints]) // Add dependencies to ensure latest state is saved

  // Game loop - runs every 100ms
  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      // Update business progress and collect if needed
      setBusinesses((prev) => {
        const updated = { ...prev }
        let totalCollected = 0

        Object.keys(updated).forEach((businessId) => {
          const business = updated[businessId]
          const businessData = BUSINESSES.find((b) => b.id === businessId)

          if (!businessData || business.owned === 0) return

          const now = Date.now()

          // For businesses with managers, ensure they're always running
          if (business.hasManager) {
            // If this is the first time or after collection, start a new cycle
            if (!business.lastCollected) {
              business.lastCollected = now
              business.progress = 0.1 // Start progress
              return // Skip the rest for this business this cycle
            }

            const elapsedTime = (now - business.lastCollected) / 1000
            const cycleTime = businessData.baseTime / business.speedMultiplier

            // Calculate how many full cycles have completed
            const completedCycles = Math.floor(elapsedTime / cycleTime)

            if (completedCycles > 0) {
              // Collect revenue from completed cycles
              const revenue =
                completedCycles *
                businessData.baseRevenue *
                business.owned *
                business.profitMultiplier *
                prestigeLevel *
                globalMultiplier // Apply global multiplier from events

              totalCollected += revenue

              // Update last collected time to account for completed cycles
              business.lastCollected = business.lastCollected + completedCycles * cycleTime * 1000

              // Calculate progress for partial cycle
              const remainingTime = elapsedTime - completedCycles * cycleTime
              business.progress = (remainingTime / cycleTime) * 100
            } else {
              // Update progress for current cycle
              business.progress = (elapsedTime / cycleTime) * 100
            }
          }
          // For manually started businesses, just update progress
          else if (business.lastCollected && business.progress < 100) {
            const elapsedTime = (now - business.lastCollected) / 1000
            const cycleTime = businessData.baseTime / business.speedMultiplier
            business.progress = Math.min(100, (elapsedTime / cycleTime) * 100)
          }
        })

        // Add collected cash
        if (totalCollected > 0) {
          setCash((prev) => prev + totalCollected)
          setTotalEarnings((prev) => prev + totalCollected)

          // Show toast for significant collections
          if (totalCollected >= 100) {
            toast({
              title: "Auto-Collection!",
              description: `Your managers collected ${formatCurrency(totalCollected)}!`,
            })
          }
        }

        return updated
      })

      // Update daily reward timer
      setDailyRewardTimer((prev) => {
        if (prev <= 0) {
          setDailyRewardAvailable(true)
          return 24 * 60 * 60
        }
        return prev - 0.1
      })

      // Process active random events
      const now = Date.now()
      let eventsChanged = false

      setActiveRandomEvents((prev) => {
        const updated = { ...prev }

        Object.keys(updated).forEach((eventId) => {
          if (updated[eventId].endTime <= now) {
            // Event has expired
            delete updated[eventId]
            eventsChanged = true

            toast({
              title: "Event Ended",
              description: `The "${updated[eventId].event.title}" event has ended.`,
            })
          }
        })

        return updated
      })

      // Recalculate global multiplier if events changed
      if (eventsChanged) {
        recalculateGlobalMultiplier()
      }

      // Check for achievements
      checkAchievements()
    }, 100)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [prestigeLevel, globalMultiplier])

  // Buy a business
  const buyBusiness = (businessId: string, amount = 1) => {
    const businessData = BUSINESSES.find((b) => b.id === businessId)
    if (!businessData) return

    const business = businesses[businessId]
    let cost = 0

    // Calculate cost for buying multiple
    for (let i = 0; i < amount; i++) {
      const currentCost = businessData.baseCost * Math.pow(businessData.costMultiplier, business.owned + i)
      cost += currentCost
    }

    if (cash >= cost) {
      setCash((prev) => prev - cost)
      playSound("buy")

      setBusinesses((prev) => {
        const updated = { ...prev }

        // Apply auto-managers from prestige upgrades if this is the first purchase
        // and the business is within the auto-manager count
        const isFirstPurchase = prev[businessId].owned === 0
        const businessIndex = BUSINESSES.findIndex((b) => b.id === businessId)
        const shouldAutoManage = isFirstPurchase && businessIndex < autoManagerCount

        updated[businessId] = {
          ...prev[businessId],
          owned: prev[businessId].owned + amount,
          lastCollected: shouldAutoManage ? Date.now() : prev[businessId].lastCollected,
          hasManager: prev[businessId].hasManager || shouldAutoManage,
          progress: shouldAutoManage ? 0.1 : prev[businessId].progress,
        }

        return updated
      })

      toast({
        title: `Purchased ${amount} ${businessData.name}${amount > 1 ? "s" : ""}!`,
        description: `Keep expanding your coffee empire!`,
      })
    } else {
      playSound("fail")
      toast({
        title: "Not enough cash!",
        description: `You need ${formatCurrency(cost - cash)} more.`,
        variant: "destructive",
      })
    }
  }

  // Buy maximum affordable businesses
  const buyMaxAffordable = (businessId: string) => {
    const businessData = BUSINESSES.find((b) => b.id === businessId)
    if (!businessData) return

    const business = businesses[businessId]
    let count = 0
    let totalCost = 0
    let nextCost = businessData.baseCost * Math.pow(businessData.costMultiplier, business.owned)

    // Calculate how many we can afford
    while (cash >= totalCost + nextCost) {
      count++
      totalCost += nextCost
      nextCost = businessData.baseCost * Math.pow(businessData.costMultiplier, business.owned + count)
    }

    // If we can afford at least one
    if (count > 0) {
      setCash((prev) => prev - totalCost)
      playSound("buy")

      setBusinesses((prev) => {
        const updated = { ...prev }

        // Apply auto-managers from prestige upgrades if this is the first purchase
        // and the business is within the auto-manager count
        const isFirstPurchase = prev[businessId].owned === 0
        const businessIndex = BUSINESSES.findIndex((b) => b.id === businessId)
        const shouldAutoManage = isFirstPurchase && businessIndex < autoManagerCount

        updated[businessId] = {
          ...prev[businessId],
          owned: prev[businessId].owned + count,
          lastCollected: shouldAutoManage ? Date.now() : prev[businessId].lastCollected,
          hasManager: prev[businessId].hasManager || shouldAutoManage,
          progress: shouldAutoManage ? 0.1 : prev[businessId].progress,
        }

        return updated
      })

      toast({
        title: `Purchased ${count} ${businessData.name}${count > 1 ? "s" : ""}!`,
        description: `Keep expanding your coffee empire!`,
      })
    } else {
      playSound("fail")
      toast({
        title: "Not enough cash!",
        description: `You need more cash to buy any ${businessData.name}.`,
        variant: "destructive",
      })
    }
  }

  // Collect from a business
  const handleCollectBusiness = (businessId: string, event?: React.MouseEvent) => {
    const businessData = BUSINESSES.find((b) => b.id === businessId)
    if (!businessData) return

    const business = businesses[businessId]
    if (business.owned === 0 || business.progress < 100) return

    const revenue =
      businessData.baseRevenue * business.owned * business.profitMultiplier * prestigeLevel * globalMultiplier
    setCash((prev) => prev + revenue)
    setTotalEarnings((prev) => prev + revenue)
    playSound("collect")

    // Add to recent collections
    setRecentCollections((prev) => {
      const newCollections = [...prev, { amount: revenue, time: Date.now() }]
      // Keep only last 5 collections
      if (newCollections.length > 5) {
        return newCollections.slice(newCollections.length - 5)
      }
      return newCollections
    })

    // Show floating cash if event is provided
    if (event) {
      showFloatingCashAnimation(revenue, event.clientX, event.clientY)
    }

    setBusinesses((prev) => ({
      ...prev,
      [businessId]: {
        ...prev[businessId],
        lastCollected: prev[businessId].hasManager ? Date.now() : null,
        progress: 0,
      },
    }))

    toast({
      title: `Collected ${formatCurrency(revenue)}!`,
      description: `From your ${businessData.name}.`,
    })
  }

  // Start a business cycle
  const startBusiness = (businessId: string) => {
    const business = businesses[businessId]
    if (business.owned === 0 || business.progress > 0) return

    setBusinesses((prev) => ({
      ...prev,
      [businessId]: {
        ...prev[businessId],
        lastCollected: Date.now(),
        progress: 0.1, // Start progress
      },
    }))
  }

  // Buy a manager
  const buyManager = (managerId: string) => {
    const manager = MANAGERS.find((m) => m.id === managerId)
    if (!manager) return

    if (cash >= manager.cost) {
      setCash((prev) => prev - manager.cost)
      playSound("buy")

      // Update the business with the manager
      setBusinesses((prev) => {
        const updated = { ...prev }
        const business = updated[manager.businessId]

        // Set hasManager to true and start production immediately
        business.hasManager = true
        business.lastCollected = Date.now()
        business.progress = 0.1

        return updated
      })

      toast({
        title: `Hired ${manager.name}!`,
        description: manager.description,
      })
    } else {
      playSound("fail")
      toast({
        title: "Not enough cash!",
        description: `You need ${formatCurrency(manager.cost - cash)} more.`,
        variant: "destructive",
      })
    }
  }

  // Buy an upgrade
  const buyUpgrade = (upgradeId: string) => {
    const upgrade = [...UPGRADES, ...specialUpgrades].find((u) => u.id === upgradeId)
    if (!upgrade || ownedUpgrades.includes(upgradeId)) return

    if (cash >= upgrade.cost) {
      setCash((prev) => prev - upgrade.cost)
      setOwnedUpgrades((prev) => [...prev, upgradeId])
      playSound("upgrade")

      // Apply upgrade effects
      setBusinesses((prev) => {
        const updated = { ...prev }

        if (upgrade.businessId === "all") {
          // Apply to all businesses
          Object.keys(updated).forEach((businessId) => {
            if (upgrade.type === "speed") {
              updated[businessId].speedMultiplier *= upgrade.multiplier
            } else if (upgrade.type === "profit") {
              updated[businessId].profitMultiplier *= upgrade.multiplier
            }
          })
        } else {
          // Apply to specific business
          if (upgrade.type === "speed") {
            updated[upgrade.businessId].speedMultiplier *= upgrade.multiplier
          } else if (upgrade.type === "profit") {
            updated[upgrade.businessId].profitMultiplier *= upgrade.multiplier
          }
        }

        return updated
      })

      toast({
        title: `Purchased ${upgrade.name}!`,
        description: upgrade.description,
      })
    } else {
      playSound("fail")
      toast({
        title: "Not enough cash!",
        description: `You need ${formatCurrency(upgrade.cost - cash)} more.`,
        variant: "destructive",
      })
    }
  }

  // Buy a prestige upgrade
  const buyPrestigeUpgrade = (upgradeId: string, cost: number) => {
    if (prestigePoints < cost || ownedPrestigeUpgrades.includes(upgradeId)) return

    // Deduct prestige points
    setPrestigePoints((prev) => prev - cost)

    // Add to owned upgrades
    setOwnedPrestigeUpgrades((prev) => [...prev, upgradeId])

    playSound("upgrade")

    // Apply upgrade effects
    switch (upgradeId) {
      case "faster_production":
        // Apply 25% speed boost to all businesses
        setBusinesses((prev) => {
          const updated = { ...prev }
          Object.keys(updated).forEach((businessId) => {
            updated[businessId].speedMultiplier *= 1.25
          })
          return updated
        })
        break

      case "increased_profits":
        // Apply 50% profit boost to all businesses
        setBusinesses((prev) => {
          const updated = { ...prev }
          Object.keys(updated).forEach((businessId) => {
            updated[businessId].profitMultiplier *= 1.5
          })
          return updated
        })
        break

      case "starting_cash":
        // Set starting cash to $1,000
        setStartingCash(1000)
        break

      case "auto_managers":
        // Auto-managers for first 2 businesses
        setAutoManagerCount(2)
        break

      case "double_offline":
        // Double offline earnings
        setOfflineMultiplier(2)
        break

      case "customer_loyalty":
        // Increase customer tips
        // This will be applied when serving customers
        break

      case "master_barista":
        // Triple mini-game rewards
        // This will be applied when completing mini-games
        break
    }

    toast({
      title: "Prestige Upgrade Purchased!",
      description: `You've unlocked a permanent upgrade for future runs.`,
    })
  }

  // Claim daily reward
  const claimDailyReward = () => {
    if (!dailyRewardAvailable) return

    const reward = Math.max(cash * 0.1, 100) // 10% of current cash or 100, whichever is higher
    setCash((prev) => prev + reward)
    setDailyRewardAvailable(false)
    playSound("collect")

    toast({
      title: "Daily Reward Claimed!",
      description: `You received ${formatCurrency(reward)}!`,
    })
  }

  // Format time for display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate time until business completes
  const getTimeRemaining = (businessId: string) => {
    const businessData = BUSINESSES.find((b) => b.id === businessId)
    const business = businesses[businessId]

    if (!businessData || !business || business.owned === 0 || !business.lastCollected) return "00:00"

    const cycleTime = businessData.baseTime / business.speedMultiplier
    const elapsedTime = (Date.now() - business.lastCollected) / 1000
    const remainingTime = Math.max(0, cycleTime - elapsedTime)

    return formatTime(remainingTime)
  }

  // Get available managers (not yet purchased)
  const getAvailableManagers = () => {
    return MANAGERS.filter((manager) => {
      const business = businesses[manager.businessId]
      return business && business.owned > 0 && !business.hasManager
    })
  }

  // Get available upgrades (not yet purchased and business is owned)
  const getAvailableUpgrades = () => {
    return [...UPGRADES, ...specialUpgrades].filter((upgrade) => {
      if (ownedUpgrades.includes(upgrade.id)) return false

      if (upgrade.businessId === "all") {
        // Check if player owns any business
        return Object.values(businesses).some((b) => b.owned > 0)
      } else {
        // Check if player owns the specific business
        const business = businesses[upgrade.businessId]
        return business && business.owned > 0
      }
    })
  }

  // Replace the game timer effect with:
  // Create a timer ref outside the useEffect
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Game timer effect
  useEffect(() => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (gameState === "playing") {
      // Set up a new timer
      timerRef.current = setInterval(() => {
        setSecondsPassed((prev) => prev + 1)
        calculatePassiveIncome()

        // Chance to generate a random event (1% chance per second)
        if (Math.random() < 0.01 && !currentRandomEvent) {
          triggerRandomEvent()
        }

        // Chance to generate a customer (5% chance per second)
        if (Math.random() < 0.05 && currentCustomers.length < 3) {
          generateCustomer()
        }

        // Check for seasonal events
        checkSeasonalEvents()
      }, 1000)

      console.log("Game timer started")
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
        console.log("Game timer cleared")
      }
    }
  }, [gameState, currentRandomEvent, currentCustomers.length]) // Include all dependencies used in the effect

  // Add this function to show floating cash animation
  const showFloatingCashAnimation = (amount: number, x: number, y: number) => {
    setFloatingCashAmount(amount)
    setFloatingCashPosition({ x, y })
    setShowFloatingCash(true)

    setTimeout(() => {
      setShowFloatingCash(false)
    }, 1500)
  }

  // Track clicks for statistics
  const handleClick = () => {
    setTotalClicks((prev) => prev + 1)
  }

  // Calculate total income per second
  const calculateTotalIncomePerSecond = () => {
    let total = passiveIncome

    Object.keys(businesses).forEach((businessId) => {
      const business = businesses[businessId]
      const businessData = BUSINESSES.find((b) => b.id === businessId)

      if (business && businessData && business.owned > 0 && business.hasManager) {
        const cycleTime = businessData.baseTime / business.speedMultiplier
        const incomePerCycle =
          businessData.baseRevenue * business.owned * business.profitMultiplier * prestigeLevel * globalMultiplier
        total += incomePerCycle / cycleTime
      }
    })

    return total
  }

  // Get business completion percentage for all businesses
  const getBusinessCompletionPercentage = () => {
    const totalBusinesses = BUSINESSES.length
    const ownedBusinesses = Object.values(businesses).filter((b) => b.owned > 0).length
    return (ownedBusinesses / totalBusinesses) * 100
  }

  // Get manager completion percentage
  const getManagerCompletionPercentage = () => {
    const totalManagers = MANAGERS.length
    const hiredManagers = Object.values(businesses).filter((b) => b.hasManager).length
    return (hiredManagers / totalManagers) * 100
  }

  // Get upgrade completion percentage
  const getUpgradeCompletionPercentage = () => {
    const totalUpgrades = UPGRADES.length
    return (ownedUpgrades.length / totalUpgrades) * 100
  }

  // NEW FUNCTIONS FOR ADDED FEATURES

  // Handle prestige reset
  const handlePrestige = () => {
    // Calculate new prestige level
    const newPrestigeLevel = Math.max(1, Math.floor(Math.log10(totalEarnings / 1e6)))

    // Save important stats
    const oldPrestigeLevel = prestigeLevel
    const prestigePointsGained = newPrestigeLevel - oldPrestigeLevel

    // Add prestige points
    setPrestigePoints((prev) => prev + prestigePointsGained)

    // Reset game state
    setCash(startingCash) // Use starting cash from prestige upgrades
    setBusinesses((prev) => {
      const reset = { ...prev }
      Object.keys(reset).forEach((businessId) => {
        reset[businessId] = {
          owned: 0,
          level: 0,
          hasManager: false,
          speedMultiplier: 1,
          profitMultiplier: 1,
          lastCollected: null,
          progress: 0,
        }
      })
      return reset
    })
    setOwnedUpgrades([])
    setAutoBrewers(0)
    setPassiveIncome(0)
    setIncomeMultiplier(1)

    // Set new prestige level
    setPrestigeLevel(newPrestigeLevel)

    // Apply auto-managers from prestige upgrades
    if (autoManagerCount > 0) {
      setTimeout(() => {
        // This timeout ensures businesses are reset first
        setBusinesses((prev) => {
          const updated = { ...prev }

          // Apply auto-managers to the first N businesses
          BUSINESSES.slice(0, autoManagerCount).forEach((business) => {
            if (updated[business.id]) {
              updated[business.id].hasManager = true
            }
          })

          return updated
        })
      }, 100)
    }

    playSound("prestige")

    // Show toast
    toast({
      title: "Prestige Complete!",
      description: `You've reset your progress and gained a ${newPrestigeLevel}x multiplier!`,
    })

    // Close modal
    setShowPrestigeModal(false)
  }

  // Trigger a random event
  const triggerRandomEvent = () => {
    // Select a random event
    const randomIndex = Math.floor(Math.random() * RANDOM_EVENTS.length)
    const event = RANDOM_EVENTS[randomIndex]

    setCurrentRandomEvent(event)
  }

  // Handle random event acceptance
  const handleAcceptEvent = (optionIndex?: number) => {
    if (!currentRandomEvent) return

    if (currentRandomEvent.options && optionIndex !== undefined) {
      // Handle event with options
      const selectedOption = currentRandomEvent.options[optionIndex]

      if (selectedOption.effect.includes("cash")) {
        // Handle cash effect
        const cashAmount = selectedOption.value
        setCash((prev) => prev + cashAmount)

        toast({
          title: "Event Reward",
          description: `You received ${formatCurrency(cashAmount)}!`,
        })
      } else if (selectedOption.effect.includes("multiplier")) {
        // Handle multiplier effect
        const now = Date.now()
        const duration = currentRandomEvent.duration || 300 // Default 5 minutes

        setActiveRandomEvents((prev) => ({
          ...prev,
          [currentRandomEvent.id]: {
            event: currentRandomEvent,
            endTime: now + duration * 1000,
          },
        }))

        // Recalculate global multiplier
        recalculateGlobalMultiplier()

        toast({
          title: "Event Active",
          description: `${currentRandomEvent.title} is now active for ${duration} seconds!`,
        })
      }
    } else if (currentRandomEvent.defaultEffect) {
      // Handle event with default effect
      const effect = currentRandomEvent.defaultEffect

      if (effect.type === "multiplier") {
        // Apply multiplier effect
        const now = Date.now()
        const duration = currentRandomEvent.duration || 300 // Default 5 minutes

        setActiveRandomEvents((prev) => ({
          ...prev,
          [currentRandomEvent.id]: {
            event: currentRandomEvent,
            endTime: now + duration * 1000,
          },
        }))

        // Recalculate global multiplier
        recalculateGlobalMultiplier()

        toast({
          title: "Event Active",
          description: `${currentRandomEvent.title} is now active for ${duration} seconds!`,
        })
      } else if (effect.type === "cash") {
        // Apply cash effect
        setCash((prev) => prev + effect.value)

        toast({
          title: "Event Reward",
          description: `You received ${formatCurrency(effect.value)}!`,
        })
      }
    }

    // Clear current event
    setCurrentRandomEvent(null)
  }

  // Handle random event decline
  const handleDeclineEvent = () => {
    setCurrentRandomEvent(null)
  }

  // Recalculate global multiplier based on active events
  const recalculateGlobalMultiplier = () => {
    let multiplier = 1

    // Apply seasonal event multiplier if active
    if (currentSeasonalEvent) {
      multiplier *= currentSeasonalEvent.effects.globalMultiplier || 1
    }

    // Apply random event multipliers
    Object.values(activeRandomEvents).forEach((eventData) => {
      if (eventData.event.defaultEffect?.type === "multiplier") {
        multiplier *= 1 + eventData.event.defaultEffect.value
      }
    })

    setGlobalMultiplier(multiplier)
  }

  // Handle bean sorting game completion
  const handleBeanSortingComplete = (score: number, reward: number) => {
    // Apply prestige multiplier to reward, but cap it to avoid excessive rewards
    const finalReward = Math.floor(Math.min(reward * prestigeLevel, 500))

    setCash((prev) => prev + finalReward)
    setTotalEarnings((prev) => prev + finalReward)

    // Update high score if better
    if (score > beanSortingHighScore) {
      setBeanSortingHighScore(score)
    }

    playSound("success")

    toast({
      title: "Bean Sorting Complete!",
      description: `You scored ${score} points and earned ${formatCurrency(finalReward)}!`,
    })

    // Check for achievement only if score is truly exceptional
    if (score >= 90) {
      // Only trigger for near-perfect scores
      checkAchievement("bean_master")
    }

    // Close game
    setShowBeanSortingGame(false)

    // Resume main music
    if (musicEnabled) {
      soundManager.playMusic("main")
    }
  }

  // Handle latte art game completion
  const handleLatteArtComplete = (score: number, reward: number) => {
    // Apply prestige multiplier and any mini-game multipliers from prestige upgrades
    const miniGameMultiplier = ownedPrestigeUpgrades.includes("master_barista") ? 3 : 1
    // Cap the reward to avoid excessive earnings
    const finalReward = Math.floor(Math.min(reward * prestigeLevel * miniGameMultiplier, 750))

    setCash((prev) => prev + finalReward)
    setTotalEarnings((prev) => prev + finalReward)

    // Update high score if better
    if (score > latteArtHighScore) {
      setLatteArtHighScore(score)
    }

    playSound("success")

    toast({
      title: "Latte Art Complete!",
      description: `You scored ${score} points and earned ${formatCurrency(finalReward)}!`,
    })

    // Close game
    setShowLatteArtGame(false)

    // Resume main music
    if (musicEnabled) {
      soundManager.playMusic("main")
    }
  }

  // Generate a customer
  const generateCustomer = () => {
    // Select a random customer type
    const randomIndex = Math.floor(Math.random() * CUSTOMER_TYPES.length)
    const customer = CUSTOMER_TYPES[randomIndex]

    // Generate specific coffee preferences
    const preferredBeans = beanTypes[Math.floor(Math.random() * beanTypes.length)]
    const preferredMilk = milkTypes[Math.floor(Math.random() * milkTypes.length)]
    const preferredExtra =
      Math.random() > 0.5 ? extraTypes[Math.floor(Math.random() * (extraTypes.length - 1))] : "None"

    // Add unique ID and preferences
    const customerWithId = {
      ...customer,
      uniqueId: Date.now().toString(),
      coffeePreferences: {
        beans: preferredBeans,
        milk: preferredMilk,
        extra: preferredExtra,
      },
    }

    setCurrentCustomers((prev) => [...prev, customerWithId])
  }

  // Handle serving a customer
  const handleServeCustomer = (customerId: string, amount: number, tip: number) => {
    // Find the customer
    const customer = currentCustomers.find((c) => c.uniqueId === customerId)
    if (!customer) return

    // Check if coffee matches preferences
    const beansMatch = selectedIngredients.beans === customer.coffeePreferences?.beans
    const milkMatch = selectedIngredients.milk === customer.coffeePreferences?.milk
    const extraMatch = selectedIngredients.extra === customer.coffeePreferences?.extra

    const totalMatches = [beansMatch, milkMatch, extraMatch].filter(Boolean).length

    // Apply prestige and global multipliers
    // Also apply customer loyalty bonus from prestige upgrades
    const loyaltyMultiplier = ownedPrestigeUpgrades.includes("customer_loyalty") ? 1.75 : 1

    // Base amount
    const finalAmount = Math.floor(amount * prestigeLevel * globalMultiplier)

    // Tip based on matches
    let finalTip = 0
    if (totalMatches === 3) {
      finalTip = Math.floor(tip * 2 * prestigeLevel * globalMultiplier * loyaltyMultiplier)
      playSound("success")
      toast({
        title: "Perfect Match!",
        description: "Customer is delighted with their perfect coffee!",
      })
    } else if (totalMatches === 2) {
      finalTip = Math.floor(tip * 1.5 * prestigeLevel * globalMultiplier * loyaltyMultiplier)
      playSound("collect")
      toast({
        title: "Good Match!",
        description: "Customer is happy with their coffee!",
      })
    } else if (totalMatches === 1) {
      finalTip = Math.floor(tip * prestigeLevel * globalMultiplier * loyaltyMultiplier)
      toast({
        title: "Acceptable",
        description: "Customer accepts the coffee but expected better.",
      })
    } else {
      finalTip = Math.floor(tip * 0.5 * prestigeLevel * globalMultiplier * loyaltyMultiplier)
      playSound("fail")
      toast({
        title: "Poor Match",
        description: "Customer is disappointed with their coffee.",
        variant: "destructive",
      })
    }

    setCash((prev) => prev + finalAmount + finalTip)
    setTotalEarnings((prev) => prev + finalAmount + finalTip)
    setTotalCustomersServed((prev) => prev + 1)

    // Remove customer after a delay
    setTimeout(() => {
      setCurrentCustomers((prev) => prev.filter((c) => c.uniqueId !== customerId))
    }, 3000)

    // Check for achievement
    if (totalCustomersServed + 1 >= 1000) {
      checkAchievement("customer_service")
    }
  }

  // Handle customer leaving
  const handleCustomerLeave = (customerId: string) => {
    setCurrentCustomers((prev) => prev.filter((c) => c.uniqueId !== customerId))

    toast({
      title: "Customer Left",
      description: "The customer got tired of waiting and left.",
      variant: "destructive",
    })
  }

  // Check for seasonal events
  const checkSeasonalEvents = () => {
    // Get current date
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentDay = now.getDate()

    // Check each seasonal event
    SEASONAL_EVENTS.forEach((event) => {
      // Check if event is active for this month
      let isActive = false

      if (event.duration === 1) {
        // One-day event (like Coffee Day)
        isActive = currentMonth === event.startMonth && currentDay === 1
      } else if (event.startMonth > event.endMonth) {
        // Event spans year boundary (like Holiday Blend)
        isActive = currentMonth >= event.startMonth || currentMonth <= event.endMonth
      } else {
        // Normal event within same year
        isActive = currentMonth >= event.startMonth && currentMonth <= event.endMonth
      }

      // If event is active and not already set
      if (isActive && (!currentSeasonalEvent || currentSeasonalEvent.id !== event.id)) {
        setCurrentSeasonalEvent(event)
        setShowSeasonalEventBanner(true)

        // Add special business if available
        if (event.effects.specialBusiness) {
          setSpecialBusinesses((prev) => {
            // Only add if not already present
            if (!prev.some((b) => b.id === event.effects.specialBusiness.id)) {
              return [...prev, event.effects.specialBusiness]
            }
            return prev
          })
        }

        // Add special upgrades if available
        if (event.effects.specialUpgrades) {
          setSpecialUpgrades((prev) => {
            // Filter out any upgrades already in the list
            const newUpgrades = event.effects.specialUpgrades.filter(
              (upgrade) => !prev.some((u) => u.id === upgrade.id),
            )
            return [...prev, ...newUpgrades]
          })
        }

        // Recalculate global multiplier
        recalculateGlobalMultiplier()

        toast({
          title: "Seasonal Event Active!",
          description: `${event.name} is now active!`,
        })
      } else if (!isActive && currentSeasonalEvent && currentSeasonalEvent.id === event.id) {
        // Event has ended
        setCurrentSeasonalEvent(null)

        // Remove special businesses
        if (event.effects.specialBusiness) {
          setSpecialBusinesses((prev) => prev.filter((b) => b.id !== event.effects.specialBusiness.id))
        }

        // Remove special upgrades
        if (event.effects.specialUpgrades) {
          setSpecialUpgrades((prev) =>
            prev.filter((upgrade) => !event.effects.specialUpgrades.some((u) => u.id === upgrade.id)),
          )
        }

        // Recalculate global multiplier
        recalculateGlobalMultiplier()

        toast({
          title: "Seasonal Event Ended",
          description: `${event.name} has ended.`,
        })
      }
    })
  }

  // Check for achievements
  const checkAchievements = () => {
    ACHIEVEMENTS.forEach((achievement) => {
      // Skip if already achieved
      if (achievements[achievement.id]) return

      let achieved = false

      switch (achievement.requirement.type) {
        case "earnings":
          achieved = totalEarnings >= achievement.requirement.value
          break
        case "businesses":
          achieved = Object.values(businesses).some((b) => b.owned >= achievement.requirement.value)
          break
        case "minigame":
          achieved =
            beanSortingHighScore >= achievement.requirement.value || latteArtHighScore >= achievement.requirement.value
          break
        case "customers":
          achieved = totalCustomersServed >= achievement.requirement.value
          break
        case "prestige":
          achieved = prestigeLevel >= achievement.requirement.value
          break
      }

      if (achieved) {
        // Mark as achieved
        setAchievements((prev) => ({
          ...prev,
          [achievement.id]: true,
        }))

        // Apply reward
        if (achievement.reward.type === "cash") {
          setCash((prev) => prev + achievement.reward.value)
        } else if (achievement.reward.type === "multiplier") {
          setGlobalMultiplier((prev) => prev * achievement.reward.value)
        }

        // Play achievement sound
        playSound("achievement")

        // Show achievement toast
        setShowAchievementToast({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
        })
      }
    })
  }

  // Check specific achievement
  const checkAchievement = (achievementId: string) => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)

    if (!achievement || achievements[achievementId]) return

    // Mark as achieved
    setAchievements((prev) => ({
      ...prev,
      [achievementId]: true,
    }))

    // Apply reward
    if (achievement.reward.type === "cash") {
      setCash((prev) => prev + achievement.reward.value)
    } else if (achievement.reward.type === "multiplier") {
      setGlobalMultiplier((prev) => prev * achievement.reward.value)
    }

    // Play achievement sound
    playSound("achievement")

    // Show achievement toast
    setShowAchievementToast({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
    })

    toast({
      title: "Achievement Unlocked!",
      description: achievement.name,
    })
  }

  // Get total number of businesses owned
  const getTotalBusinessesOwned = () => {
    return Object.values(businesses).reduce((total, business) => {
      return total + business.owned
    }, 0)
  }

  // Get maximum number of businesses owned (for achievements)
  const getMaxBusinessOwned = () => {
    return Math.max(...Object.values(businesses).map((business) => business.owned), 0)
  }

  // Calculate achievement progress percentage
  const getAchievementProgress = (achievement: any) => {
    let current = 0
    const target = achievement.requirement.value

    switch (achievement.requirement.type) {
      case "earnings":
        current = Math.min(totalEarnings, target)
        break
      case "businesses":
        current = Math.min(getMaxBusinessOwned(), target)
        break
      case "minigame":
        current = Math.min(Math.max(beanSortingHighScore, latteArtHighScore), target)
        break
      case "customers":
        current = Math.min(totalCustomersServed, target)
        break
      case "prestige":
        current = Math.min(prestigeLevel, target)
        break
    }

    return (current / target) * 100
  }

  // Add a new function to save the game state
  const saveGameState = () => {
    // Save essential game data to localStorage
    const gameData = {
      lastOnlineTime: Date.now(),
      secondsPassed: secondsPassed,
      totalEarnings: totalEarnings,
      cash: cash,
      prestigeLevel: prestigeLevel,
      prestigePoints: prestigePoints,
      // Add other essential state you want to persist
    }

    localStorage.setItem("grindBeanGameData", JSON.stringify(gameData))
    localStorage.setItem("lastOnlineTime", Date.now().toString()) // Keep this for backward compatibility

    toast({
      title: "Game Saved",
      description: "Your progress has been saved.",
    })
  }

  // Add a function to load the game state
  const loadGameState = () => {
    const savedData = localStorage.getItem("grindBeanGameData")

    if (savedData) {
      try {
        const gameData = JSON.parse(savedData)

        // Load the game time
        if (gameData.secondsPassed) {
          setSecondsPassed(gameData.secondsPassed)
        }

        // Optionally load other saved data if needed
        if (gameData.cash) setCash(gameData.cash)
        if (gameData.totalEarnings) setTotalEarnings(gameData.totalEarnings)
        if (gameData.prestigeLevel) setPrestigeLevel(gameData.prestigeLevel)
        if (gameData.prestigePoints) setPrestigePoints(gameData.prestigePoints)

        console.log("Game data loaded successfully")
      } catch (error) {
        console.error("Error loading saved game data:", error)
      }
    }
  }

  // All other functions remain the same
  // ...

  // Add a function to format the total play time in a more human-readable format
  // Add this function near the other formatting functions
  const formatTotalPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  // Add this function to handle streak claims
  const handleClaimStreak = () => {
    const now = Date.now()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if this is the first claim
    if (!lastStreakClaim) {
      setCurrentStreak(1)
      setLastStreakClaim(now)
      setStreakHistory([{ date: today.getTime(), claimed: true }])

      // Give initial reward
      const reward = calculateStreakReward(1)
      setCash((prev) => prev + reward)
      setTotalEarnings((prev) => prev + reward)

      toast({
        title: "Streak Started!",
        description: `You've started a daily streak! +${formatCurrency(reward)}`,
      })
      return
    }

    const lastClaim = new Date(lastStreakClaim)
    lastClaim.setHours(0, 0, 0, 0)

    // Calculate days since last claim
    const timeDiff = today.getTime() - lastClaim.getTime()
    const daysSinceLastClaim = Math.floor(timeDiff / (24 * 60 * 60 * 1000))

    // Update streak based on days since last claim
    let newStreak = currentStreak

    if (daysSinceLastClaim <= 1) {
      // Claimed yesterday or today (already claimed today should be prevented by UI)
      newStreak += 1
    } else if (daysSinceLastClaim <= streakProtection + 1) {
      // Within streak protection period
      newStreak += 1

      // Consume streak protection
      setStreakProtection(Math.max(0, streakProtection - 1))

      toast({
        title: "Streak Protection Used!",
        description: `Your streak was protected! You missed ${daysSinceLastClaim - 1} day(s).`,
      })
    } else {
      // Streak broken
      newStreak = 1

      toast({
        title: "Streak Reset",
        description: `Your streak was reset. You missed ${daysSinceLastClaim - 1} days.`,
        variant: "destructive",
      })
    }

    // Update streak history
    const newHistory = [...streakHistory]

    // Add entries for missed days
    if (daysSinceLastClaim > 1) {
      for (let i = 1; i < daysSinceLastClaim; i++) {
        const missedDate = new Date(lastClaim)
        missedDate.setDate(lastClaim.getDate() + i)
        newHistory.push({ date: missedDate.getTime(), claimed: false })
      }
    }

    // Add today's claim
    newHistory.push({ date: today.getTime(), claimed: true })

    // Update state
    setCurrentStreak(newStreak)
    setLastStreakClaim(now)
    setStreakHistory(newHistory)

    // Give streak reward
    const reward = calculateStreakReward(newStreak)
    setCash((prev) => prev + reward)
    setTotalEarnings((prev) => prev + reward)

    // Check for milestone and show celebration
    const isMilestone = [3, 7, 14, 30, 90, 180, 365].includes(newStreak)
    if (isMilestone) {
      setShowMilestone({ days: newStreak, reward })
      playSound("achievement")
    } else {
      playSound("collect")
      toast({
        title: `${newStreak}-Day Streak!`,
        description: `You've played for ${newStreak} consecutive days! +${formatCurrency(reward)}`,
      })
    }

    // Replenish streak protection every 7 days
    if (newStreak % 7 === 0) {
      setStreakProtection(Math.min(streakProtection + 1, 3))

      toast({
        title: "Streak Protection Added!",
        description: "You've earned a streak protection day!",
      })
    }
  }

  // Add a function to calculate streak rewards
  const calculateStreakReward = (streak: number) => {
    // Base reward calculation logic - same as in the component
    let baseReward = 200

    // Non-linear reward scaling
    if (streak >= 365) baseReward = 50000
    else if (streak >= 180) baseReward = 20000
    else if (streak >= 90) baseReward = 10000
    else if (streak >= 30) baseReward = 5000
    else if (streak >= 14) baseReward = 2000
    else if (streak >= 7) baseReward = 1000
    else if (streak >= 3) baseReward = 500

    // Apply prestige multiplier
    return Math.floor(baseReward * prestigeLevel)
  }

  // Load and save streak data with the game state
  useEffect(() => {
    // Add this to your existing loadGameState function or load here
    const savedStreakData = localStorage.getItem("grindBeanStreakData")
    if (savedStreakData) {
      try {
        const data = JSON.parse(savedStreakData)
        setCurrentStreak(data.currentStreak || 0)
        setLastStreakClaim(data.lastStreakClaim || null)
        setStreakHistory(data.streakHistory || [])
        setStreakProtection(data.streakProtection || 1)
      } catch (error) {
        console.error("Error loading streak data:", error)
      }
    }
  }, [])

  // Save streak data when relevant states change
  useEffect(() => {
    // Only save if we have actual streak data
    if (lastStreakClaim) {
      const streakData = {
        currentStreak,
        lastStreakClaim,
        streakHistory,
        streakProtection,
      }
      localStorage.setItem("grindBeanStreakData", JSON.stringify(streakData))
    }
  }, [currentStreak, lastStreakClaim, streakHistory, streakProtection])

  const getMonthName = (month: number) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return monthNames[month]
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-amber-900 to-amber-950 text-white">
      {/* Floating cash animation */}
      {showFloatingCash && (
        <div
          className="fixed text-amber-400 font-bold text-xl animate-float-up z-50"
          style={{
            left: `${floatingCashPosition.x}px`,
            top: `${floatingCashPosition.y}px`,
          }}
        >
          +{formatCurrency(floatingCashAmount)}
        </div>
      )}

      {/* Achievement Toast */}
      {showAchievementToast && (
        <div
          className="fixed top-20 right-4 z-50 max-w-sm w-full bg-gradient-to-r from-amber-700 to-amber-800 
          rounded-lg shadow-lg border-2 border-amber-400 p-4 flex items-center
          transition-all duration-500 transform animate-float-in"
        >
          <div className="mr-4 bg-gradient-to-r from-amber-900 to-amber-950 p-2 rounded-full">
            <Award className="h-8 w-8 text-amber-300" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{showAchievementToast.name}</h3>
            <p className="text-sm text-amber-200">{showAchievementToast.description}</p>
          </div>
          <button onClick={() => setShowAchievementToast(null)} className="ml-2 text-amber-300 hover:text-amber-100">
            ×
          </button>
        </div>
      )}

      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-amber-800 to-amber-900 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-amber-700 p-2 rounded-full">
              <Coffee className="h-8 w-8 text-amber-300" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold pixel-text">$GRIND: Bean Empire</h1>
              <p className="text-amber-300 text-xs">Prestige Level: {prestigeLevel}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-amber-700 to-amber-800 rounded-lg p-3 flex items-center shadow-inner">
              <Coins className="h-6 w-6 mr-2 text-amber-300" />
              <div>
                <div className="text-xl font-bold">{formatCurrency(cash)}</div>
                <div className="text-xs text-amber-300">{formatCurrency(calculateTotalIncomePerSecond())}/sec</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="border-amber-400 text-amber-300 hover:bg-amber-800 hover:text-amber-200"
                onClick={() => setShowManagers(true)}
              >
                <Award className="h-4 w-4 mr-1" />
                Managers
              </Button>

              <Button
                variant="outline"
                className="border-amber-400 text-amber-300 hover:bg-amber-800 hover:text-amber-200"
                onClick={() => setShowUpgrades(true)}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Upgrades
              </Button>

              <Button
                variant="outline"
                className="border-amber-400 text-amber-300 hover:bg-amber-800 hover:text-amber-200"
                onClick={() => setShowStats(true)}
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                Stats
              </Button>

              <Button
                variant="outline"
                className="border-amber-400 text-amber-300 hover:bg-amber-800 hover:text-amber-200"
                onClick={() => setShowPrestigeModal(true)}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Prestige
              </Button>

              <Button
                variant="outline"
                className="border-amber-400 text-amber-300 hover:bg-amber-800 hover:text-amber-200"
                onClick={() => setShowAchievementsPanel(true)}
              >
                <Trophy className="h-4 w-4 mr-1" />
                Achievements
              </Button>

              <Button
                variant="outline"
                className="border-amber-400 text-amber-300 hover:bg-amber-800 hover:text-amber-200"
                onClick={toggleSound}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Seasonal Event Banner */}
      {showSeasonalEventBanner && currentSeasonalEvent && (
        <div className="max-w-7xl mx-auto px-4">
          <SeasonalEventBanner
            event={currentSeasonalEvent}
            onDismiss={() => setShowSeasonalEventBanner(false)}
            onViewDetails={() => {
              setActiveTab("seasonal")
              setShowSeasonalEventBanner(false)
            }}
          />
        </div>
      )}

      {/* Daily Reward & Streak System */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 p-2 border-t border-amber-700 border-b border-amber-950">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-amber-300" />
            <span className="text-sm font-bold text-amber-200">Game time: {formatTime(secondsPassed)}</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-amber-400 text-amber-300 hover:bg-amber-800 hover:text-amber-200"
              onClick={() => setShowStreakCalendar(true)}
            >
              <Calendar className="h-4 w-4 mr-1" />
              {currentStreak > 0 ? `${currentStreak}-Day Streak` : "Streak Calendar"}
            </Button>

            <div className="bg-amber-800 rounded-lg p-2 flex items-center shadow-inner">
              <Gift className="h-6 w-6 mr-2 text-amber-300" />
              {dailyRewardAvailable ? (
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                  onClick={claimDailyReward}
                >
                  Claim Daily Reward!
                </Button>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2 text-amber-300">Next reward:</span>
                  <span className="font-bold">{formatTime(dailyRewardTimer)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {recentCollections.length > 0 && (
              <div className="text-sm text-amber-300">
                Recent: {formatCurrency(recentCollections[recentCollections.length - 1].amount)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Game Area - Tabbed Interface */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="businesses" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4 bg-amber-800">
              <TabsTrigger value="businesses" className="data-[state=active]:bg-amber-600">
                <Coffee className="h-4 w-4 mr-2" />
                Businesses
              </TabsTrigger>
              <TabsTrigger value="automation" className="data-[state=active]:bg-amber-600">
                <Settings className="h-4 w-4 mr-2" />
                Automation
              </TabsTrigger>
              <TabsTrigger value="customers" className="data-[state=active]:bg-amber-600">
                <Award className="h-4 w-4 mr-2" />
                Customers
              </TabsTrigger>
              <TabsTrigger value="seasonal" className="data-[state=active]:bg-amber-600">
                <Zap className="h-4 w-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger value="prestige" className="data-[state=active]:bg-amber-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Prestige
              </TabsTrigger>
            </TabsList>

            <TabsContent value="businesses" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUSINESSES.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    businessState={businesses[business.id]}
                    cash={cash}
                    onBuy={() => buyBusiness(business.id)}
                    onBuy10={() => buyBusiness(business.id, 10)}
                    onBuy100={() => buyBusiness(business.id, 100)}
                    onBuyMax={() => buyMaxAffordable(business.id)}
                    onCollect={(e) => handleCollectBusiness(business.id, e)}
                    onStart={() => startBusiness(business.id)}
                    timeRemaining={getTimeRemaining(business.id)}
                    onClick={handleClick}
                  />
                ))}

                {/* Special seasonal businesses */}
                {specialBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    businessState={
                      businesses[business.id] || {
                        owned: 0,
                        level: 0,
                        hasManager: false,
                        speedMultiplier: 1,
                        profitMultiplier: 1,
                        lastCollected: null,
                        progress: 0,
                      }
                    }
                    cash={cash}
                    onBuy={() => buyBusiness(business.id)}
                    onBuy10={() => buyBusiness(business.id, 10)}
                    onBuy100={() => buyBusiness(business.id, 100)}
                    onBuyMax={() => buyMaxAffordable(business.id)}
                    onCollect={(e) => handleCollectBusiness(business.id, e)}
                    onStart={() => startBusiness(business.id)}
                    timeRemaining={getTimeRemaining(business.id)}
                    onClick={handleClick}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="automation" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-800 rounded-lg p-4 shadow-md">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-amber-300" />
                    Available Managers
                  </h2>

                  <div className="space-y-3">
                    {getAvailableManagers().length > 0 ? (
                      getAvailableManagers().map((manager) => (
                        <div key={manager.id} className="bg-amber-700 rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <h3 className="font-bold">{manager.name}</h3>
                            <p className="text-sm text-amber-300">{manager.description}</p>
                          </div>
                          <Button
                            variant="default"
                            className={cash >= manager.cost ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-500"}
                            disabled={cash < manager.cost}
                            onClick={() => buyManager(manager.id)}
                          >
                            Hire ({formatCurrency(manager.cost)})
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-amber-300">
                        <p>No managers available right now.</p>
                        <p className="text-sm mt-2">Purchase more businesses to unlock managers.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-amber-800 rounded-lg p-4 shadow-md">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-amber-300" />
                    Auto-Brewers
                  </h2>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>Current Auto-Brewers:</span>
                      <span className="font-bold">{autoBrewers}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Passive Income:</span>
                      <span className="font-bold text-amber-300">{formatCurrency(passiveIncome)}/sec</span>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    disabled={coins < Math.floor(100 * Math.pow(1.5, autoBrewers))}
                    onClick={() => upgradeMachine("autoBrewer")}
                  >
                    Buy Auto-Brewer ({formatCurrency(Math.floor(100 * Math.pow(1.5, autoBrewers)))})
                  </Button>

                  <div className="mt-6">
                    <h3 className="font-bold mb-2">Income Multiplier</h3>
                    <div className="flex justify-between mb-1">
                      <span>Current Multiplier:</span>
                      <span className="font-bold">{incomeMultiplier.toFixed(1)}x</span>
                    </div>

                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                      disabled={coins < Math.floor(200 * Math.pow(2, incomeMultiplier - 1))}
                      onClick={() => upgradeMachine("multiplier")}
                    >
                      Upgrade Multiplier ({formatCurrency(Math.floor(200 * Math.pow(2, incomeMultiplier - 1)))})
                    </Button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold mb-2 flex items-center">
                        <Coffee className="h-4 w-4 mr-2 text-amber-300" />
                        Bean Sorting Mini-Game
                      </h3>
                      <p className="text-sm mb-3">Sort coffee beans to earn extra cash!</p>
                      <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        onClick={() => {
                          setShowBeanSortingGame(true)
                          if (musicEnabled) {
                            soundManager.playMusic("minigame")
                          }
                        }}
                      >
                        Play Bean Sorting
                      </Button>
                    </div>

                    <div>
                      <h3 className="font-bold mb-2 flex items-center">
                        <Coffee className="h-4 w-4 mr-2 text-amber-300" />
                        Latte Art Mini-Game
                      </h3>
                      <p className="text-sm mb-3">Create beautiful latte art designs!</p>
                      <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        onClick={() => {
                          setShowLatteArtGame(true)
                          if (musicEnabled) {
                            soundManager.playMusic("minigame")
                          }
                        }}
                      >
                        Play Latte Art
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="customers" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="bg-amber-800 rounded-lg p-4 shadow-md mb-4">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-amber-300" />
                      Customer Management
                    </h2>

                    <p className="mb-4">
                      Serve customers to earn additional income. Different customers have different preferences and
                      spending habits.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-amber-700/50 p-3 rounded-lg">
                        <h3 className="font-bold mb-2">Business Quality</h3>
                        <p className="text-sm mb-2">Higher quality attracts better customers with bigger tips.</p>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Current Quality:</span>
                          <span>{businessQuality.toFixed(1)}/10</span>
                        </div>
                        <Progress
                          value={businessQuality * 10}
                          className="h-2 bg-amber-900"
                          indicatorClassName="bg-amber-400"
                        />
                      </div>

                      <div className="bg-amber-700/50 p-3 rounded-lg">
                        <h3 className="font-bold mb-2">Customer Stats</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Total Served:</span>
                            <span className="font-bold">{totalCustomersServed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Customers:</span>
                            <span className="font-bold">{currentCustomers.length}/3</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Achievement Progress:</span>
                            <span className="font-bold">
                              {Math.min(100, (totalCustomersServed / 1000) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                      onClick={() => {
                        if (currentCustomers.length < 3) {
                          generateCustomer()
                          toast({
                            title: "Customer Attracted",
                            description: "A new customer has arrived at your coffee shop!",
                          })
                        } else {
                          toast({
                            title: "Shop is Full",
                            description: "Your shop is already full of customers!",
                            variant: "destructive",
                          })
                        }
                      }}
                      disabled={currentCustomers.length >= 3}
                    >
                      Attract Customer
                    </Button>
                  </div>

                  {/* Coffee Brewing Section */}
                  <div className="bg-amber-800 rounded-lg p-4 shadow-md mb-4">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <Coffee className="h-5 w-5 mr-2 text-amber-300" />
                      Coffee Brewing
                    </h2>

                    <p className="mb-4">
                      Brew coffee for your customers based on their preferences. Select the right ingredients to
                      maximize tips!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Bean Selection */}
                      <div className="bg-amber-700/50 p-3 rounded-lg">
                        <h3 className="font-bold mb-2">Select Beans</h3>
                        <div className="space-y-2">
                          {beanTypes.map((bean) => (
                            <Button
                              key={bean}
                              variant={selectedIngredients.beans === bean ? "default" : "outline"}
                              className={`w-full ${selectedIngredients.beans === bean ? "bg-amber-500" : "border-amber-500 text-amber-300"}`}
                              onClick={() => selectIngredient("beans", bean)}
                            >
                              {bean}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Milk Selection */}
                      <div className="bg-amber-700/50 p-3 rounded-lg">
                        <h3 className="font-bold mb-2">Select Milk</h3>
                        <div className="space-y-2">
                          {milkTypes.map((milk) => (
                            <Button
                              key={milk}
                              variant={selectedIngredients.milk === milk ? "default" : "outline"}
                              className={`w-full ${selectedIngredients.milk === milk ? "bg-amber-500" : "border-amber-500 text-amber-300"}`}
                              onClick={() => selectIngredient("milk", milk)}
                            >
                              {milk}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Extras Selection */}
                      <div className="bg-amber-700/50 p-3 rounded-lg">
                        <h3 className="font-bold mb-2">Select Extras</h3>
                        <div className="space-y-2">
                          {extraTypes.map((extra) => (
                            <Button
                              key={extra}
                              variant={selectedIngredients.extra === extra ? "default" : "outline"}
                              className={`w-full ${selectedIngredients.extra === extra ? "bg-amber-500" : "border-amber-500 text-amber-300"}`}
                              onClick={() => selectIngredient("extra", extra)}
                            >
                              {extra}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-700/50 p-3 rounded-lg mb-4">
                      <h3 className="font-bold mb-2">Current Selection</h3>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-amber-800/50 p-2 rounded">
                          <div className="font-bold">Beans:</div>
                          <div>{selectedIngredients.beans || "Not selected"}</div>
                        </div>
                        <div className="bg-amber-800/50 p-2 rounded">
                          <div className="font-bold">Milk:</div>
                          <div>{selectedIngredients.milk || "Not selected"}</div>
                        </div>
                        <div className="bg-amber-800/50 p-2 rounded">
                          <div className="font-bold">Extra:</div>
                          <div>{selectedIngredients.extra || "None"}</div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="default"
                      className={`w-full ${isCoffeeBrewedReady ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"}`}
                      onClick={() => {
                        if (!selectedIngredients.beans || !selectedIngredients.milk) {
                          toast({
                            title: "Incomplete Selection",
                            description: "Please select beans and milk type.",
                            variant: "destructive",
                          })
                          return
                        }

                        handleCoffeeBrewed()
                      }}
                      disabled={!selectedIngredients.beans || !selectedIngredients.milk}
                    >
                      {isCoffeeBrewedReady ? "Coffee Ready!" : "Brew Coffee"}
                    </Button>
                  </div>

                  <div className="bg-amber-800 rounded-lg p-4 shadow-md">
                    <h2 className="text-xl font-bold mb-4">Customer Types</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {CUSTOMER_TYPES.map((customer) => (
                        <div key={customer.id} className="bg-amber-700 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-amber-600 rounded-full mr-2 text-lg">
                              {customer.icon}
                            </div>
                            <h3 className="font-bold">{customer.name}</h3>
                          </div>
                          <p className="text-xs text-amber-300 mb-2">{customer.description}</p>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div>Quality: {customer.preferences.quality * 10}/10</div>
                            <div>Price: {customer.preferences.price * 10}/10</div>
                            <div>Speed: {customer.preferences.speed * 10}/10</div>
                            <div>Loyalty: {customer.preferences.loyalty * 10}/10</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-amber-800 rounded-lg p-4 shadow-md sticky top-4">
                    <h2 className="text-xl font-bold mb-4">Current Customers</h2>

                    {currentCustomers.length === 0 ? (
                      <div className="text-center py-8 text-amber-300">
                        <p>No customers right now.</p>
                        <p className="text-sm mt-2">Attract customers to earn more income!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentCustomers.map((customer) => (
                          <div
                            key={customer.uniqueId}
                            className="bg-amber-700 rounded-lg p-3 border-2 border-amber-600"
                          >
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 flex items-center justify-center bg-amber-700 rounded-full mr-3 text-xl">
                                {customer.icon}
                              </div>
                              <div>
                                <h3 className="font-bold">{customer.name}</h3>
                                <p className="text-xs text-amber-300">{customer.description}</p>
                              </div>
                            </div>
                            <div className="bg-amber-800/50 p-2 rounded-lg mb-2 text-sm">
                              <div className="font-bold">Preferences:</div>
                              <div className="grid grid-cols-3 gap-1 mt-1">
                                <div>
                                  <span className="text-amber-300">Beans:</span>{" "}
                                  {customer.coffeePreferences?.beans || "Any"}
                                </div>
                                <div>
                                  <span className="text-amber-300">Milk:</span>{" "}
                                  {customer.coffeePreferences?.milk || "Any"}
                                </div>
                                <div>
                                  <span className="text-amber-300">Extra:</span>{" "}
                                  {customer.coffeePreferences?.extra || "None"}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="default"
                              className={`w-full ${isCoffeeBrewedReady ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"}`}
                              onClick={() =>
                                handleServeCustomer(
                                  customer.uniqueId,
                                  customer.spendingLimit,
                                  customer.spendingLimit * 0.2,
                                )
                              }
                              disabled={!isCoffeeBrewedReady}
                            >
                              {isCoffeeBrewedReady ? "Serve Coffee" : "Brew Coffee First"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seasonal" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-800 rounded-lg p-4 shadow-md">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-amber-300" />
                    Active Events
                  </h2>

                  {currentSeasonalEvent ? (
                    <div className="bg-gradient-to-r from-amber-700 to-amber-800 rounded-lg p-4 mb-4 border-2 border-amber-500">
                      <h3 className="font-bold text-lg mb-1">{currentSeasonalEvent.name}</h3>
                      <p className="text-sm mb-3">{currentSeasonalEvent.description}</p>

                      <div className="bg-amber-900/50 p-3 rounded-lg">
                        <h4 className="font-bold mb-2">Active Effects:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {currentSeasonalEvent.effects.globalMultiplier && (
                            <li>{currentSeasonalEvent.effects.globalMultiplier}x multiplier to all businesses</li>
                          )}
                          {currentSeasonalEvent.effects.specialBusiness && (
                            <li>Special business: {currentSeasonalEvent.effects.specialBusiness.name}</li>
                          )}
                          {currentSeasonalEvent.effects.specialUpgrades &&
                            currentSeasonalEvent.effects.specialUpgrades.length > 0 && (
                              <li>
                                {currentSeasonalEvent.effects.specialUpgrades.length} special upgrade(s) available
                              </li>
                            )}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-amber-300 mb-4">
                      <p>No seasonal events active right now.</p>
                      <p className="text-sm mt-2">Events occur at specific times of the year!</p>
                    </div>
                  )}

                  <h3 className="font-bold mb-2">Random Events</h3>
                  {Object.keys(activeRandomEvents).length > 0 ? (
                    <div className="space-y-3">
                      {Object.values(activeRandomEvents).map((eventData) => (
                        <div key={eventData.event.id} className="bg-amber-700 rounded-lg p-3">
                          <h4 className="font-bold">{eventData.event.title}</h4>
                          <p className="text-xs text-amber-300 mb-2">{eventData.event.description}</p>
                          <div className="flex justify-between text-xs">
                            <span>Time Remaining:</span>
                            <span>{formatTime(Math.max(0, (eventData.endTime - Date.now()) / 1000))}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-amber-300">
                      <p>No random events active right now.</p>
                      <p className="text-sm mt-1">Events occur randomly during gameplay!</p>
                    </div>
                  )}
                </div>

                <div className="bg-amber-800 rounded-lg p-4 shadow-md">
                  <h2 className="text-xl font-bold mb-4">Seasonal Calendar</h2>

                  <div className="space-y-4">
                    {SEASONAL_EVENTS.map((event) => {
                      const isActive = currentSeasonalEvent && currentSeasonalEvent.id === event.id

                      return (
                        <div
                          key={event.id}
                          className={`rounded-lg p-3 border ${
                            isActive
                              ? "bg-gradient-to-r from-amber-600 to-amber-700 border-amber-400"
                              : "bg-amber-700/50 border-amber-700"
                          }`}
                        >
                          <h3 className="font-bold flex items-center">
                            {isActive && <Zap className="h-4 w-4 mr-1 text-amber-300" />}
                            {event.name}
                            {isActive && (
                              <span className="ml-2 text-xs bg-amber-500 px-2 py-0.5 rounded-full">ACTIVE</span>
                            )}
                          </h3>

                          <p className="text-xs text-amber-300 mb-2">
                            {event.startMonth === event.endMonth
                              ? `Occurs on October 1st only!`
                              : `${getMonthName(event.startMonth)} - ${getMonthName(event.endMonth)}`}
                          </p>

                          <p className="text-sm mb-2">{event.description}</p>

                          <div className="text-xs">
                            {event.effects.globalMultiplier && (
                              <div className="flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1 text-amber-300" />
                                <span>{event.effects.globalMultiplier}x global multiplier</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prestige" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-800 rounded-lg p-4 shadow-md">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-amber-300" />
                    Prestige Information
                  </h2>

                  <div className="bg-amber-700/50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold">Current Status</h3>
                      <div className="bg-amber-600 px-3 py-1 rounded-lg text-sm">Level {prestigeLevel}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Current Multiplier:</span>
                        <span className="font-bold">{prestigeLevel}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prestige Points:</span>
                        <span className="font-bold">{prestigePoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Earnings:</span>
                        <span className="font-bold">{formatCurrency(totalEarnings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Required for Next Level:</span>
                        <span className="font-bold">{formatCurrency(Math.pow(10, prestigeLevel + 5))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-700/50 p-4 rounded-lg">
                    <h3 className="font-bold mb-3">Prestige Benefits</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Permanent income multiplier for all businesses</li>
                      <li>Earn prestige points to purchase permanent upgrades</li>
                      <li>Unlock new features and abilities</li>
                      <li>Faster progression in future runs</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      onClick={() => setShowPrestigeModal(true)}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Prestige Now
                    </Button>
                  </div>
                </div>

                <div className="bg-amber-800 rounded-lg p-4 shadow-md">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-amber-300" />
                    Prestige Upgrades
                  </h2>

                  <div className="bg-amber-700/50 p-4 rounded-lg mb-4">
                    <p className="mb-3">
                      Spend your prestige points on permanent upgrades that persist through prestige resets.
                    </p>

                    <div className="flex justify-between items-center">
                      <span>Available Points:</span>
                      <span className="font-bold text-amber-300">{prestigePoints}</span>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    onClick={() => setShowPrestigeUpgrades(true)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Prestige Upgrades
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-amber-900 to-amber-800 p-3 border-t border-amber-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm">Prestige Level: {prestigeLevel}</span>
            <span className="mx-2">•</span>
            <span className="text-sm">Total Earnings: {formatCurrency(totalEarnings)}</span>
            {globalMultiplier > 1 && (
              <>
                <span className="mx-2">•</span>
                <span className="text-sm text-amber-300">Event Multiplier: {globalMultiplier.toFixed(1)}x</span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-300 hover:text-amber-200 hover:bg-amber-800"
              onClick={toggleMusic}
            >
              {musicEnabled ? "Music: On" : "Music: Off"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-amber-300 hover:text-amber-200 hover:bg-amber-800"
              onClick={saveGameState}
            >
              Save Game
            </Button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* Manager Modal */}
      {showManagers && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-800 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold">Managers</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowManagers(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {getAvailableManagers().length === 0 ? (
                <div className="text-center py-8 text-amber-200">
                  <p>No managers available right now.</p>
                  <p className="text-sm mt-2">Purchase more businesses to unlock managers.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {getAvailableManagers().map((manager) => (
                    <div key={manager.id} className="bg-amber-700 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{manager.name}</h3>
                        <p className="text-sm text-amber-200">{manager.description}</p>
                      </div>

                      <Button
                        variant="default"
                        className={cash >= manager.cost ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-500"}
                        disabled={cash < manager.cost}
                        onClick={() => buyManager(manager.id)}
                      >
                        Hire ({formatCurrency(manager.cost)})
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upgrades Modal */}
      {showUpgrades && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-800 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold">Upgrades</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowUpgrades(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {getAvailableUpgrades().length === 0 ? (
                <div className="text-center py-8 text-amber-200">
                  <p>No upgrades available right now.</p>
                  <p className="text-sm mt-2">Purchase more businesses to unlock upgrades.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {getAvailableUpgrades().map((upgrade) => (
                    <div key={upgrade.id} className="bg-amber-700 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{upgrade.name}</h3>
                        <p className="text-sm text-amber-200">{upgrade.description}</p>
                      </div>

                      <Button
                        variant="default"
                        className={cash >= upgrade.cost ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-500"}
                        disabled={cash < upgrade.cost}
                        onClick={() => buyUpgrade(upgrade.id)}
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
      )}

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-800 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-amber-300" />
                Game Statistics
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowStats(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Coffee className="h-4 w-4 mr-2 text-amber-300" />
                    General Statistics
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-amber-200">Total Earnings:</span>
                      <span className="font-bold">{formatCurrency(totalEarnings)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-amber-200">Current Income Rate:</span>
                      <span className="font-bold">{formatCurrency(calculateTotalIncomePerSecond())}/sec</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-amber-200">Total Clicks:</span>
                      <span className="font-bold">{formatNumber(totalClicks)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-amber-200">Time Played:</span>
                      <span className="font-bold">{formatTime(secondsPassed)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200">Total Play Time:</span>
                      <span className="font-bold">{formatTotalPlayTime(secondsPassed)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-amber-300" />
                    Achievements
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-amber-200">Businesses Owned:</span>
                        <span>{getTotalBusinessesOwned()}</span>
                      </div>
                      <Progress
                        value={getBusinessCompletionPercentage()}
                        className="h-2 bg-amber-900"
                        indicatorClassName="bg-amber-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-amber-200">Managers Hired:</span>
                        <span>
                          {Object.values(businesses).filter((b) => b.hasManager).length}/{BUSINESSES.length}
                        </span>
                      </div>
                      <Progress
                        value={getManagerCompletionPercentage()}
                        className="h-2 bg-amber-900"
                        indicatorClassName="bg-amber-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-amber-200">Upgrades Purchased:</span>
                        <span>
                          {ownedUpgrades.length}/{UPGRADES.length}
                        </span>
                      </div>
                      <Progress
                        value={getUpgradeCompletionPercentage()}
                        className="h-2 bg-amber-900"
                        indicatorClassName="bg-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-amber-700/50 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-300" />
                  Business Overview
                </h3>

                <div className="space-y-3">
                  {BUSINESSES.map((business) => {
                    const businessState = businesses[business.id]
                    const isOwned = businessState && businessState.owned > 0

                    return (
                      <div
                        key={business.id}
                        className={`bg-amber-700/50 rounded-lg p-3 ${!isOwned ? "opacity-70" : ""}`}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex items-center justify-center bg-amber-600 rounded-full mr-3 text-xl">
                            {business.icon}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold">{business.name}</h3>
                            <div className="text-sm text-amber-300">
                              {isOwned ? (
                                <>
                                  Owned: {businessState.owned} • {businessState.hasManager ? "Managed" : "Manual"}
                                </>
                              ) : (
                                "Not purchased yet"
                              )}
                            </div>
                          </div>

                          {isOwned && (
                            <div className="text-right">
                              <div className="text-amber-300 font-bold">
                                {formatCurrency(
                                  business.baseRevenue *
                                    businessState.owned *
                                    businessState.profitMultiplier *
                                    prestigeLevel *
                                    globalMultiplier,
                                )}
                              </div>
                              <div className="text-xs">
                                {(business.baseTime / businessState.speedMultiplier).toFixed(1)}s cycle
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-amber-700 flex justify-end">
              <Button onClick={() => setShowStats(false)} className="bg-amber-600 hover:bg-amber-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Prestige Modal */}
      {showPrestigeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col border-2 border-amber-600">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-amber-300" />
                Coffee Bean Rebirth
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowPrestigeModal(false)}>
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
                      <span className="font-bold">{formatCurrency(cash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Earnings:</span>
                      <span className="font-bold">{formatCurrency(totalEarnings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Businesses Owned:</span>
                      <span className="font-bold">{getTotalBusinessesOwned()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Multiplier:</span>
                      <span className="font-bold">{prestigeLevel}x</span>
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
                      <span className="font-bold">{formatCurrency(startingCash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Businesses:</span>
                      <span className="font-bold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Multiplier:</span>
                      <span className="font-bold text-green-400">
                        {Math.max(1, Math.floor(Math.log10(totalEarnings / 1e6)))}x
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Permanent Boost:</span>
                      <span className="font-bold text-green-400">
                        +{((Math.max(1, Math.floor(Math.log10(totalEarnings / 1e6))) - 1) * 100).toFixed(0)}%
                      </span>
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
                      {formatCurrency(totalEarnings)} / {formatCurrency(1e6)}
                    </span>
                  </div>
                  <Progress
                    value={(Math.min(totalEarnings, 1e6) / 1e6) * 100}
                    className="h-2 bg-amber-900"
                    indicatorClassName={totalEarnings >= 1e6 ? "bg-green-500" : "bg-amber-500"}
                  />
                </div>
                <p className="text-sm text-amber-200 mt-2">
                  {totalEarnings >= 1e6
                    ? "You've reached the minimum requirements for rebirth!"
                    : `You need at least ${formatCurrency(1e6)} in total earnings to rebirth.`}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-amber-700 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowPrestigeModal(false)}
                className="border-amber-600 text-amber-300"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handlePrestige}
                disabled={totalEarnings < 1e6}
                className={totalEarnings >= 1e6 ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-500"}
              >
                {totalEarnings >= 1e6 ? "Prestige Now" : "Cannot Prestige Yet"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Panel */}
      {showAchievementsPanel && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-amber-800 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-amber-300" />
                Achievements
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAchievementsPanel(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((achievement) => {
                  const isUnlocked = achievements[achievement.id]
                  return (
                    <div
                      key={achievement.id}
                      className={`bg-amber-700/50 rounded-lg p-4 border-2 ${
                        isUnlocked ? "border-amber-400" : "border-amber-700/50"
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`w-12 h-12 flex items-center justify-center rounded-full mr-3 ${
                            isUnlocked ? "bg-amber-500" : "bg-amber-800"
                          }`}
                        >
                          <Trophy className={`h-6 w-6 ${isUnlocked ? "text-amber-100" : "text-amber-600"}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold flex items-center">
                            {achievement.name}
                            {isUnlocked && (
                              <span className="ml-2 text-xs bg-amber-500 px-2 py-0.5 rounded-full">UNLOCKED</span>
                            )}
                          </h3>
                          <p className="text-sm text-amber-200 mt-1">{achievement.description}</p>

                          <div className="mt-2 text-xs">
                            <div className="flex justify-between mb-1">
                              <span>Requirement:</span>
                              <span>
                                {achievement.requirement.type === "earnings" &&
                                  formatCurrency(achievement.requirement.value)}
                                {achievement.requirement.type === "businesses" &&
                                  `${achievement.requirement.value} of any business`}
                                {achievement.requirement.type === "minigame" &&
                                  `${achievement.requirement.value} points in mini-game`}
                                {achievement.requirement.type === "customers" &&
                                  `${achievement.requirement.value} customers served`}
                                {achievement.requirement.type === "prestige" &&
                                  `Prestige level ${achievement.requirement.value}`}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span>Reward:</span>
                              <span className="text-amber-300">
                                {achievement.reward.type === "cash" && formatCurrency(achievement.reward.value)}
                                {achievement.reward.type === "multiplier" && `${achievement.reward.value}x multiplier`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {!isUnlocked && (
                        <div className="mt-3">
                          <div className="h-2 bg-amber-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500"
                              style={{
                                width: `${getAchievementProgress(achievement)}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-right text-xs mt-1 text-amber-300">
                            {getAchievementProgress(achievement).toFixed(0)}% complete
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-4 border-t border-amber-700 flex justify-end">
              <Button onClick={() => setShowAchievementsPanel(false)} className="bg-amber-600 hover:bg-amber-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Prestige Upgrades Modal */}
      {showPrestigeUpgrades && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-800 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-amber-300" />
                Prestige Upgrades
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowPrestigeUpgrades(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Faster Production */}
                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-amber-300" />
                    Faster Production
                  </h3>
                  <p className="text-sm text-amber-200 mb-3">Increase the production speed of all businesses by 25%.</p>
                  <div className="flex justify-between items-center mb-2">
                    <span>Cost:</span>
                    <span className="font-bold">5 Prestige Points</span>
                  </div>
                  <Button
                    variant="default"
                    className={
                      prestigePoints >= 5 && !ownedPrestigeUpgrades.includes("faster_production")
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-gray-500"
                    }
                    disabled={prestigePoints < 5 || ownedPrestigeUpgrades.includes("faster_production")}
                    onClick={() => buyPrestigeUpgrade("faster_production", 5)}
                  >
                    {ownedPrestigeUpgrades.includes("faster_production") ? "Purchased" : "Buy"}
                  </Button>
                </div>

                {/* Increased Profits */}
                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Coins className="h-4 w-4 mr-2 text-amber-300" />
                    Increased Profits
                  </h3>
                  <p className="text-sm text-amber-200 mb-3">Increase the profits of all businesses by 50%.</p>
                  <div className="flex justify-between items-center mb-2">
                    <span>Cost:</span>
                    <span className="font-bold">8 Prestige Points</span>
                  </div>
                  <Button
                    variant="default"
                    className={
                      prestigePoints >= 8 && !ownedPrestigeUpgrades.includes("increased_profits")
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-gray-500"
                    }
                    disabled={prestigePoints < 8 || ownedPrestigeUpgrades.includes("increased_profits")}
                    onClick={() => buyPrestigeUpgrade("increased_profits", 8)}
                  >
                    {ownedPrestigeUpgrades.includes("increased_profits") ? "Purchased" : "Buy"}
                  </Button>
                </div>

                {/* Starting Cash */}
                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Coins className="h-4 w-4 mr-2 text-amber-300" />
                    Starting Cash
                  </h3>
                  <p className="text-sm text-amber-200 mb-3">Start each prestige run with $1,000 cash.</p>
                  <div className="flex justify-between items-center mb-2">
                    <span>Cost:</span>
                    <span className="font-bold">10 Prestige Points</span>
                  </div>
                  <Button
                    variant="default"
                    className={
                      prestigePoints >= 10 && !ownedPrestigeUpgrades.includes("starting_cash")
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-gray-500"
                    }
                    disabled={prestigePoints < 10 || ownedPrestigeUpgrades.includes("starting_cash")}
                    onClick={() => buyPrestigeUpgrade("starting_cash", 10)}
                  >
                    {ownedPrestigeUpgrades.includes("starting_cash") ? "Purchased" : "Buy"}
                  </Button>
                </div>

                {/* Auto Managers */}
                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-amber-300" />
                    Auto Managers
                  </h3>
                  <p className="text-sm text-amber-200 mb-3">Automatically hire managers for the first 2 businesses.</p>
                  <div className="flex justify-between items-center mb-2">
                    <span>Cost:</span>
                    <span className="font-bold">15 Prestige Points</span>
                  </div>
                  <Button
                    variant="default"
                    className={
                      prestigePoints >= 15 && !ownedPrestigeUpgrades.includes("auto_managers")
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-gray-500"
                    }
                    disabled={prestigePoints < 15 || ownedPrestigeUpgrades.includes("auto_managers")}
                    onClick={() => buyPrestigeUpgrade("auto_managers", 15)}
                  >
                    {ownedPrestigeUpgrades.includes("auto_managers") ? "Purchased" : "Buy"}
                  </Button>
                </div>

                {/* Double Offline Earnings */}
                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-amber-300" />
                    Double Offline Earnings
                  </h3>
                  <p className="text-sm text-amber-200 mb-3">Double the amount of cash earned while offline.</p>
                  <div className="flex justify-between items-center mb-2">
                    <span>Cost:</span>
                    <span className="font-bold">20 Prestige Points</span>
                  </div>
                  <Button
                    variant="default"
                    className={
                      prestigePoints >= 20 && !ownedPrestigeUpgrades.includes("double_offline")
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-gray-500"
                    }
                    disabled={prestigePoints < 20 || ownedPrestigeUpgrades.includes("double_offline")}
                    onClick={() => buyPrestigeUpgrade("double_offline", 20)}
                  >
                    {ownedPrestigeUpgrades.includes("double_offline") ? "Purchased" : "Buy"}
                  </Button>
                </div>

                {/* Customer Loyalty */}
                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-amber-300" />
                    Customer Loyalty
                  </h3>
                  <p className="text-sm text-amber-200 mb-3">Increase customer tips by 75%.</p>
                  <div className="flex justify-between items-center mb-2">
                    <span>Cost:</span>
                    <span className="font-bold">25 Prestige Points</span>
                  </div>
                  <Button
                    variant="default"
                    className={
                      prestigePoints >= 25 && !ownedPrestigeUpgrades.includes("customer_loyalty")
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-gray-500"
                    }
                    disabled={prestigePoints < 25 || ownedPrestigeUpgrades.includes("customer_loyalty")}
                    onClick={() => buyPrestigeUpgrade("customer_loyalty", 25)}
                  >
                    {ownedPrestigeUpgrades.includes("customer_loyalty") ? "Purchased" : "Buy"}
                  </Button>
                </div>

                {/* Master Barista */}
                <div className="bg-amber-700/50 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Coffee className="h-4 w-4 mr-2 text-amber-300" />
                    Master Barista
                  </h3>
                  <p className="text-sm text-amber-200 mb-3">Triple mini-game rewards.</p>
                  <div className="flex justify-between items-center mb-2">
                    <span>Cost:</span>
                    <span className="font-bold">30 Prestige Points</span>
                  </div>
                  <Button
                    variant="default"
                    className={
                      prestigePoints >= 30 && !ownedPrestigeUpgrades.includes("master_barista")
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-gray-500"
                    }
                    disabled={prestigePoints < 30 || ownedPrestigeUpgrades.includes("master_barista")}
                    onClick={() => buyPrestigeUpgrade("master_barista", 30)}
                  >
                    {ownedPrestigeUpgrades.includes("master_barista") ? "Purchased" : "Buy"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-amber-700 flex justify-end">
              <Button onClick={() => setShowPrestigeUpgrades(false)} className="bg-amber-600 hover:bg-amber-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Random Event Modal */}
      {currentRandomEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-800 rounded-lg max-w-md w-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold">{currentRandomEvent.title}</h2>
              <Button variant="ghost" size="icon" onClick={handleDeclineEvent}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <p className="mb-4">{currentRandomEvent.description}</p>

              {currentRandomEvent.options ? (
                <div className="space-y-3">
                  {currentRandomEvent.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="default"
                      className="w-full bg-amber-500 hover:bg-amber-600"
                      onClick={() => handleAcceptEvent(index)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              ) : (
                <Button
                  variant="default"
                  className="w-full bg-amber-500 hover:bg-amber-600"
                  onClick={handleAcceptEvent}
                >
                  Accept
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bean Sorting Game Modal */}
      {showBeanSortingGame && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-800 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold">Bean Sorting Game</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowBeanSortingGame(false)
                  if (musicEnabled) {
                    soundManager.playMusic("main")
                  }
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto">
              <BeanSortingGame
                onComplete={handleBeanSortingComplete}
                onClose={() => {
                  setShowBeanSortingGame(false)
                  if (musicEnabled) {
                    soundManager.playMusic("main")
                  }
                }}
                difficultyLevel={Math.min(3, Math.ceil(prestigeLevel / 2))}
                baseReward={100}
              />
            </div>
          </div>
        </div>
      )}

      {/* Latte Art Game Modal */}
      {showLatteArtGame && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-800 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold">Latte Art Game</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowLatteArtGame(false)
                  if (musicEnabled) {
                    soundManager.playMusic("main")
                  }
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto">
              <LatteArtGame
                onComplete={handleLatteArtComplete}
                onClose={() => {
                  setShowLatteArtGame(false)
                  if (musicEnabled) {
                    soundManager.playMusic("main")
                  }
                }}
                difficultyLevel={Math.min(3, Math.ceil(prestigeLevel / 2))}
                baseReward={100}
              />
            </div>
          </div>
        </div>
      )}

      {/* Offline Progress Modal */}
      {showOfflineProgress && offlineProgressData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-800 rounded-lg max-w-md w-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold">Offline Progress</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowOfflineProgress(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <p className="mb-4">While you were away, your businesses continued to earn!</p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Time Away:</span>
                  <span className="font-bold">{Math.floor(offlineProgressData.timeAway / (60 * 1000))} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Earned:</span>
                  <span className="font-bold">{formatCurrency(offlineProgressData.totalEarned)}</span>
                </div>
              </div>

              <Button
                variant="default"
                className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
                onClick={collectOfflineEarnings}
              >
                Collect Earnings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Streak Calendar Modal */}
      {showStreakCalendar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-800 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-700">
              <h2 className="text-xl font-bold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-amber-300" />
                Streak Calendar
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowStreakCalendar(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DailyStreak
                  currentStreak={currentStreak}
                  lastClaimTimestamp={lastStreakClaim}
                  onClaimStreak={handleClaimStreak}
                  prestigeLevel={prestigeLevel}
                />

                <StreakCalendar streakHistory={streakHistory} currentStreak={currentStreak} />
              </div>
            </div>

            <div className="p-4 border-t border-amber-700 flex justify-end">
              <Button onClick={() => setShowStreakCalendar(false)} className="bg-amber-600 hover:bg-amber-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Streak Milestone Modal */}
      {showMilestone && (
        <StreakMilestone
          days={showMilestone.days}
          reward={showMilestone.reward}
          onClaim={() => {
            // Add any extra milestone rewards here if needed
            // For example, give prestige points or special items
          }}
          onClose={() => setShowMilestone(null)}
        />
      )}
    </main>
  )
}
