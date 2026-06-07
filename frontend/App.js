import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import CalculatorUI from './components/CalculatorUI'; // 가계부 대신 계산기가 첫 화면으로 오도록 교체
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
      {/* 어두운 성인 사이트 톤 탈출을 위해 상단바를 화사하게 세팅 */}
      <StatusBar barStyle="dark-content" />
      {!isVaultUnlocked ? (
        <CalculatorUI onUnlock={handleUnlock} />
      ) : (
        <SecretUI token={wsToken} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // 산뜻한 미색 화이트로 변경
  },
});

