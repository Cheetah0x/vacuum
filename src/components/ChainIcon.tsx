import type React from "react"
import { getChainIconData } from "../utils/helpers"

interface ChainIconProps {
  chainName: string
  size?: number
  className?: string
}

export const ChainIcon: React.FC<ChainIconProps> = ({ 
  chainName, 
  size = 32, 
  className 
}) => {
  const iconData = getChainIconData(chainName)
  
  // Debug: log what we're receiving
  console.log('ChainIcon received:', chainName, 'normalized to:', iconData)
  
  if (iconData.hasIcon) {
    return (
      <img
        src={iconData.src}
        alt={iconData.alt}
        width={size}
        height={size}
        className={className || `w-8 h-8`}
      />
    )
  }
  
  // Fallback for unknown chains
  return <span className="text-2xl">⚡</span>
} 