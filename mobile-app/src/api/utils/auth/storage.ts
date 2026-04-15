import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKENS_KEY = '@auth_tokens';

export const setToken = async (key: string, value: string) => {
  try {
    const existing = await AsyncStorage.getItem(TOKENS_KEY);
    const tokens = existing ? JSON.parse(existing) : {};
    tokens[key] = value;
    await AsyncStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  } catch (e) {
    console.error('Ошибка сохранения токена:', e);
  }
};

export const getToken = async (key: string): Promise<string | null> => {
  try {
    const existing = await AsyncStorage.getItem(TOKENS_KEY);
    if (!existing) return null;
    const tokens = JSON.parse(existing);
    return tokens[key] || null;
  } catch (e) {
    console.error('Ошибка получения токена:', e);
    return null;
  }
};

export const deleteToken = async (key: string) => {
  try {
    const existing = await AsyncStorage.getItem(TOKENS_KEY);
    if (!existing) return;
    const tokens = JSON.parse(existing);
    delete tokens[key];
    await AsyncStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  } catch (e) {
    console.error('Ошибка удаления токена:', e);
  }
};

export const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem(TOKENS_KEY);
  } catch (e) {
    console.error('Ошибка очистки токенов:', e);
  }
};