import React, {useEffect, useState, useRef} from 'react';
import {Animated, Text, View, Image, Dimensions} from 'react-native';
import Styles from './Style';
import {useRoute} from '@react-navigation/native';
import { resetStack, screenNavigation } from '../Utils/Utility';

export default SplashScreen = ({navigation}) => {
  
  const SlideupAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const windowHeight = Dimensions.get('window').height / 2.3;

  useEffect(() => {
    // resetStack(navigation,"Landing")
    // return
    Animated.timing(SlideupAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }).start();
    setTimeout(()=>{
      resetStack(navigation,"Landing")
      //resetStack(navigation,"LoginListing")
    },3000)
  }, [SlideupAnim]);

  return (
    <View style={Styles.container}>
      {
        <>
          <Animated.View
            style={{
              opacity: 1,
              transform: [
                {
                  translateY: SlideupAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2000, windowHeight],
                  }),
                },
              ],
            }}>
            <Image
              style={Styles.splacLogo}
              source={require('../assets/icons/lock.png')}
            />
          </Animated.View>
        </>
      }
    </View>
  );
};
