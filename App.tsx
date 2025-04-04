import React from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Hi</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
});
