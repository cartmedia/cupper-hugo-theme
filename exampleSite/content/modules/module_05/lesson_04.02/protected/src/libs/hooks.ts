import { useColorScheme } from "react-native"

export function useDynamic() {
  let theme = useColorScheme()

  return (darkThemeValue: string, lightThemeValue: string) => theme === 'dark' ? darkThemeValue : lightThemeValue
}
