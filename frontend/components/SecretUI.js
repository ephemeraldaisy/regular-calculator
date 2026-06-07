import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

const SERVER_URL = 'ws://YOUR_SERVER_IP:2048/ws'; 

export default function SecretUI({ token }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentTab, setCurrentTab] = useState('chat'); // 'chat'(채팅) 또는 'budget'(가계부) 탭 스위치
  const ws = useRef(null);

  const calculateDDay = () => {
    const targetDate = new Date('2026-01-01T00:00:00');
    const now = new Date();
    const diffTime = Math.abs(now - targetDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    ws.current = new WebSocket(`${SERVER_URL}/${token}`);
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'chat') {
        // 실시간으로 기존 메시지에 정상 병합되도록 렌더링 스태킹 수정
        setMessages(prev => [...prev, data]);
      }
    };
    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() === '') return;
    const msgData = { type: 'chat', text: input, id: Date.now().toString() };
    ws.current.send(JSON.stringify(msgData));
    setInput(''); // 전송 후 비우기 정상 작동
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      {/* 헤더: 디데이만 고급스럽게 노출 (NOCTURNE_LINK 문구 완벽 제거) */}
      <View style={styles.header}>
        <Text style={styles.dDay}>D+{calculateDDay()}</Text>
      </View>

      {/* 탭 컨트롤러 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, currentTab === 'chat' && styles.activeTab]} onPress={() => setCurrentTab('chat')}>
          <Text style={[styles.tabText, currentTab === 'chat' && styles.activeTabText]}>💬 채팅방</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, currentTab === 'budget' && styles.activeTab]} onPress={() => setCurrentTab('budget')}>
          <Text style={[styles.tabText, currentTab === 'budget' && styles.activeTabText]}>💰 공동 가계부</Text>
        </TouchableOpacity>
      </View>

      {/* 컨텐츠 영역 분기 */}
      {currentTab === 'chat' ? (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            style={styles.chatList}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="따뜻한 메시지를 입력하세요..."
              placeholderTextColor="#A4B0BE"
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Text style={styles.sendBtnText}>전송</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        /* 질문자님이 요청하신 추가된 가계부 기능 컴포넌트 내부 귀속 */
        <ScrollView style={styles.budgetContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>우리의 공동 데이트 잔액</Text>
            <Text style={styles.summaryAmount}>$4,250.00</Text>
          </View>
          {['정착 목적 자금 이체: +$500.00', '카페 디저트 정산: -$20.00', '비행기 티켓 예약: -$340.00'].map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingVertical: 15, alignItems: 'center', backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#F1F2F6' },
  dDay: { color: '#50E3C2', fontSize: 22, fontWeight: '800', letterSpacing: 1 }, // 비트윈식 청정 민트 컬러 컬러링
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E4E7EB' },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderColor: '#50E3C2' },
  tabText: { color: '#747D8C', fontSize: 14 },
  activeTabText: { color: '#50E3C2', fontWeight: 'bold' },
  chatList: { flex: 1, padding: 15 },
  messageBox: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginVertical: 5, alignSelf: 'flex-start', maxWidth: '80%', borderWidth: 1, borderColor: '#E4E7EB' },
  messageText: { color: '#2F3542', fontSize: 15 },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#E4E7EB', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F1F2F6', color: '#2F3542', padding: 12, borderRadius: 20, marginRight: 10, paddingLeft: 15 },
  sendBtn: { backgroundColor: '#50E3C2', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20 },
  sendBtnText: { color: '#FFF', fontWeight: 'bold' },
  budgetContainer: { flex: 1, padding: 20 },
  summaryCard: { backgroundColor: '#50E3C2', padding: 20, borderRadius: 16, marginBottom: 20 },
  summaryTitle: { color: '#FFF', fontSize: 14, opacity: 0.9 },
  summaryAmount: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginTop: 5 },
  listItem: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E4E7EB' },
  listText: { fontSize: 15, color: '#2F3542' },
});

