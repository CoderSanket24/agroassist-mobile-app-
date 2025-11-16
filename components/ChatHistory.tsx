import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChatHistoryProps {
    history: { q: string; a: string, time: string }[];
    onSpeak?: (text: string, index: number) => void;
    onStopSpeaking?: () => void;
    isSpeaking?: boolean;
    currentSpeakingIndex?: number | null;
}

const ChatHistory = ({ history, onSpeak, onStopSpeaking, isSpeaking, currentSpeakingIndex }: ChatHistoryProps) => {
    return (
        <FlatList
            style={{ marginTop: 20 }}
            data={history}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
                <View style={styles.chatBox}>
                    <Text style={styles.query}>👨‍🌾 {item.q}</Text>
                    
                    <View style={styles.answerContainer}>
                        <Text style={styles.answer}>🤖 {item.a}</Text>
                        
                        {onSpeak && onStopSpeaking && (
                            <TouchableOpacity
                                style={styles.speakerButton}
                                onPress={() => {
                                    if (isSpeaking && currentSpeakingIndex === index) {
                                        onStopSpeaking();
                                    } else {
                                        onSpeak(item.a, index);
                                    }
                                }}
                            >
                                <Ionicons
                                    name={isSpeaking && currentSpeakingIndex === index ? "stop-circle" : "volume-high"}
                                    size={24}
                                    color={isSpeaking && currentSpeakingIndex === index ? "#e53935" : Colors.primary}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    
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
    query: { 
        fontWeight: "bold", 
        marginBottom: 8,
        fontSize: 15,
    },
    answerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    answer: { 
        color: Colors.text,
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
    },
    speakerButton: {
        marginLeft: 8,
        padding: 4,
    },
    timestamp: { 
        fontSize: 12, 
        color: "#666", 
        textAlign: "right",
        marginTop: 4,
    },
});
