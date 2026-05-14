/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background & Cards
        'off-white': '#F8FAFC',
        'card-bg': '#FFFFFF',
        
        // Primary Brand Colors
        'primary': '#6366F1',
        'primary-light': '#E0E7FF',
        'primary-dark': '#4F46E5',
        
        'secondary': '#06B6D4',
        'secondary-light': '#CFFAFE',
        'secondary-dark': '#0891B2',
        
        'accent': '#8B5CF6',
        'accent-light': '#EDE9FE',
        'accent-dark': '#7C3AED',
        
        // Text Colors
        'text-primary': '#0F172A',
        'text-secondary': '#64748B',
        'text-muted': '#94A3B8',
        
        // Semantic Colors
        'border': '#E2E8F0',
        'success': '#10B981',
        'success-light': '#D1FAE5',
        'warning': '#F59E0B',
        'warning-light': '#FEF3C7',
        'danger': '#EF4444',
        'danger-light': '#FEE2E2',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
    },
  },
  plugins: [],
};
