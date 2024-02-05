import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        dark: {
          '50': '#f6f7f9',
          '100': '#eceef2',
          '200': '#d5dae2',
          '300': '#b0bac9',
          '400': '#8494ac',
          '500': '#657792',
          '600': '#505f79',
          '700': '#424d62',
          '800': '#394253',
          '900': '#2e3440',
          '950': '#22262f',
        },
        nord: {
          "p-1": "#2E3440",
          "p-2": "#3B4252",
          "p-3": "#434C5E",
          "p-4": "#4C566A",

          "s-1": "#D8DEE9",
          "s-2": "#E5E9F0",
          "s-3": "#ECEFF4",

          "f-1": "#8FBCBB",
          "f-2": "#88C0D0",
          "f-3": "#81A1C1",
          "f-4": "#5E81AC",

          "a-1": "#BF616A",
          "a-2": "#D08770",
          "a-3": "#EBCB8B",
          "a-4": "#A3BE8C",
          "a-5": "#B48EAD",
        },
        custom: {
          'grad1': '#d3bf91',
          'grad2': '#0d2f48',
          'bg1': '#0f172a',
          'bg2': '#274481',
        }
      }
    }
  }
}
