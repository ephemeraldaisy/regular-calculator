import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import BudgetUI from './components/BudgetUI';
import SecretUI from './components/SecretUI';

export default function App() {
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [wsToken, setWsToken] = useState(null);

  const handleUnlock = (token) => {
    setWsToken(token);
    setIsVaultUnlocked(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isVaultUnlocked ? "light-content" : "dark-content"} />
      {!isVaultUnlocked ? (
        <BudgetUI onUnlock={handleUnlock} />
      ) : (
        <SecretUI token={wsToken} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
