import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import SplashScreen from '../../mobile/app/index';

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/bottomtabs');
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, [router]);
  return <SplashScreen />;
}
