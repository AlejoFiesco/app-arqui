
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import { Audio } from 'expo-av'

export default function App() {

  const [sound, setSound] = useState();
  const [host, setHost] = useState('ws://192.168.0.5:3000')
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [value, setValue] = useState('');
  const [isHigh, setIsHigh] = useState(false);


  useEffect(() => {
    setSocket(io(host))
  }, [])



  useEffect(() => {
    if (value > 200) setIsHigh(true)
    else setIsHigh(false)
  }, [value]);

  useEffect(()=>{
    if(isHigh){
      try{
        SoundPlayer.playSoundFile('alarm', 'mp3')
      }catch(e){
        console.log(e);
      }
    }
  }, [isHigh])

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        setIsConnected(true);
      })
      socket.on('disconnect', () => {
        setIsConnected(false);
      })
      socket.on('sensor', (data) => {
        // console.log(data);
        setValue(data.levels)
      });

      return () => {
        socket.off('sensor', (data) => {
          console.log(data);
          setValue(data.levels)
        })
      }
    }

  }, [socket])

  function simulate() {
    console.log('simulate');
    socket.emit('simulate', {});
  }

  return (
    <View style={styles.container}>
      {!isConnected 
      ?<Text>Conectando...</Text>
      :<View>
        <Text style={styles.bigText}>El nivel actual de gas natural es</Text>
        <Text style={isHigh ? [styles.bigText, styles.highValues] : styles.bigText}>{value}</Text>
      </View>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: {
    fontSize: 30,
  },
  highValues: {
    color: 'red'
  }
});
