import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-800 text-xl font-bold mb-4">Screen not found</Text>
        <Link href="/" className="text-blue-500">Go home</Link>
      </View>
    </>
  );
}
