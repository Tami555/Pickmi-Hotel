// src/app/pages/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

// 🔹 ИМПОРТЫ АВТОРИЗАЦИИ И ХРАНЕНИЯ:
import { login } from '@/api/services/UserService/auth';
import { clearTokens } from '../../api/utils/auth/storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // 🔹 Валидация данных
  const validateInput = () => {
    if (!email.trim()) {
      Alert.alert('Ошибка', 'Введите email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return false;
    }
    
    if (!password) {
      Alert.alert('Ошибка', 'Введите пароль');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
      return false;
    }
    
    return true;
  };

  // 🔹 Обработчик входа
  const handleLogin = async () => {
    // 1. Валидация
    if (!validateInput()) {
      return;
    }
    try {
      console.log('Попытка входа:', { email });
      await login(email, password);
      router.replace('/pages/HomeScreen');      
    } catch (error: any) {
      console.error('Ошибка входа:', {
        message: error?.message
      });  
      Alert.alert('Ошибка входа', error?.message);
    }
  };

  // 🔹 Обработчик нажатия "Забыли пароль?"
  const handleForgotPassword = () => {
    Alert.alert(
      'Восстановление пароля',
      'Обратитесь к администратору для сброса пароля',
      [{ text: 'Понятно' }]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#D87093" />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 🔹 Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                        source={require('./../../../src/assets/logo.png')}
                      />
              <Text style={styles.logoText}>Pickmi Hotel</Text>
            </View>
            <Text style={styles.headerTitle}>Добро пожаловать</Text>
            <Text style={styles.headerSubtitle}>Войдите в свой аккаунт сотрудника</Text>
          </View>

          {/* 🔹 Форма входа */}
          <View style={styles.form}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Почта</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="employee@hotel.ru"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Пароль</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={secureText}
                  autoComplete="password"
                  editable={!loading}
                />
                <TouchableOpacity
  onPress={() => !loading && setSecureText(!secureText)}
  style={styles.eyeIconn}
  disabled={loading}
>
  <Image
    source={secureText 
      ? require('../../assets/eye_17113703.png') // 👁️🗨️ Скрыто
      : require('../../assets/eye_13645203.png') // 👁️ Видно
    }
    style={styles.eyeIconImage}
    resizeMode="contain"
  />
</TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotButton}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotText}>Забыли пароль?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Войти</Text>
              )}
            </TouchableOpacity>

            {/* Info Text */}
            <Text style={styles.infoText}>
              Используйте корпоративную почту, выданную руководством
            </Text>
          </View>

          {/* 🔹 Footer */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>Pickmi Hotel v1.2.0</Text>
            <Text style={styles.copyrightText}>© 2026 Pickmi. Все права защищены.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// 🔹 Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D87093',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },eyeIcon: {
  padding: 12, // Отступы вокруг кликабельной зоны
},
eyeIconImage: {
  width: 24,
  height: 24,
  tintColor: '#9CA3AF', // Цвет иконки (меняется через стили)
},
  logoIcon: {
    fontSize: 32,  
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,  
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,  
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,  
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  
  // Form
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,  
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  eyeIconn: {
    padding: 16,
    paddingHorizontal: 20,
  },
  eyeText: {
    fontSize: 18,  
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,  
    color: '#D87093',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#D87093',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,  
    fontWeight: '600',
  },
  infoText: {
    fontSize: 13,  
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 13,  
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,  
    color: 'rgba(255, 255, 255, 0.6)',
  },
});