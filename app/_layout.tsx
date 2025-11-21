import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useTrendStore } from '@/store/trendStore';
import { useAnalyticsStore } from '@/store/analyticsStore';

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Initialize data once fonts are loaded
  useEffect(() => {
    if (loaded) {
      // Use the store actions to fetch initial data; using getState() avoids
      // subscribing this layout to store changes.
      try {
        const trendActions = useTrendStore.getState();
        const analyticsActions = useAnalyticsStore.getState();

        // Fire-and-forget; stores handle loading state.
        trendActions.fetchTrends();
        analyticsActions.fetchAnalytics();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Initial data fetch failed', err);
      }
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="trend/[id]" 
        options={{ 
          headerShown: true,
          headerBackTitle: "Back",
          headerTintColor: Colors.text,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="create/compose-post" 
        options={{ 
          headerShown: true,
          headerBackTitle: "Back",
          headerTintColor: Colors.text,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="create/post-success" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="create/schedule-post" 
        options={{ 
          headerShown: true,
          headerBackTitle: "Back",
          headerTintColor: Colors.text,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="create/ai-generator" 
        options={{ 
          headerShown: true,
          headerBackTitle: "Back",
          headerTintColor: Colors.text,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="create/team" 
        options={{ 
          headerShown: true,
          headerBackTitle: "Back",
          headerTintColor: Colors.text,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
        }} 
      />
    </Stack>
  );
}
