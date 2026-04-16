// src/app/pages/CleaningTaskScreen.tsx

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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  getEmployeeTasks, 
  startTask, 
  completeTask,
  getEmployeeProfile,
  type EmployeeTask,
  type TaskStatusResponse 
} from '@/api/services';

// 🔹 Интерфейс для подзадачи (чекбокса)
interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export default function CleaningTaskScreen() {
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
const [isTimerRunning, setIsTimerRunning] = useState(false);

// 🔹 Логика таймера (авто-очистка при размонтировании)
useEffect(() => {
  let interval: ReturnType<typeof setInterval> | null = null;
  
  if (isTimerRunning) {
    interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  }
  
  return () => {
    if (interval) clearInterval(interval);
  };
}, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
  
  
  
  const params = useLocalSearchParams();
  
  // Получаем параметры из навигации
  const taskId = params.taskId as string;
  const taskTitle = params.taskTitle as string;
  
  // Состояния
  const [task, setTask] = useState<EmployeeTask | null>(null);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [taskStarted, setTaskStarted] = useState(false);

  // 🔹 Загрузка данных задачи
  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
            
      // 2. Получаем все задачи сотрудника
      const allTasks = await getEmployeeTasks();
      
      // 3. Находим нужную задачу по ID
      const foundTask = allTasks.find(t => t.id.toString() === taskId);
      
      if (!foundTask) {
        throw new Error('Задача не найдена');
      }
      
      setTask(foundTask);
      setTaskStarted(foundTask.status === 'in_progress' || foundTask.status === 'completed');
      
      // 4. Формируем список подзадач из данных задачи
      const generatedSubTasks: SubTask[] = [
        {
          id: '1',
          text: `Уборка номера ${foundTask.reservation?.room?.room_number || '—'}`,
          completed: foundTask.status === 'completed',
        },
        {
          id: '2',
          text: foundTask.service?.title || 'Выполнить услугу',
          completed: foundTask.status === 'completed',
        },
        {
          id: '3',
          text: 'Проверить чек-лист',
          completed: false,
        },
        {
          id: '4',
          text: 'Сообщить о завершении',
          completed: foundTask.status === 'completed',
        },
      ];
      
      // Добавляем комментарий как отдельную подзадачу если есть
      if (foundTask.comment) {
        generatedSubTasks.unshift({
          id: '0',
          text: `${foundTask.comment}`,
          completed: true,
        });
      }
      
      setSubTasks(generatedSubTasks);
      
    } catch (error: any) {
      console.error('❌ Ошибка загрузки задачи:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные задачи');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Переключение подзадачи
  const toggleSubTask = async (id: string) => {
    // Авто-старт задачи при первом действии
    if (!taskStarted && task?.status === 'pending') {
      await handleStartTask();
    }
    
    setSubTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // 🔹 Начало выполнения задачи
  const handleStartTask = async () => {
    if (!task || taskStarted) return;
    
    setUpdatingStatus(true);
    try {
      const updated = await startTask(task.id);
      
      setTask(prev => prev ? { ...prev, status: updated.status, started_at: updated.started_at ?? null } : null);
      setTaskStarted(true);
      setIsTimerRunning(true);
      setElapsedSeconds(0); // Сброс при новом старте
      
    } catch (error: any) {
      console.error('❌ Ошибка начала задачи:', error?.message);
      Alert.alert('Ошибка', 'Не удалось начать задачу');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // 🔹 Завершение задачи
  const handleCompleteTask = async () => {
    if (!task) return;
    
    Alert.alert(
      'Завершить задачу?',
      'Вы уверены, что все подзадачи выполнены?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Да, завершить',
          style: 'default',
          onPress: async () => {
            setUpdatingStatus(true);
            try {
              const updated = await completeTask(task.id);
              
              setTask(prev => prev ? { ...prev, status: updated.status, completed_at: updated.completed_at ?? null } : null);
              setIsTimerRunning(false); // Остановка таймера
              
              Alert.alert('✓ Готово!', 'Задача успешно завершена', [
                { text: 'OK', onPress: () => router.replace('/pages/HomeScreen') }
              ]);
              
            } catch (error: any) {
              console.error('❌ Ошибка завершения:', error);
              Alert.alert('Ошибка', 'Не удалось завершить задачу');
            } finally {
              setUpdatingStatus(false);
            }
          },
        },
      ]
    );
  };

  // 🔹 Загрузка при монтировании
  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  // 🔹 Форматирование даты и времени
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 🔹 Расчет прогресса
  const calculateProgress = () => {
    if (task?.status === 'completed') return 100;
    
    if (taskStarted || task?.status === 'in_progress') {
      const completed = subTasks.filter(t => t.completed).length;
      const baseProgress = 10;
      const subProgress = subTasks.length > 0 
        ? Math.round((completed / subTasks.length) * 90) 
        : 0;
      return baseProgress + subProgress;
    }
    
    if (subTasks.length === 0) return 0;
    const completed = subTasks.filter(t => t.completed).length;
    return Math.round((completed / subTasks.length) * 100);
  };

  // 🔹 Загрузка
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D35D8A" />
          <Text style={styles.loadingText}>Загрузка задачи...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 🔹 Если задача не найдена
  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Задача не найдена</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Вернуться назад</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progress = calculateProgress();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 🔹 Header */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {taskTitle || task.service?.title || 'Задача'}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* 🔹 Scheduled Time */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Запланировано на</Text>
          <Text style={styles.dateText}>
            {formatDateTime(task.scheduled_time)}
          </Text>
        </View>

        {/* 🔹 Info Boxes */}
        <View style={styles.timerContainer}>
          <View style={styles.timerBox}>
            <Text style={styles.timerValue}>
              {task.reservation?.room?.floor || '—'}
            </Text>
            <Text style={styles.timerLabel}>Этаж</Text>
          </View>
          
          <View style={styles.timerBox}>
            <Text style={styles.timerValue}>
              №{task.reservation?.room?.room_number || '—'}
            </Text>
            <Text style={styles.timerLabel}>Номер</Text>
          </View>
          
          <View style={styles.timerBox}>
            <Text style={styles.timerValue}>
              {task.service?.price?.toLocaleString('ru-RU') || '—'} ₽
            </Text>
            <Text style={styles.timerLabel}>Цена</Text>
          </View>
        </View>

        {/* 🔹 Comment Section */}
        {task.comment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Комментарий</Text>
            <Text style={styles.commentText}>{task.comment}</Text>
          </View>
        )}

        {/* 🔹 Service Description */}
        {task.service?.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Описание услуги</Text>
            <Text style={styles.commentText}>{task.service.description}</Text>
          </View>
        )}

        {/* 🔹 Секция: Таймер выполнения */}
<View style={styles.timerSection}>
  <Text style={styles.sectionTitle}>Время выполнения</Text>
  
  <View style={styles.timerDisplay}>
    <Text style={styles.timerText}>
      {isTimerRunning ? formatTime(elapsedSeconds) : "00:00:00"}
    </Text>
  </View>

  {/* Подсказки в зависимости от статуса */}
  {!isTimerRunning && task?.status !== 'completed' && (
    <Text style={styles.timerHint}>Нажмите "Начать выполнение", чтобы запустить таймер</Text>
  )}
  {isTimerRunning && (
    <Text style={[styles.timerHint, { color: '#D35D8A', fontWeight: '500' }]}>
      Задача в процессе... ⏳
    </Text>
  )}
  {task?.status === 'completed' && (
    <Text style={[styles.timerHint, { color: '#D35D8A', fontWeight: '500' }]}>
      Завершено! Итоговое время: {formatTime(elapsedSeconds)}
    </Text>
  )}
</View>

        {/* 🔹 Status Badge */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Статус задачи</Text>
          <View style={[
            styles.statusBadge,
            { 
              backgroundColor: 
                task.status === 'completed' ? '#D35D8A20' :
                task.status === 'in_progress' ? '#e09e8420' :
                task.status === 'canceled' ? '#6B728020' :
                '#D35D8A20'
            }
          ]}>
            <Text style={[
              styles.statusText,
              { 
                color: 
                  task.status === 'completed' ? '#D35D8A' :
                  task.status === 'in_progress' ? '#e09e84' :
                  task.status === 'canceled' ? '#6B7280' :
                  '#D35D8A'
              }
            ]}>
              {task.status === 'completed' && 'Выполнено'}
              {task.status === 'in_progress' && 'В работе'}
              {task.status === 'canceled' && 'Отменено'}
              {task.status === 'pending' && 'Ожидает'}
            </Text>
          </View>
        </View>

        {/* 🔹 Start Button - показывается если задача ещё не начата */}
        {task?.status === 'pending' && !taskStarted && (
          <TouchableOpacity 
            style={[styles.startButton, updatingStatus && styles.startButtonDisabled]} 
            onPress={handleStartTask}
            disabled={updatingStatus}
            activeOpacity={0.8}
          >
            {updatingStatus ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.startButtonText}>Начать выполнение</Text>
            )}
          </TouchableOpacity>
        )}

        {/* 🔹 Finish Button */}
        <TouchableOpacity 
  style={[
    styles.finishButton,
    task.status === 'completed' && styles.finishButtonDone,
    (updatingStatus || task?.status === 'completed') && styles.finishButtonDisabled
  ]} 
  onPress={handleCompleteTask}
  // 🔹 Отключаем анимацию нажатия, когда кнопка заблокирована
  activeOpacity={(updatingStatus || task?.status === 'completed') ? 1 : 0.8}
  // 🔹 Полная блокировка на уровне нативного компонента
  disabled={updatingStatus || task?.status === 'completed'}
>
  {updatingStatus ? (
    <ActivityIndicator color="#fff" size="small" />
  ) : (
    <Text style={styles.finishButtonText}>
      {task?.status === 'completed' 
        ? '✓ Задача выполнена' 
        : 'Завершить задачу'}
    </Text>
  )}
</TouchableOpacity>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// 🔹 Стили
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fadbe4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  scrollView: { flex: 1 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6B7280',   },
  errorText: { color: '#EF4444', marginBottom: 16, textAlign: 'center', fontSize: 16,   },
  retryButton: {
    backgroundColor: '#D35D8A', paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '500',   },
  
  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#fadbe4',
    alignItems: 'center', marginTop: 70, marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24, fontWeight: '600', color: '#D35D8A',  
    flex: 1, marginRight: 12,
  },
  closeButton: {
    width: 40, height: 40, backgroundColor: '#D35D8A',
    borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  closeButtonText: { color: '#FFFFFF', fontSize: 28, fontWeight: '400', lineHeight: 28,   },
  
  // Date
  dateContainer: { marginBottom: 20, paddingHorizontal: 20 },
  dateLabel: { fontSize: 13, color: '#6B7280', marginBottom: 4,   },
  dateText: { fontSize: 16, color: '#111827', fontWeight: '500',   },
  
  // Timer Boxes
  timerContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 30, paddingHorizontal: 20,
  },
  timerBox: {
    flex: 1, backgroundColor: '#D35D8A', borderRadius: 16,
    paddingVertical: 20, paddingHorizontal: 8,
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 4,
  },
  timerValue: {
    fontSize: 18, fontWeight: '700', color: '#FFFFFF',  
    marginBottom: 4, textAlign: 'center',
  },
  timerLabel: { fontSize: 12, color: '#FFFFFF', fontWeight: '500', textAlign: 'center',   },
  
  // Sections
  section: { marginBottom: 25, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 17, fontWeight: '600', color: '#111827',  
    marginBottom: 12,
  },
  commentText: {
    fontSize: 15, color: '#374151', lineHeight: 22,  
    backgroundColor: '#F9FAFB', padding: 14, borderRadius: 10,
  },
  
  // Progress
  progressContainer: {
    height: 16, backgroundColor: '#E5E7EB',
    borderRadius: 8, overflow: 'hidden', marginBottom: 8,
  },
  progressBar: {
    height: '100%', backgroundColor: '#7C3AED',
    borderRadius: 8, position: 'absolute', left: 0, top: 0, bottom: 0,
  },
  progressText: {
    fontSize: 13, color: '#FFFFFF', fontWeight: '600',  
    textAlign: 'center', lineHeight: 16, zIndex: 1,
  },
  progressHint: {
    fontSize: 13, color: '#6B7280', textAlign: 'center',  
  },
  
  // Tasks List
  tasksList: { backgroundColor: '#FFFFFF' },
  taskItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18,
    backgroundColor: '#F9FAFB', borderRadius: 10,
    marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6',
  },
  taskText: {
    fontSize: 15, color: '#D35D8A', flex: 1, marginRight: 12,  
  },
  taskTextCompleted: {
    color: '#9CA3AF', textDecorationLine: 'line-through',  
  },
  checkbox: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: '#D35D8A',
    backgroundColor: 'transparent', justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxFilled: { backgroundColor: '#D35D8A', borderColor: '#D35D8A' },
  checkmark: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', lineHeight: 16,   },
  
  // Status Badge
  statusSection: { paddingHorizontal: 20, marginBottom: 20 },
  statusBadge: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12, alignSelf: 'flex-start',
  },
  statusText: { fontSize: 14, fontWeight: '600',   },
  
  // Start Button
  startButton: {
    backgroundColor: '#D35D8A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 8,
  },
  startButtonDisabled: { opacity: 0.6 },
  startButtonText: {
    fontSize: 16,  
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Finish Button
  finishButton: {
    backgroundColor: '#D35D8A', borderRadius: 14,
    paddingVertical: 18, alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, marginBottom: 24,
  },
  finishButtonDone: { backgroundColor: '#D35D8A' },
  finishButtonDisabled: { opacity: 0.5, backgroundColor: '#9CA3AF' },
  finishButtonText: {
    fontSize: 17, fontWeight: '600', color: '#FFFFFF',  
  },
  
  // Footer
  footerSpacer: { height: 30 },


  timerSection: { 
  marginBottom: 25, 
  paddingHorizontal: 20 
},
timerDisplay: {
  backgroundColor: '#D35D8A',
  borderRadius: 16,
  paddingVertical: 28,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
},
timerText: {
  fontSize: 44,  
  fontWeight: '700',
  color: '#FFFFFF',
  fontVariant: ['tabular-nums'], // 🔑 Фиксирует ширину цифр, чтобы таймер не "дрожал"
  letterSpacing: 2,
},
timerHint: {
  fontSize: 14,  
  color: '#6B7280',
  textAlign: 'center',
  marginTop: 12,
  lineHeight: 20,
},
});