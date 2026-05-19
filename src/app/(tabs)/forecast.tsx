import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForecastScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-slate-800 text-2xl font-bold">Forecast</Text>
      </View>
    </SafeAreaView>
  );
}
