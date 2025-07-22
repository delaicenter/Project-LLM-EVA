import React from 'react'
import { Text, View } from 'react-native'
import { API_URL } from '@env'

export default function IndexApp() {
     return (
       <View>
        <Text>Hello Worl! ({API_URL})</Text>
       </View>
  )
     
}
