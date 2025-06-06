import type React from "react"

interface TokenIconProps {
  symbol: string
  size?: number
  className?: string
}

export const TokenIcon: React.FC<TokenIconProps> = ({ 
  symbol, 
  size = 20, 
  className 
}) => {
  const tokenIcons: Record<string, string> = {
    "USDC": "/tokens/usdc.svg",
    "usdc": "/tokens/usdc.svg",
  }

  const iconPath = tokenIcons[symbol] || tokenIcons[symbol.toUpperCase()]
  
  if (iconPath) {
    return (
      <img
        src={iconPath}
        alt={symbol}
        width={size}
        height={size}
        className={className || `w-5 h-5`}
      />
    )
  }
  
  // Fallback for unknown tokens
  return <span className="text-lg">💰</span>
} 