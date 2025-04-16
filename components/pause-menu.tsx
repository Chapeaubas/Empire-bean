"use client"

import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PauseMenuProps {
  onResume: () => void
  onToggleSound: () => void
  soundEnabled: boolean
}

export default function PauseMenu({ onResume, onToggleSound, soundEnabled }: PauseMenuProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="bg-amber-100 border-4 border-amber-800 rounded-lg p-8 w-full max-w-md shadow-2xl pixel-art-container">
        <h2 className="text-2xl font-bold text-amber-800 mb-6 text-center pixel-text">Game Paused</h2>

        <div className="space-y-4">
          <Button onClick={onResume} className="w-full bg-green-600 hover:bg-green-700 text-white pixel-text py-3">
            Resume Game
          </Button>

          <Button
            onClick={onToggleSound}
            variant="outline"
            className="w-full border-amber-600 text-amber-700 hover:bg-amber-50 pixel-text py-3"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Sound: On
              </>
            ) : (
              <>
                <VolumeX className="mr-2 h-4 w-4" />
                Sound: Off
              </>
            )}
          </Button>

          <div className="mt-6 text-center text-amber-700 text-sm pixel-text">
            <p>Press Resume to continue playing</p>
          </div>
        </div>
      </div>
    </div>
  )
}
