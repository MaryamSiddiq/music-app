export const theme = {
  colors: {
    primary: '#00D9FF', // Cyan/Turquoise (buttons, accents)
    secondary: '#8B5CF6', // Purple (cards, highlights)
    background: '#1A1A1A', // Dark background
    surface: '#2A2A2A', // Card/surface background
    surfaceLight: '#3A3A3A', // Lighter surface
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textMuted: '#666666',
    border: '#404040',
    error: '#FF5555',
    success: '#00D9FF',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 4,
    },
  },
};