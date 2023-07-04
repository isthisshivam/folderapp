import { Animated, Image, SafeAreaView, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { storeData } from '../Utils/Utility';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from './Style';
import { AllGetPostRequestResponse } from "../Api/AllGetPostApi"
import ActivityLoader from '../Loader/ActivityLoader';

const { Value, Text: AnimatedText } = Animated;
import { screenNavigation,notifyMessage } from '../Utils/Utility';
const CELL_COUNT = 4;
const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({ hasValue, index, isFocused }) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const VerifyPin = ({ navigation }) => {
  const route = useRoute();
  const [value, setValue] = useState('');
  const [param, setParams] = useState(route?.params?.data || null)
  const [isLoading, setLoading] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const renderCell = ({ index, symbol, isFocused }) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
          inputRange: [0, 1],
          outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
        })
        : animationsColor[index].interpolate({
          inputRange: [0, 1],
          outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
        }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };
 

  const authenticate = (pin) => {
    let formData = new FormData()
    formData.append("user_id", param?.id)
    formData.append("password", pin)
    formData.append("isBiometric", param?.is_biometric_enable === 1 ? true : false)
    setLoading(true)
    AllGetPostRequestResponse.postRequest(formData, false, "/login").then((response) => {
      if (response?.status) {
        notifyMessage(response?.message);
        // screenNavigation(navigation, "LoginListing", {
        //   screen: 'LoginListing',
        //  "data": response.data})
       storeData(response?.data, navigation);
      }
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      console.log("error==", err)
    })
  }

  return (
    <SafeAreaView style={styles.root}>
     
      {<>
        <Text style={styles.title}>Verification</Text>
        <Image style={styles.icon} source={require('../assets/icons/lock.png')} />
        <Text style={styles.subTitle}>
          Please enter the verification code{'\n'}
        </Text>

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
        />
        {value.length === 4 && <TouchableOpacity onPress={() => {
          if (value.length === 4) {
            authenticate(value)
          }
        }}>
          <View style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Verify</Text>
          </View>
        </TouchableOpacity>
        }
      </>}
      {isLoading && <ActivityLoader isLoading={isLoading} />}
    </SafeAreaView>
  );
};

export default VerifyPin;