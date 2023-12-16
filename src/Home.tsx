import { View, Text, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import Header from './components/Header'

export const Home = ({navigation, route}) => {

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress',handleBack)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress',handleBack)
    }
  }, [])

  const handleBack = () => {
    BackHandler.exitApp()
    return true
  }
  
  return (
    <View>
      <Header/>
        <Text>Home</Text>
    </View>
  )
}