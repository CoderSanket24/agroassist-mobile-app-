import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

const ChatHistory = ({ history }: { history: { q: string; a: string, time: string }[] }) => {
    return (
        <FlatList
            style={{ marginTop: 20 }}
            data={history}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
                <View
                    style={styles.chatBox}
                >
                    <Text style={styles.query}>👨‍🌾 {item.q}</Text>
                    <Text style={styles.answer}>🤖 {item.a}</Text>
                    <Text style={styles.timestamp}>{item.time}</Text>
                </View>
            )}
        />
    )
}

export default ChatHistory

const styles = StyleSheet.create({
    chatBox: {
        backgroundColor: Colors.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    query: { fontWeight: "bold", marginBottom: 5 },
    answer: { color: Colors.text },
    timestamp: { fontSize: 12, color: "#666", textAlign: "right" },
});
