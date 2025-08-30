/**
 * Consistent icon sizing system for the Bekhair app
 * Use these standardized sizes instead of arbitrary values
 */

export const iconSizes = {
  // Standard sizes
  xs: 12,  // Extra small icons (inline with caption text)
  sm: 16,  // Small icons (inline with body text, form fields)  
  md: 20,  // Medium icons (headers, buttons)
  lg: 24,  // Large icons (prominent actions)
  xl: 32,  // Extra large icons (section headers)
  xxl: 48, // Very large icons (empty states, features)
  
  // Special purpose sizes
  nav: 20,     // Navigation icons (consistent with header)
  button: 16,  // Button icons 
  card: 24,    // Card icons
  avatar: 32,  // User avatars
  
  // Tailwind classes for easier usage
  classes: {
    xs: "w-3 h-3",   // 12px
    sm: "w-4 h-4",   // 16px  
    md: "w-5 h-5",   // 20px
    lg: "w-6 h-6",   // 24px
    xl: "w-8 h-8",   // 32px
    xxl: "w-12 h-12", // 48px
    
    nav: "w-5 h-5",     // 20px
    button: "w-4 h-4",  // 16px
    card: "w-6 h-6",    // 24px
    avatar: "w-8 h-8",  // 32px
  }
} as const;

/**
 * Common icon color classes
 */
export const iconColors = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted-foreground",
  destructive: "text-destructive",
  foreground: "text-foreground",
  
  // State colors
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-orange-500",
  error: "text-red-500",
  
  // Special contexts
  onPrimary: "text-primary-foreground",
  onCard: "text-card-foreground",
} as const;

/**
 * Helper function to get consistent icon props
 */
export function getIconProps(size: keyof typeof iconSizes, color?: keyof typeof iconColors) {
  return {
    size: iconSizes[size],
    className: color ? iconColors[color] : undefined
  };
}