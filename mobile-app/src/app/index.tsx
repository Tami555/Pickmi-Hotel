import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';



export default function Index() {
  const router = useRouter();

  useEffect(() => {
    console.log('🚀 ПРИЛОЖЕНИЕ ЗАПУСКАЕТСЯ');
    console.log('Redirecting to login...');
    const timer = setTimeout(() => {
      router.replace('/pages/LoginScreen');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Загрузка...</Text>
      <ActivityIndicator size="large" color="#D87093" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
});