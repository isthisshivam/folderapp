import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Alert,
    Image,
    BackHandler
} from "react-native"
import Styles from "./Style";
import FingerprintScanner from 'react-native-fingerprint-scanner';
import FingerprintPopup from '../FingerPrintPopup/FingerPrintPopup';
import {  useRoute } from '@react-navigation/native';
import { screenNavigation, storeData } from '../Utils/Utility';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons/faSquarePlus'
import { AllGetPostRequestResponse } from "../Api/AllGetPostApi"
import ActivityLoader from '../Loader/ActivityLoader';
import DeviceInfo from 'react-native-device-info';

// const dismissSubscription = RNAlarmEmitter.addListener(
//     'OnNotificationDismissed', (data) => console.log("android=="+JSON.stringify(data))
// );

// const openedSubscription = RNAlarmEmitter.addListener(
//     'OnNotificationOpened', async(data) => {
        
//         const alarms = await ReactNativeAN.getScheduledAlarms();

//         console.log("androidopen=="+JSON.stringify(alarms))

// }
//);

export default LandingScreen = ({ navigation }) => {
    const route = useRoute();
    const [usersList, setUserList] = useState([])
    const [popupShowed, setpopupShowed] = useState(false)
    const [errorMessage, seterrorMessage] = useState("")
    const [biometric, setbiometric] = useState(null)
    const [isLoading, setLoading] = useState(false);
    const [userClickedItem, setUserClikedItem] = useState(null)
    const [deviceId, setDeviceId] = useState(null)
    

    useEffect(() => {
        detectFingerprintAvailable()
        let navFocusListener = navigation.addListener('focus', () => {
            // do some API calls here
            requestCall()
            console.log('did focus');
        });
        requestCall()
        const backAction = () => {
            console.log("route name==",route.name);
            if(route.name === "Landing"){
            BackHandler.exitApp();
            }else {
                navigation.back();
            }
        }
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
          );
        
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction);
            navFocusListener.remove();
           
        };
    }, [])
    const requestCall = () => {
        setLoading(true)
        AllGetPostRequestResponse.getRequest(1, false, "/profileList").then( async (response) => {
            if (response?.status) {
                let tempArr = []
                if (response?.data !== null && response?.data?.length > 0) {
                    tempArr = response.data
                }
                tempArr.push({
                    "id": -1,
                    "name": "Add User",
                    "image": "",
                    "device_id": "1",
                    "is_private": 1,
                    "is_biometric_enable": 0,
                    "created_at": "2023-02-09T04:38:04.000000Z",
                    "updated_at": "2023-02-09T04:38:04.000000Z"
                })
                setUserList(tempArr)
                var uniqueId = await DeviceInfo.getUniqueId();
                setDeviceId(uniqueId);
              
            }
            setLoading(false)
        }).catch((err) => {
            setLoading(false)
            console.log("error==", err)
        })
    }
    const handleFingerprintShowed = (item = {}) => {
        setpopupShowed(true)
        setUserClikedItem(item)
    };

    const handleFingerprintDismissed = () => {
        setpopupShowed(false)
    };
    const detectFingerprintAvailable = () => {
        FingerprintScanner
            .isSensorAvailable()
            .catch(error => {
                console.log("Errors===", JSON.stringify(error))
                seterrorMessage(error.name)
                setbiometric(error.biometric)
            });
    }
    const parseResultOfBioMetric = (messageCode, message) => {
        //createAlert(message, messageCode)
        if (messageCode === "100") {

           authenticate("123456")
        } else {
            navigation.navigate("VerifyPin", { "data": userClickedItem }) 
        }
    }
    const authenticate = (pin) => {
        let formData = new FormData()
        formData.append("user_id", userClickedItem.id)
        formData.append("password", pin)
        formData.append("isBiometric", true)
        setLoading(true)
        AllGetPostRequestResponse.postRequest(formData, false, "/login").then((response) => {
          if (response?.status) {
            // screenNavigation(navigation, "LoginListing", {
            //     screen: 'LoginListing',
            //    "data": response.data})
            storeData(response?.data, navigation)
          }
          setLoading(false)
        }).catch((err) => {
          setLoading(false)
          console.log("error==", err)
        })
      }

    

    const renderItem = ({ item }) => {
        return (
            item.name !== "Add User" ?
                <TouchableOpacity style={Styles.square} onPress={() => 
                {
  // alert(item.device_id  + " -- "+ deviceId) item.device_id !== deviceId
                   if (true){
                    if(item.is_biometric_enable === 0){
                        navigation.navigate("VerifyPin", { "data": item })
                    }else{
                        handleFingerprintShowed(item)
                    }

                   } 
                   else{
                    alert("Registered device is different from logged in device");
                   }
                    //navigation.navigate("VerifyPin", { "data": item })
                        
                }
                
                }>

                    <View style={Styles.profileRounderView}>
                        <Image
                            style={Styles.profileImage}
                            source={item.image !== "" ? { uri: item.image } : require('../assets/icons/profile.jpeg')}
                        />
                    </View>
                    <View >
                        <Text style={Styles.userNameText}>
                            {item.name}
                        </Text>
                    </View>
                </TouchableOpacity>
                :
                <TouchableOpacity style={Styles.square} onPress={() => screenNavigation(navigation, "Register", {})}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[Styles.userNameText]}>
                            {item.name}
                        </Text>
                        <FontAwesomeIcon style={Styles.addIcon} size={30} icon={faSquarePlus} />
                    </View>
                </TouchableOpacity>
        )
    };

    return (
        <View style={Styles.container}>
           
            { <>
                {errorMessage === "FingerprintScannerNotEnrolled" && <Text style={[Styles.userNameText, { fontSize: 12, color: "red" }]}>
                    {errorMessage + " Please enable from phone setting"}
                </Text>}
                <FlatList
                    data={usersList}
                    renderItem={renderItem}
                    numColumns={2}
                    columnWrapperStyle={Styles.row}
                />
                {popupShowed && (
                    <FingerprintPopup
                        style={Styles.popup}
                        bioMetricParseResult={(messageCode, message) => parseResultOfBioMetric(messageCode, message)}
                        handlePopupDismissedLegacy={() => handleFingerprintDismissed()}
                    />
                )}
            </>
            }
             {isLoading && <ActivityLoader isLoading = {isLoading}/>}
        </View>

    )
}