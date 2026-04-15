import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router'; // ← Импорт роутера

const TimerScreen = () => {
  const handleClose = () => {
    // Закрыть и вернуться на главный экран
    router.replace('/pages/HomeScreen');
  };

  const handleFinish = () => {
    // Завершить таймер и перейти на главный экран
    router.replace('/pages/HomeScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Номер Люкс, 45</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Start Date */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>start</Text>
        <Text style={styles.dateText}>21 Feb 2022, 14:45</Text>
      </View>

      {/* Timer Boxes */}
      <View style={styles.timerContainer}>
        <View style={styles.timerBox}>
          <Text style={styles.timerValue}>0</Text>
          <Text style={styles.timerLabel}>Часов</Text>
        </View>
        
        <View style={styles.timerBox}>
          <Text style={styles.timerValue}>3</Text>
          <Text style={styles.timerLabel}>минут</Text>
        </View>
      </View>

      {/* Finish Button */}
      <TouchableOpacity 
        style={styles.finishButton} 
        onPress={handleFinish}
        activeOpacity={0.8}
      >
        <Text style={styles.finishButtonText}>Завершить</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#D35D8A',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: '#D35D8A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 28,
  },
  dateContainer: {
    marginBottom: 40,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  timerBox: {
    width: '45%',
    backgroundColor: '#D35D8A',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerValue: {
    fontSize: 48,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  finishButton: {
    backgroundColor: '#D35D8A',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default TimerScreen;