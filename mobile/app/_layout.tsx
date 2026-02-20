import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "../hooks/useAuthStore";
import { useAppStore } from "../hooks/useAppStore";
import '../i18n';

export default function Layout() {
  const { isAuthenticated, init: initAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initAuth();
      await useAppStore.getState().init();
      setIsReady(true);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (!isReady) return;


    const publicScreens = ["index", "AuthScreen", "SignInScreen", "SignUpScreen"];
    const currentRoute = segments[segments.length - 1];
    const isPublic = publicScreens.includes(currentRoute as string);

    if (!isAuthenticated && !isPublic) {
      // Redirect to sign-in if not authenticated and not on public screen
      // router.replace("/AuthScreen" as any);
      // Wait, let's just let the index handle it or redirect explicitly
    } else if (isAuthenticated && isPublic) {
      // Redirect to home if authenticated and on public screen
      router.replace("/HomeScreen" as any);
    }
  }, [isAuthenticated, segments, isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#00B4DB" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="AuthScreen" />
      <Stack.Screen name="SignInScreen" />
      <Stack.Screen name="HomeScreen" />
      <Stack.Screen name="CheckSymptomsScreen" />
      <Stack.Screen name="MyRecordsScreen" />
      <Stack.Screen name="MyHealthScreen" />
      <Stack.Screen name="MedicinesScreen" />
      <Stack.Screen name="NutritionScreen" />
      <Stack.Screen name="MentalHealthScreen" />
      <Stack.Screen name="GovtSchemesScreen" />
      <Stack.Screen name="CommunityScreen" />
      <Stack.Screen name="EmergencyScreen" />
      <Stack.Screen name="NearbyDoctorsScreen" />
      <Stack.Screen name="FeedbackScreen" />
      <Stack.Screen name="SettingsScreen" />
      <Stack.Screen name="ProfileScreen" />
    </Stack>
  );
}
