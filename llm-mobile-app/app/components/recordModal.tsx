import React from 'react';
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

type Props = {
     visible: boolean;
     slideAnim: Animated.Value;
     recordingText: string;
     onStop: () => void;
};

const RecordingModal = ({ visible, slideAnim, recordingText, onStop }: Props) => {
     const translateY = slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
     });

     if (!visible) return null;

     return (
          <Animated.View
               pointerEvents={visible ? 'auto' : 'none'}
               style={[
                    styles.recordingCard,
                    {
                         transform: [{ translateY }],
                         opacity: slideAnim,
                    },
               ]}
          >
               <Icon name="mic" size={30} color="#FFFFFF" />
               <Text style={styles.recordingText}>{recordingText}</Text>
               <View style={styles.audioWave}>
                    {[1, 2, 3, 4, 5].map((_, i) => (
                         <View
                              key={i}
                              style={[
                                   styles.waveBar,
                                   {
                                        height: Math.random() * 20 + 5,
                                        backgroundColor: i === 2 ? '#021526' : '#6EACDA',
                                   },
                              ]}
                         />
                    ))}
               </View>
               <TouchableOpacity onPress={onStop} style={styles.stopButton}>
                    <Text style={styles.stopButtonText}>Stop</Text>
               </TouchableOpacity>
          </Animated.View>
     );
};

const styles = StyleSheet.create({
     recordingCard: {
          position: 'absolute',
          left: '10%',
          right: '10%',
          bottom: 70,
          height: 150,
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 10,
          zIndex: 10,
     },
     recordingText: {
          marginTop: 8,
          fontSize: 16,
          color: '#333',
     },
     audioWave: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: 30,
          marginTop: 10,
     },
     waveBar: {
          width: 4,
          marginHorizontal: 3,
          borderRadius: 2,
     },
     stopButton: {
          position: 'absolute',
          right: 20,
          top: 20,
          backgroundColor: '#FF3B30',
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: 15,
     },
     stopButtonText: {
          color: 'white',
          fontSize: 14,
     },
});

export default RecordingModal;
