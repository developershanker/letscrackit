/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, View, Image, Dimensions} from 'react-native';

import {colors, fonts} from './src/constants';
const {width, height} = Dimensions.get('window');

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            height: height,
            width: width,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('./src/icons/logo-transparent-png.png')}
            style={{width: 150, height: 150}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  testStyles: {
    fontSize: 100,
    fontFamily: fonts.SHORTBABY,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
