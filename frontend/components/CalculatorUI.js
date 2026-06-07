import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CalculatorUI({ onUnlock }) {
  const [display, setDisplay] = useState('0');

  const handlePress = (value) => {
    if (value === 'C') {
      setDisplay('0');
    } else if (value === '=') {
      // 비밀번호 168 입력 시 히든 앱 개방 트리거 작동
      if (display === '168') {
        onUnlock('168');
      } else {
        // 일반 계산기 기능 흉내 (eval 대용 안전한 처리 혹은 초기화)
        setDisplay('0');
      }
    } else {
      setDisplay(display === '0' ? value : display + value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.keypad}>
        {[['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'], ['C', '0', '=']].map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((char) => (
              <TouchableOpacity key={char} style={styles.button} onPress={() => handlePress(char)}>
                <Text style={styles.buttonText}>{char}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', justifyContent: 'flex-end', padding: 20 },
  displayContainer: { padding: 20, alignItems: 'flex-end', marginBottom: 30 },
  displayText: { fontSize: 60, color: '#2F3542', fontWeight: '300' },
  keypad: { width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  button: { width: '30%', aspectRatio: 1, backgroundColor: '#F1F2F6', justifyContent: 'center', alignItems: 'center', borderRadius: 50 },
  buttonText: { fontSize: 28, color: '#2F3542', fontWeight: '400' },
});
