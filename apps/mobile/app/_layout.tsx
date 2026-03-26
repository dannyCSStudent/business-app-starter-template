import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Quick Actions' }}
        />
        <Stack.Screen
          name="actions/client"
          options={{ presentation: 'modal', title: 'Create Client' }}
        />
        <Stack.Screen
          name="actions/activity"
          options={{ presentation: 'modal', title: 'Log Activity' }}
        />
        <Stack.Screen
          name="actions/tags"
          options={{ presentation: 'modal', title: 'Manage Tags' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
