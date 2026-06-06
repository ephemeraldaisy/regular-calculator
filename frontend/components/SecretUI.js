import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';

const SERVER_URL = 'ws://YOUR_SERVER_IP:2048/ws'; // Replace with Oracle Cloud IP

export default function SecretUI({ token }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [heartAnim, setHeartAnim] = useState(false);
  const ws = useRef(null);

  // Live D-Day Tracker Logic (Target: Jan 1, 2026)
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
        setMessages(prev => [...prev, data]);
      } else if (data.type === 'heart') {
        triggerHeart();
      }
    };

    return () => ws.current.close();
  }, []);

  const triggerHeart = () => {
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 2000);
  };

  const sendHeart = () => {
    ws.current.send(JSON.stringify({ type: 'heart' }));
    triggerHeart();
  };

  const sendMessage = () => {
    if (input.trim() === '') return;
    const msgData = { type: 'chat', text: input, id: Date.now().toString() };
    ws.current.send(JSON.stringify(msgData));
    setInput('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dDay}>D+{calculateDDay()}</Text>
        <Text style={styles.title}>NOCTURNE_LINK</Text>
      </View>

      {heartAnim && (
        <View style={styles.heartOverlay}>
          <Text style={styles.giantHeart}>💘</Text>
        </View>
      )}

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
        <TouchableOpacity style={styles.heartBtn} onPress={sendHeart}>
          <Text style={{ fontSize: 24 }}>💘</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Encrypt message..."
          placeholderTextColor="#FF005577"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendBtnText}>TX</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0c' },
  header: { padding: 20, borderBottomWidth: 1, borderColor: '#FF0055', alignItems: 'center' },
  dDay: { color: '#FF0055', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#00FFCC', fontSize: 12, fontFamily: 'monospace', marginTop: 5 },
  chatList: { flex: 1, padding: 15 },
  messageBox: { backgroundColor: '#1a1a24', padding: 12, borderRadius: 8, marginVertical: 5, borderWidth: 1, borderColor: '#333' },
  messageText: { color: '#E0E0E0', fontFamily: 'monospace' },
  inputContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#333', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#111', color: '#00FFCC', padding: 12, borderRadius: 4, borderWidth: 1, borderColor: '#FF0055', marginRight: 10, fontFamily: 'monospace' },
  sendBtn: { backgroundColor: '#FF0055', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 4 },
  sendBtnText: { color: '#FFF', fontWeight: 'bold', fontFamily: 'monospace' },
  heartBtn: { marginRight: 15 },
  heartOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  giantHeart: { fontSize: 120 },
});
