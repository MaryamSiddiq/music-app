// src/theme/colors.ts

export const colors = {
  // Primary Brand Color
  primary: '#24CEF0',        // Your main cyan/blue
  primaryDark: '#1BA5C9',    // Darker shade for press states
  primaryLight: '#5DD9F3',   // Lighter shade for highlights
  
  // Secondary/Gray
  secondary: '#8E8E8E',      // Your gray color
  
  // Background Colors (Dark Theme)
  background: {
    primary: '#151521',      // Darkest - main background
    secondary: '#1A1F2E',    // Medium dark - cards
    tertiary: '#252A39',     // Lighter - elevated cards
  },
  // Common surface aliases (used across screens)
  surface: '#08979C',
  surfaceLight: '#252A39',
  // Text Colors
  text: {
    primary: '#FFFFFF',      // White - main text
    secondary: '#8E8E8E',    // Gray - secondary text
    tertiary: '#6B6B6B',     // Darker gray - disabled text
    inverse: '#0A0E1A',      // Dark text on light backgrounds
  },
  
  // Status Colors
  success: '#4CAF50',        // Green for success states
  warning: '#FF9800',        // Orange for warnings
  error: '#F44336',          // Red for errors
  info: '#24CEF0',           // Using primary for info
  
  // UI Elements
  border: '#2A2F3E',         // Border color
  divider: '#1A1F2E',        // Divider lines
  shadow: '#000000',         // Shadow color
  
  // Overlays & Transparencies
  overlay: 'rgba(0, 0, 0, 0.6)',
  backdrop: 'rgba(0, 0, 0, 0.8)',
  shimmer: 'rgba(255, 255, 255, 0.1)',
  
  // Player Specific (if needed)
  player: {
    progressBackground: '#2A2F3E',
    progressFill: '#24CEF0',
  },
  
  // Special Effects
  gradient: {
    start: '#24CEF0',
    end: '#1BA5C9',
  },
} as const;

export type Colors = typeof colors;
