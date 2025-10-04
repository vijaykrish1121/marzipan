import { mergeTheme, solar } from '@pinkpixel/marzipan-core';
import type { ThemeRecipe } from './ThemeLab';

export function buildThemeRecipes(): ThemeRecipe[] {
  const forest = mergeTheme(solar, {
    colors: {
      bgSecondary: '#0d1f1b',
      text: '#e7ffe3',
      link: '#68f5b4',
      strong: '#a0ffcf',
      toolbarBg: '#102822'
    }
  });

  const ocean = mergeTheme(solar, {
    colors: {
      bgSecondary: '#071522',
      text: '#c6e5ff',
      link: '#4fb9ff',
      strong: '#6ce3ff',
      toolbarBg: '#0c2235'
    }
  });

  return [
    {
      id: 'solar',
      label: 'Solar Shortbread',
      tagline: 'Golden-hour glow',
      description: 'Warm, bright, editorial vibe.',
      theme: 'solar',
      palette: ['#faf0ca', '#f95738', '#0d3b66', '#ee964b'],
      accent: '#ff8c69'
    },
    {
      id: 'cave',
      label: 'Midnight Ganache',
      tagline: 'Moody midnight vibes',
      description: 'Rich contrast for focus mode.',
      theme: 'cave',
      palette: ['#141e26', '#1d2d3e', '#f6ae2d', '#9fcfec'],
      accent: '#f6ae2d'
    },
    {
      id: 'forest',
      label: 'Forest Matcha',
      tagline: 'Herbal and calm',
      description: 'Custom merge with mint greens.',
      theme: forest,
      palette: ['#0d1f1b', '#123126', '#68f5b4', '#a0ffcf'],
      accent: '#68f5b4'
    },
    {
      id: 'ocean',
      label: 'Ocean Meringue',
      tagline: 'Crystalline seafoam',
      description: 'Custom merge with glacier blues.',
      theme: ocean,
      palette: ['#071522', '#0c2235', '#4fb9ff', '#6ce3ff'],
      accent: '#4fb9ff'
    }
  ];
}
