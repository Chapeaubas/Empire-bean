import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Load pixel font
const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
})

export const metadata: Metadata = {
  title: "$GRIND: Bean Hustle",
  description:
    "Help $GRIND build the ultimate underground coffee empire in this pixel art coffee shop management game!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${pixelFont.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'