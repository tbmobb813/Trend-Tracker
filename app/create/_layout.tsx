import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function CreateLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: true,
          title: 'Content Tools',
          headerTintColor: Colors.text,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="tiktok-hooks" 
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
        name="viral-sounds" 
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
        name="caption-templates" 
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
        name="hashtag-suggestions" 
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
        name="post-troubleshooting" 
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
        name="thumbnail-ideas" 
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
        name="video-ideas" 
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
        name="thread-generator" 
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
        name="product-ideas" 
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
        name="digital-products" 
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
        name="ai-generator" 
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
        name="team" 
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
