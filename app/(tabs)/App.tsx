import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Audio } from 'expo-av';

// Define the structure of a single recording
interface Recording {
  uri: string;
  name: string;
}

export default function App() {
  // State management with TypeScript types
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. Request Microphone Permission on mount
  useEffect(() => {
    (async () => {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
    })();
  }, []);

  // 2. Function to Start Recording
  async function startRecording() {
    try {
      // Configure the audio mode for recording (Android focused)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      });

      console.log('Starting recording..');
      
      // Prepare and start the recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      console.log('Recording started');

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert("Error", "Could not start recording. Check your permissions.");
    }
  }

  // 3. Function to Stop Recording
  async function stopRecording() {
    if (!recording) return;

    console.log('Stopping recording..');
    setRecording(undefined);

    try {
      await recording.stopAndUnloadAsync();
  
      // Get the recorded URI
      const uri = recording.getURI();
      if (!uri) {
        throw new Error("Recording URI is null. Could not save recording.");
      }
  
      console.log('Recording stopped and stored at', uri);
  
      // Save the recording to our state
      const newRecording: Recording = {
        uri: uri,
        name: `Recording_${new Date().toISOString().replace(/[:.]/g, '-')}.m4a`
      };
  
      setRecordings(prevRecordings => [...prevRecordings, newRecording]);
  
      Alert.alert("Recording Saved!", "Your audio has been saved successfully.");
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert("Error", "Failed to save the recording.");
    }
  }

  // 4. Function to Play a Saved Recording - FIXED VERSION
  async function playRecording(recordingUri: string) {
    try {
      // Stop and unload current sound if it exists and is loaded
      if (sound) {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.stopAsync();
            await sound.unloadAsync();
          }
        } catch (error) {
          console.log('Error stopping previous sound:', error);
          // Continue anyway - we'll create a new sound
        }
        setSound(undefined);
      }

      setIsPlaying(true);
      
      console.log('Loading Sound from:', recordingUri);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true }
      );

      setSound(newSound);

      // Set up playback status updates
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
            newSound.unloadAsync();
            setSound(undefined);
          }
        }
      });

      console.log('Playing Sound');
      await newSound.playAsync();

    } catch (error) {
      console.error('Playback failed', error);
      setIsPlaying(false);
      Alert.alert("Error", "Could not play the audio file.");
    }
  }

  // 5. Function to stop playback manually
  async function stopPlayback() {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch (error) {
        console.log('Error stopping playback:', error);
      }
      setSound(undefined);
    }
    setIsPlaying(false);
  }

  // 6. Clean up the sound when the component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(error => {
          console.log('Error unloading sound on unmount:', error);
        });
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Recorder</Text>

      {/* Record Button */}
      <TouchableOpacity
        style={[styles.button, recording ? styles.recordingButton : null]}
        onPress={recording ? stopRecording : startRecording}
        disabled={permissionResponse?.status !== 'granted'}
      >
        <Text style={styles.buttonText}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {permissionResponse?.status !== 'granted' && (
        <Text style={styles.permissionText}>
          Microphone permission is required to record audio.
        </Text>
      )}

      {/* Playback Control */}
      {isPlaying && (
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopPlayback}
        >
          <Text style={styles.buttonText}>Stop Playback</Text>
        </TouchableOpacity>
      )}

      {/* List of Saved Recordings */}
      <ScrollView style={styles.recordingsList}>
        <Text style={styles.subtitle}>Your Recordings:</Text>
        {recordings.length === 0 ? (
          <Text style={styles.noRecordingsText}>No recordings yet. Press the button above to start.</Text>
        ) : (
          recordings.map((recording, index) => (
            <View key={index} style={styles.recordingRow}>
              <Text style={styles.recordingName} numberOfLines={1}>
                {recording.name}
              </Text>
              <TouchableOpacity
                style={[styles.playButton, isPlaying ? styles.disabledButton : null]}
                onPress={() => playRecording(recording.uri)}
                disabled={isPlaying}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  stopButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  permissionText: {
    color: '#FF9500',
    marginTop: 10,
    textAlign: 'center',
  },
  recordingsList: {
    width: '100%',
    marginTop: 20,
  },
  recordingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  recordingName: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  playButton: {
    backgroundColor: '#34C759',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  playButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noRecordingsText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});