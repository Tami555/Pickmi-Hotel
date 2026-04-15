// src/api/services/ServicesService/employee_tasks.ts

import { SERVICES_ENDPOINTS } from '../../config/endpoints';
import { apiClient } from '../../config/apiClient';
import { handleApiError } from '../../utils/errors/errorHandlers';
import { apiRequest } from '../../utils/apiRequest';
import { check_token } from '../UserService/tokens';

// 🔹 Типы данных

export interface TaskStatusResponse {
  id: number;
  scheduled_time: string;
  comment: string;
  service: { id: number; slug: string; title: string; price: number; description: string; image: string | null };
  status: 'pending' | 'in_progress' | 'completed' | 'canceled';
  started_at?: string | null;
  completed_at?: string | null;
}

export interface Room {
  room_number: string;
  floor: number;
  quantity_places: number;
}

export interface Reservation {
  id: number;
  check_in_date: string;
  check_out_date: string;
  status: 'active' | 'completed' | 'canceled';
  room: Room;
}

export interface Service {
  id: number;
  slug: string;
  title: string;
  price: number;
  description: string;
  image: string | null;
}

export interface EmployeeTask {
  id: number;
  scheduled_time: string;
  comment: string;
  service: Service;
  status: 'pending' | 'in_progress' | 'completed' | 'canceled';
  reservation: Reservation;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

// 🔹 GET: Получить список задач сотрудника
// ✅ Исправлено: убран <EmployeeTask[]>, добавлено приведение типа после await
export const getEmployeeTasks = async () => {
  return await apiRequest(
    async () => {
      await check_token();
      
      const endpoint = SERVICES_ENDPOINTS.CURRENT_USER_SERVICES;
      const res = await apiClient.get(endpoint);
      return res.data;
    },
    handleApiError
  ) as Promise<EmployeeTask[]>; // ✅ Приведение типа здесь
};

// 🔹 Вспомогательные функции

export const calculateTaskProgress = (task: EmployeeTask): number => {
  if (task.status === 'completed') return 100;
  if (task.status === 'canceled') return 0;
  if (task.started_at && !task.completed_at) return 50;
  return 0;
};

export const getTaskCardColor = (status: EmployeeTask['status']): string => {
  switch (status) {
    case 'completed': return '#22C55E';
    case 'in_progress': return '#F59E0B';
    case 'canceled': return '#6B7280';
    case 'pending':
    default: return '#D35D8A';
  }
};

export const formatTaskTitle = (task: EmployeeTask): string => {
  const room = task.reservation?.room?.room_number || '—';
  const service = task.service?.title || 'Задача';
  return `${service} • Номер ${room}`;
};

export const formatTaskTime = (scheduled_time: string): string => {
  const date = new Date(scheduled_time);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

// 🔹 PATCH: Начать выполнение задачи
export const startTask = async (taskId: number) => {
  return await apiRequest(
    async () => {
      // 🔹 1. Проверяем/обновляем токен (опционально, если интерсептор не срабатывает)
      await check_token();
      
      // 🔹 2. Получаем токен явно для отладки
      const token = await import('../../utils/auth/storage').then(m => m.getToken('access_token'));
      
      const endpoint = SERVICES_ENDPOINTS.TASK_STARTED(taskId);
      
      // 🔹 3. Логируем для отладки
      console.log('🔐 startTask debug:', {
        endpoint,
        hasToken: !!token,
        tokenPreview: token ? `${token.slice(0, 20)}...` : '❌ НЕТ ТОКЕНА',
        params: { tasks_id: taskId }
      });
      
      // 🔹 4. Отправляем запрос с явным заголовком Authorization (fallback)
      const res = await apiClient.patch(endpoint, {}, {
        params: { tasks_id: taskId },
        // ✅ Явно добавляем токен, если интерсептор не сработал
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        }
      });
      
      return res.data;
    },
    handleApiError
  ) as Promise<TaskStatusResponse>;
};


// 🔹 PATCH: Завершить задачу
export const completeTask = async (taskId: number) => {
  return await apiRequest(
    async () => {
      await check_token();
      
      const token = await import('../../utils/auth/storage').then(m => m.getToken('access_token'));
      
      const endpoint = SERVICES_ENDPOINTS.TASK_COMPLETED(taskId);
      
      console.log('🔐 completeTask debug:', {
        endpoint,
        hasToken: !!token,
        tokenPreview: token ? `${token.slice(0, 20)}...` : '❌ НЕТ ТОКЕНА',
        params: { tasks_id: taskId }
      });
      
      const res = await apiClient.patch(endpoint, {}, {
        params: { tasks_id: taskId },
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        }
      });
      
      return res.data;
    },
    handleApiError
  ) as Promise<TaskStatusResponse>;
};