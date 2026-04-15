import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';

// 1. Создаем интерфейс для уведомления
interface Notification {
  id: string;
  type: 'new' | 'done' | 'alert' | 'progress';
  title: string;
  subtitle: string;
}

// 2. Типизируем пропсы компонента NotificationItem
interface NotificationItemProps {
  item: Notification;
}

const NotificationItem = ({ item }: NotificationItemProps) => {
  let iconBg = '#E5E7EB';
  let iconContent = null;

  if (item.type === 'new') {
    iconBg = '#8B5CF6';
    iconContent = '!';
  } else if (item.type === 'done') {
    iconBg = '#D35D8A';
    iconContent = '✓';
  } else if (item.type === 'alert') {
    iconBg = '#D35D8A';
    iconContent = '!';
  } else if (item.type === 'progress') {
    iconBg = '#D35D8A';
    iconContent = '||';
  }

  return (
    <View style={styles.itemContainer}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Text style={styles.iconText}>{iconContent}</Text>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
};

const NotificationsScreen = () => {
  // 3. Типизируем массив
  const notifications: Notification[] = [
    { id: '1', type: 'new', title: 'Добавлена новая задача', subtitle: 'Номер Люкс, 8. Нужна уборка' },
    { id: '2', type: 'done', title: 'Задача была выполнена', subtitle: 'Номер ср.класса.Спасибо за работу!' },
    { id: '3', type: 'alert', title: 'Выполните задачу!!!', subtitle: 'У остался 1 день до выполнения задачи от руководства' },
    { id: '4', type: 'progress', title: 'Ваш прогресс задачи прошёл отметку в 100%', subtitle: 'Спасибо за работу!' },
    { id: '5', type: 'done', title: 'Задача была выполнена', subtitle: 'Номер ср.класса.Спасибо за работу!' },
    { id: '6', type: 'progress', title: 'Ваш прогресс задачи прошёл отметку в 100%', subtitle: 'Спасибо за работу!' },
    { id: '7', type: 'progress', title: 'Ваш прогресс задачи прошёл отметку в 100%', subtitle: 'Спасибо за работу!' },
    { id: '8', type: 'done', title: 'Задача была выполнена', subtitle: 'Номер ср.класса.Спасибо за работу!' },
    { id: '9', type: 'done', title: 'Задача была выполнена', subtitle: 'Номер ср.класса.Спасибо за работу!' },
    { id: '10', type: 'done', title: 'Задача была выполнена', subtitle: 'Номер ср.класса.Спасибо за работу!' },
    { id: '11', type: 'done', title: 'Задача была выполнена', subtitle: 'Номер ср.класса.Спасибо за работу!' },
    { id: '12', type: 'done', title: 'Задача была выполнена', subtitle: 'Номер ср.класса.Спасибо за работу!' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Уведомления</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.headerDivider} />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#D35D8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#D35D8A',
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    flexShrink: 0,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 70,
    marginRight: 20,
  },
});

export default NotificationsScreen;