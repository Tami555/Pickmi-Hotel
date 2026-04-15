// src/app/pages/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { 
  getEmployeeProfile,
  logout,
  calculateTaskProgress,
  getTaskCardColor,
  formatTaskTitle,
  formatTaskTime,
  type EmployeeTask,
  type EmployeeProfileResponse 
} from '@/api/services';
import { getEmployeeTasks } from '../../api/services/ServicesService/employee_tasks';

// 🔹 Интерфейс для отображения карточки
interface TaskCard {
  id: number;
  title: string;
  progress: number;
  color: string;
  time: string;
  room: string;
  status: EmployeeTask['status'];
  originalTask: EmployeeTask; // Для передачи в следующий экран
}

export default function HomeScreen() {
  const [profile, setProfile] = useState<EmployeeProfileResponse | null>(null);
  const [tasks, setTasks] = useState<TaskCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Загрузка данных
   const fetchData = async () => {
    try {
      console.log('🔄 Начало загрузки данных...');
      
      // 1. Получаем профиль
      const profileData = await getEmployeeProfile();
      console.log('👤 Профиль загружен, ID сотрудника:', profileData?.user?.id);
      
      // 2. Получаем задачи
      const tasksData = await getEmployeeTasks();
      console.log('📦 Задачи получены:', tasksData?.length || 0, 'шт.');
      
      // 3. Форматируем
      const formattedTasks: TaskCard[] = tasksData.map(task => ({
        id: task.id,
        title: formatTaskTitle(task),
        progress: calculateTaskProgress(task),
        color: getTaskCardColor(task.status),
        time: formatTaskTime(task.scheduled_time),
        room: task.reservation?.room?.room_number || '—',
        status: task.status,
        originalTask: task,
      }));
      
      setTasks(formattedTasks);
      
    } catch (error: any) {
      console.error('💥 ПОЛНАЯ ОШИБКА Axios:', {
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        url: error?.config?.url,
        method: error?.config?.method,
        stack: error?.stack?.split('\n').slice(0, 5).join('\n'),
      });
      
      // Показываем пользователю только безопасное сообщение
      router.replace('/pages/ProfileScreen');
      Alert.alert(
        'Ошибка загрузки',
        error?.response?.data?.detail || error?.message || 'Проверьте подключение к серверу'
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // 🔹 Загрузка при монтировании
  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Выход из аккаунта
  const handleLogout = async () => {
    Alert.alert(
      'Выход из аккаунта',
      'Вы уверены?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/pages/LoginScreen');
          },
        },
      ]
    );
  };

  // 🔹 Переход к деталям задачи
  const handleTaskPress = (task: TaskCard) => {
    // Передаем данные задачи через параметры маршрута
    router.push({
      pathname: '/pages/CleaningTaskScreen',
      params: {
        taskId: task.originalTask.id.toString(),
        taskTitle: task.title,
        taskStatus: task.status,
      },
    });
  };

  // 🔹 Форматирование даты в шапке
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 🔹 Получение имени
  const getUserName = () => {
    if (profile?.user?.first_name) return profile.user.first_name;
    return 'Сотрудник';
  };

  // 🔹 Загрузка
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D35D8A" />
          <Text style={styles.loadingText}>Загрузка задач...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 🔹 Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.dateText}>{formatDate()}</Text>
          <Text style={styles.welcomeText}>С возвращением!</Text>
          <Text style={styles.userName}>{getUserName()}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/pages/ProfileScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Контент */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentPadding}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
        {/* Секция: Задачи от руководства */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Задачи от руководства</Text>
          
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✨</Text>
              <Text style={styles.emptyText}>Нет новых задач</Text>
              <Text style={styles.emptySubtext}>Отдыхайте или проверьте позже</Text>
            </View>
          ) : (
            <View style={styles.taskCardsList}>
              {tasks.map((task) => (
                <TouchableOpacity 
                  key={task.id} 
                  onPress={() => handleTaskPress(task)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.taskCard, { backgroundColor: task.color }]}>
                    
                    {/* Шапка карточки */}
                    <View style={styles.cardHeader}>
                      <View style={styles.checkbox} />
                      <View style={styles.cardTimeBadge}>
                        <Text style={styles.cardTimeText}>{task.time}</Text>
                      </View>
                    </View>
                    
                    {/* Заголовок задачи */}
                    <Text style={styles.cardTitle}>{task.title}</Text>
                    
                    {/* Информация о номере */}
                    <View style={styles.roomInfo}>
                      <Text style={styles.roomIcon}>🚪</Text>
                      <Text style={styles.roomText}>Номер {task.room}</Text>
                    </View>
                    
                    {/* Прогресс */}
                    <View style={styles.progressRow}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressPercent}>{task.progress}%</Text>
                    </View>
                    
                    <View style={styles.progressBar}>
                      <View 
                        style={[styles.progressFill, { width: `${task.progress}%` }]} 
                      />
                    </View>
                    
                    {/* Статус */}
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>
                        {task.status === 'completed' && '✓ Выполнено'}
                        {task.status === 'in_progress' && '⏳ В работе'}
                        {task.status === 'canceled' && '✕ Отменено'}
                        {task.status === 'pending' && '📋 Ожидает'}
                      </Text>
                    </View>
                    
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Секция: Статистика */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ваша статистика</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {tasks.filter(t => t.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Выполнено</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {tasks.filter(t => t.status === 'in_progress').length}
              </Text>
              <Text style={styles.statLabel}>В работе</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {tasks.length > 0 
                  ? Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length)
                  : 0}%
              </Text>
              <Text style={styles.statLabel}>Средний прогресс</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSpacer} />
        
      </ScrollView>
    </SafeAreaView>
  );
}

// 🔹 Стили (дополненные)
const styles = StyleSheet.create({
  // ... предыдущие стили из предыдущего ответа ...
  
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: { flex: 1, paddingRight: 12 },
  dateText: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  welcomeText: { fontSize: 15, color: '#6B7280', marginBottom: 2 },
  userName: { fontSize: 26, fontWeight: '700', color: '#111827' },
  headerRight: { flexDirection: 'row', gap: 10 },
  iconButton: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#D35D8A',
    justifyContent: 'center', alignItems: 'center',
  },
  iconText: { fontSize: 20 },
  
  // Content
  content: { flex: 1 },
  contentPadding: { paddingHorizontal: 20, paddingBottom: 40 },
  
  // Section
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 19, fontWeight: '600', color: '#111827',
    marginBottom: 16, marginTop: 4,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '500', color: '#111827', marginBottom: 4 },
  emptySubtext: { fontSize: 14, color: '#6B7280' },
  
  // Task Cards
  taskCardsList: { gap: 16 },
  taskCard: {
    borderRadius: 18, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  checkbox: {
    width: 26, height: 26, borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  cardTimeBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
  },
  cardTimeText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  cardTitle: {
    fontSize: 18, fontWeight: '600', color: '#FFFFFF',
    marginBottom: 12, lineHeight: 24,
  },
  roomInfo: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, alignSelf: 'flex-start', marginBottom: 16,
  },
  roomIcon: { fontSize: 14, marginRight: 4 },
  roomText: { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },
  
  // Progress
  progressRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  progressLabel: { fontSize: 13, color: '#FFFFFF', fontWeight: '500', opacity: 0.95 },
  progressPercent: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
  progressBar: {
    height: 9, backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 5, overflow: 'hidden', marginBottom: 12,
  },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 5 },
  
  // Status Badge
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, alignSelf: 'flex-start',
  },
  statusText: { fontSize: 12, color: '#FFFFFF', fontWeight: '500' },
  
  // Stats
  statsGrid: { flexDirection: 'row', gap: 14 },
  statCard: {
    flex: 1, backgroundColor: '#F9FAFB', borderRadius: 14,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#D35D8A', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  
  // Footer
  footerSpacer: { height: 20 },
});