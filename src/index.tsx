import React from "react";
import { StyleSheet, View } from "react-native";
import { Home, Game } from '@screens';
import { AppLoading } from 'expo'
import { useFonts, DeliusUnicase_400Regular, DeliusUnicase_700Bold } from '@expo-google-fonts/delius-unicase';
import { Text } from '@components'

export default function App() {
  const [ fontLoaded ] = useFonts({ DeliusUnicase_400Regular, DeliusUnicase_700Bold })

  if(!fontLoaded) return <AppLoading />;

  return (
    <View style={styles.container}>
      <Text onPress={() => {alert(true)}} style={{ fontSize: 24 }} weight="400">{'Hello'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
