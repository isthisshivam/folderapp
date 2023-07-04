import React, { useState, useEffect } from 'react';
import {
    Image,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import Styles from "./Style";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons/faCloudUpload'
import ImagePicker from 'react-native-image-crop-picker';
import { AllGetPostRequestResponse } from "../Api/AllGetPostApi"
import ActivityLoader from '../Loader/ActivityLoader';
import DeviceInfo from 'react-native-device-info';

const Register = ({ navigation }) => {
    const onPressLogin = () => {
        if (imagePath === "") {
            Alert.alert("Please select image first")
            return;
        }
        if (firstName.length === 0) {
            Alert.alert("Please enter name")
            return;
        }
        if (password.length < 4) {
            Alert.alert("Please enter 4 digit numeric pin")
            return;
        }
        if (master.length === 0) {
            Alert.alert("Please enter master pin")
            return;
        }
        let formData = new FormData()
        formData.append("name", firstName)
        formData.append("password", password)
        formData.append("image", imageFile)
        formData.append("device_id", deviceId)
        formData.append("is_private", 1)
        formData.append("is_Secure", master)
        formData.append("is_biometric_enable", isSelected ? 1 : 0)
        console.log("Response===", JSON.stringify(formData))
        setLoading(true)
        AllGetPostRequestResponse.postRequest(formData, false, "/createProfile").then((response) => {
            if (response?.status) {
                Alert.alert("Success", response.message, [
                    {
                        text: 'OK', onPress: () => {
                            navigation.goBack();
                        }
                    },
                ]);
            }
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            console.log("error==", JSON.stringify(error))
                console.log(error?.response?.data);  
                alert(error?.response?.data?.message)
        })

    };
    const [master, setMasterPin] = useState("");
    const [firstName, setFirstName] = useState("");
    const [password, setPassword] = useState("");
    const [isSelected, setSelection] = useState(false);
    const [imagePath, setImagePath] = useState("")
    const [imageFile, setImageFile] = useState(null)
    const [deviceId, setDeviceId] = useState(null)
    const [isLoading, setLoading] = useState(false);
    // useEffect( () => {


    // }, [])

    const imageGalleryIntent = async () => {

        ImagePicker.openPicker({
            width: 87,
            height: 87,
            cropping: false
        }).then(async image => {
            console.log("image==", image);
            const localUri = image.path;
            const filename = localUri.split('/').pop();
            const newData = {
                uri: localUri,
                name: filename,
                type: image.mime,
            };

            setImagePath(localUri)
            setImageFile(newData);
            var uniqueId = await DeviceInfo.getUniqueId();
            setDeviceId(uniqueId);

        }).catch((error) => {
            //Always ends up here even on image selection
            console.log("error",error)
            if (error.code === 'E_PICKER_CANCELLED') {
                return false;
            }
        });


    }
    return (
        <View style={Styles.container}>
            {isLoading && <ActivityLoader isLoading={isLoading} />}
            {!isLoading && <>
                <View style={Styles.profileImageView}>
                    <TouchableOpacity onPress={imageGalleryIntent}>
                        <View style={Styles.profileRounderView}>
                            <Image
                                style={Styles.profileImage}
                                source={imagePath === "" ? require('../assets/icons/profile.jpeg') : { uri: imagePath }}
                            />
                        </View>
                    </TouchableOpacity>
                    <FontAwesomeIcon style={Styles.addIcon} size={30} icon={faCloudUpload} />
                </View>
                <View style={Styles.inputView}>
                    <TextInput
                        style={Styles.inputText}
                        placeholder="Name"
                        value={firstName}
                        placeholderTextColor="#003f5c"
                        onChangeText={text => setFirstName(text)} />
                </View>

                <View style={Styles.inputView}>
                    <TextInput
                        style={Styles.inputText}
                        maxLength={4}
                        placeholder="4 digit numeric pin"
                        keyboardType='numeric'
                        placeholderTextColor="#003f5c"
                        value={password}
                        onChangeText={text => {
                            let newText = '';
                            newText = text.replace(/[^0-9]/g, '')
                            console.log("new text", newText)
                            if (newText.length > 0) {
                                setPassword(newText)
                            }

                        }} />
                </View>
                <View style={Styles.inputView}>
                    <TextInput
                        style={Styles.inputText}
                        placeholder="Master Pin"
                        value={master}
                        placeholderTextColor="#003f5c"
                        onChangeText={text => setMasterPin(text)} />
                </View>

                <View style={Styles.checkboxContainer}>
                    <CheckBox
                        value={isSelected}
                        onValueChange={setSelection}
                        style={Styles.checkbox}
                        tintColors={{ true: 'green', false: '##d3d3d3' }}
                    />
                    <Text style={Styles.label}>BioMetric</Text>
                </View>
                <TouchableOpacity
                    onPress={onPressLogin}
                    style={Styles.loginBtn}>
                    <Text style={Styles.loginText}>Create Profile</Text>
                </TouchableOpacity>
            </>}
        </View>
    );
}

export default Register;