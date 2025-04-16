"use client"

import { useState, useEffect } from "react"

interface HamsterCharacterProps {
  animation: "idle" | "working" | "happy" | "sad"
}

export default function HamsterCharacter({ animation }: HamsterCharacterProps) {
  const [frame, setFrame] = useState(0)

  // Simple animation system
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4)
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const getHamsterImage = () => {
    // In a real implementation, we would have different sprite frames
    // For now, we'll use placeholder images with different colors to simulate animation

    const size = animation === "idle" ? 200 : 150
    const colors = ["amber", "orange", "yellow", "amber"]
    const color = colors[frame]

    return (
      <div className={`relative ${animation === "working" ? "animate-bounce" : ""}`}>
        <div className={`w-${size} h-${size} bg-${color}-200 rounded-full relative overflow-hidden`}>
          {/* Hamster body */}
          <div className={`w-full h-full bg-${color}-300 rounded-full flex items-center justify-center`}>
            {/* Hamster face */}
            <div className="relative w-3/4 h-3/4">
              {/* Eyes */}
              <div className="absolute top-1/4 left-1/4 w-1/6 h-1/6 bg-black rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-1/6 h-1/6 bg-black rounded-full"></div>

              {/* Nose */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-1/8 h-1/8 bg-pink-500 rounded-full"></div>

              {/* Mouth */}
              {animation === "happy" && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-1/3 h-1/6 border-b-2 border-black rounded-b-full"></div>
              )}

              {animation === "sad" && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-1/3 h-1/6 border-t-2 border-black rounded-t-full"></div>
              )}

              {(animation === "idle" || animation === "working") && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-1/4 h-1/12 bg-black rounded-full"></div>
              )}
            </div>
          </div>

          {/* Ears */}
          <div className={`absolute top-0 left-1/4 w-1/6 h-1/4 bg-${color}-400 rounded-t-full`}></div>
          <div className={`absolute top-0 right-1/4 w-1/6 h-1/4 bg-${color}-400 rounded-t-full`}></div>
        </div>

        {/* Coffee cup for working animation */}
        {animation === "working" && (
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-white rounded-md border-2 border-amber-800">
            <div className="absolute top-1/4 left-0 right-0 h-1/2 bg-amber-600 rounded-b-sm"></div>
          </div>
        )}
      </div>
    )
  }

  return <div className="flex justify-center items-center p-4">{getHamsterImage()}</div>
}
