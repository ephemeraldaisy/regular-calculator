import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import CalculatorUI from './components/CalculatorUI'; // 1. BudgetUI 대신 계산기 컴포넌트를 가져옵니다.
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
      {/* 야동 사이트 같은 불쾌한 톤을 지우기 위해 상태바를 맑은 톤으로 세팅 */}
      <StatusBar barStyle="dark-content" /> 
      
      {/* 2. 잠금이 풀리기 전에는 '오직' 계산기 화면만 노출되도록 조건을 고정합니다. */}
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
    backgroundColor: '#FAFAFA', // 3. 배경색을 산뜻한 연화이트 톤으로 변경
  },
});
