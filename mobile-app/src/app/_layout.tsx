import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 🔹 Загрузка шрифтов
  const [fontsLoaded] = useFonts({
    // Ключ слева — это имя, которое мы будем писать в styles (fontFamily)
    // Значение справа — путь к файлу
  });

  // 🔹 Логика скрытия сплеш-экрана
  useEffect(() => {
    async function hideSplash() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [fontsLoaded]);

  // 🔹 Показываем загрузку, пока шрифты грузятся
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#D35D8A" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Ваши экраны */}
      </Stack>
    </SafeAreaProvider>
  );
}