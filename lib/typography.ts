/**
 * Consistent typography classes for the Bekhair app
 * These should be used instead of arbitrary text classes
 */

export const typography = {
  // Page headings
  h1: "text-3xl font-bold tracking-tight", // 30px
  h2: "text-2xl font-bold tracking-tight", // 24px  
  h3: "text-xl font-semibold", // 20px
  h4: "text-lg font-semibold", // 18px
  h5: "text-base font-medium", // 16px
  h6: "text-sm font-medium", // 14px

  // Body text
  body: "text-base", // 16px
  bodyLarge: "text-lg", // 18px
  bodySmall: "text-sm", // 14px
  
  // Captions and labels
  caption: "text-xs text-muted-foreground", // 12px
  label: "text-sm font-medium", // 14px
  
  // Special text
  lead: "text-xl text-muted-foreground", // 20px
  muted: "text-sm text-muted-foreground", // 14px
  large: "text-lg font-semibold", // 18px
  
  // Arabic text specific
  arabic: {
    large: "text-2xl leading-relaxed", // For Arabic verses
    medium: "text-lg leading-relaxed", // For Arabic text
    small: "text-base leading-relaxed" // For small Arabic text
  },
  
  // Line heights for consistency
  leading: {
    tight: "leading-tight", // 1.25
    normal: "leading-normal", // 1.5
    relaxed: "leading-relaxed", // 1.625
    loose: "leading-loose" // 2
  }
} as const;

/**
 * Helper function to combine typography classes with additional classes
 */
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}