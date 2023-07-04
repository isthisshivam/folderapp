import React, { useState } from 'react';
import {
    Image,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import { screenNavigation,  } from '../Utils/Utility';
import Styles from "./Style";

const Login = ({ navigation }) => {
    const onPressLogin = () => {
        if (password.length === 0) {
            Alert.alert("Please enter password")
            return;
        }
        screenNavigation(navigation,"AfterLoginStack")
    };

    const [password, setPassword] = useState("");
    return (
        <View style={Styles.container}>
            <View style={Styles.inputView}>
                <TextInput
                    secureTextEntry
                    style={Styles.inputText}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setPassword(text)} />
            </View>
            
            <TouchableOpacity
                onPress={onPressLogin}
                style={Styles.loginBtn}>
                <Text style={Styles.loginText}>Login</Text>
            </TouchableOpacity>

        </View>
    );
}

export default Login;