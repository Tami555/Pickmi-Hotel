// src/app/pages/EmployeeProfileScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { getEmployeeProfile, type EmployeeProfileResponse } from '@/api/services';
import { clearTokens } from '@/api/utils/auth/storage';

export default function EmployeeProfileScreen() {
  const [profile, setProfile] = useState<EmployeeProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Загрузка профиля
  const fetchProfile = async () => {
    try {
      const data = await getEmployeeProfile();
      setProfile(data);
    } catch (error: any) {
      console.error('❌ Ошибка загрузки профиля:', error?.message);
      Alert.alert('Ошибка', error?.message);
      router.replace('/pages/LoginScreen');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Форматирование даты
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 🔹 Форматирование выходных
  const formatWeekends = (days: number[]) => {
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days.map(d => dayNames[d]).join(', ');
  };

  // 🔹 Статус сотрудника
  const getStatusBadge = (status: EmployeeProfileResponse['status']) => {
    const config = {
      active: { text: '✓ Активен', color: '#22C55E' },
      inactive: { text: '○ Не активен', color: '#6B7280' },
      fired: { text: '✕ Уволен', color: '#EF4444' },
    };
    return config[status] || config.inactive;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D35D8A" />
          <Text style={styles.loadingText}>Загрузка профиля...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Не удалось загрузить данные</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
            <Text style={styles.retryText}>Попробовать снова</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = getStatusBadge(profile.status);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мой профиль</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.headerDivider} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Avatar & Name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.user.last_name?.[0]}{profile.user.first_name?.[0]}
            </Text>
          </View>
          <Text style={styles.userName}>
            {profile.user.last_name} {profile.user.first_name} {profile.user.patronymic}
          </Text>
          <Text style={styles.position}>{profile.position.title}</Text>
          
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
        </View>

        {/* Personal Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Личные данные</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile.user.email}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Телефон</Text>
            <Text style={styles.infoValue}>{profile.user.phone || '—'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Паспорт</Text>
            <Text style={styles.infoValue}>
              {profile.user.passport_series} {profile.user.passport_number || '—'}
            </Text>
          </View>
        </View>

        {/* Employment Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Работа</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Дата приёма</Text>
            <Text style={styles.infoValue}>{formatDate(profile.hire_date)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Оклад</Text>
            <Text style={styles.infoValue}>{profile.salary.toLocaleString('ru-RU')} ₽</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Аванс</Text>
            <Text style={styles.infoValue}>{profile.advance.toLocaleString('ru-RU')} ₽</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Выходные</Text>
            <Text style={styles.infoValue}>{formatWeekends(profile.weekends)}</Text>
          </View>
          
          {profile.bank_account && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Банковский счёт</Text>
              <Text style={styles.infoValue}>{profile.bank_account}</Text>
            </View>
          )}
          
          {profile.fired_date && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Дата увольнения</Text>
              <Text style={styles.infoValue}>{formatDate(profile.fired_date)}</Text>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              'Выход из аккаунта',
              'Вы уверены?',
              [
                { text: 'Отмена', style: 'cancel' },
                {
                  text: 'Выйти',
                  style: 'destructive',
                  onPress: async () => {
                    // Импортируйте вашу функцию logout
                    // await logout();
                    await clearTokens();
                    router.replace('/pages/LoginScreen');
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.logoutText}>Выйти из аккаунта</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Pickmi Hotel v1.2.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  scrollView: { flex: 1 },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#D35D8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { color: '#FFF', fontSize: 24 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#D35D8A' },
  headerDivider: { height: 1, backgroundColor: '#E5E7EB', width: '100%' },
  
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D35D8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: '600', color: '#FFFFFF' },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  position: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { fontSize: 14, fontWeight: '500' },
  
  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  infoLabel: {
    fontSize: 15,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    textAlign: 'right',
    flex: 2,
  },
  
  // Buttons
  saveButton: {
    backgroundColor: '#D35D8A',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '500' },
  
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: { fontSize: 13, color: '#9CA3AF' },
  
  // Loading / Error
  loadingText: { marginTop: 16, color: '#6B7280' },
  errorText: { color: '#EF4444', marginBottom: 16, textAlign: 'center' },
  retryButton: {
    backgroundColor: '#D35D8A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '500' },
});