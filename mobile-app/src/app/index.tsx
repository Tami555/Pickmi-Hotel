// src/app/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import LottieView from 'lottie-react-native';
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'react-native';


interface Props {
  text?: string;
}

export default function Index({ text = 'Загрузка...' }: Props) {
  useKeepAwake();
  const router = useRouter();
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // 🔹 Плавное появление
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    // 🔹 Пульсация логотипа
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 🔹 Переход на логин через 2 секунды
    const timer = setTimeout(() => {
      router.replace('/pages/LoginScreen');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, fadeAnim, pulseAnim]);

  return (
    <ImageBackground
      // // 🔹 ФОН: укажите путь к вашей картинке
      source={require('../assets/miau.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* 🔹 Затемнение */}
      <View style={styles.overlay} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
      

        {/* 🔹 Lottie анимация (Амогус) */}
        <Image
          source={require('../assets/amogus.gif')}
          style={styles.lottie}
        />

      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
  },
  content: {
  },
  logo: {
    width: 200,
    height: 200,
  },
  lottie: {
    marginTop: 450,
    width: 200,
    height: 370,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});