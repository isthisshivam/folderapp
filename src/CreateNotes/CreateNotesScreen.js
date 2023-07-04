import React, { useState, useEffect } from 'react';
import {
    Image,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import { notifyMessage } from '../Utils/Utility';
import Styles from "./Style";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { AllGetPostRequestResponse } from "../Api/AllGetPostApi"
import ActivityLoader from '../Loader/ActivityLoader';
import { useRoute } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';
import ReactNativeAN from 'react-native-alarm-notification';
import { NativeEventEmitter, NativeModules } from 'react-native';
import DocumentPicker, {
    isInProgress,
  } from 'react-native-document-picker'
const { RNAlarmNotification } = NativeModules;


const CreateNotesScreen = ({ navigation }) => {
    const route = useRoute();
    const [comingType, setComingType] = useState(route.params?.coming);
    const [noteName, setNoteName] = useState(comingType == "add" ? "" : route.params?.editData?.name);
    const [description, setDesc] = useState(comingType == "add" ? "" : route.params?.editData?.description)
    const [isLoading, setLoading] = useState(false);
    const [mode, setMode] = useState("time");
    const [rootFolder, setRootFolder] = useState(route.params?.data);
    const [editData, setEditData] = useState(comingType == "add" ? null : route.params?.editData);
    const [date, setDate] = useState(comingType == "add" ?new Date(): (route.params?.editData?.alarm_date !== null? new Date(route.params?.editData?.alarm_date): new Date()))
    const [selectedFileObject, setselectedFileObject] = useState({})

    const [open, setOpen] = useState(false)
    const [createdopen, setCreatedOpen] = useState(false)
    const [inPutdate, setInputDate] = useState(comingType == "add" ? "" :(route.params?.editData?.alarm_date !== null? route.params?.editData?.alarm_date:""))
    const [createNoteDate, setCreateNoteDate] = useState(comingType == "add" ? "" : moment(route.params?.editData?.created_at).format('YYYY-MM-DD HH:mm'))
    const RNAlarmEmitter = new NativeEventEmitter(RNAlarmNotification);
    
    useEffect(() => {
       // alert(route.params?.editData)
        if(mode == "date"){
            setOpen(true)
        }

    },[mode])
   
    useEffect(() => {
        const dismissSubscription = RNAlarmEmitter.addListener(
            'OnNotificationDismissed', async (data) => {
                let parseData = JSON.parse(data)
                console.log("android data dismiss==" + parseData.id)

                const alarms = await ReactNativeAN.getScheduledAlarms();
                if (alarms.length > 0) {
                    alarms.map((object) => {
                        // console.log("alarm data object==",object)
                        if (parseData.id == object.id) {

                            if (typeof object?.id !== "undefined" && object.id !== null) {
                                console.log("alarm data object==", parseData.id)
                                ReactNativeAN.deleteAlarm(object.id);
                            }

                        }
                    })
                }
                ReactNativeAN.stopAlarmSound();
            }
        );

        const openedSubscription = RNAlarmEmitter.addListener(
            'OnNotificationOpened', async (data) => {

                const alarms = await ReactNativeAN.getScheduledAlarms();
                let parseData = JSON.parse(data)
                console.log("android data open==" + parseData.data + "===" + JSON.stringify(data) + "== data" + data.data)
                console.log("androidopen==" + JSON.stringify(alarms))
                ReactNativeAN.stopAlarmSound();

            }
        );
        return () => {
            dismissSubscription;
            openedSubscription
        };
    }, [])

    const onPressCreateNote = async () => {
        //alert(route.params?.editData?.alarm_id)

        if (noteName.length === 0) {
            Alert.alert("Please enter note name")
            return;
        }
        if (description.length === 0) {
            Alert.alert("Please enter description.")
            return;
        }

       // if (comingType !== "add") {
            var mydate = moment(inPutdate).format("YYYY-MM-DD hh:mm a")
            var now = moment().format("YYYY-MM-DD hh:mm a");
            console.log("date differnce==", (now > mydate))
            if (now >= mydate) {
                alert("Sorry, You can't set past time in alarm!")
                return
            }
       // }

        if (comingType == "edit" && typeof route.params?.editData?.alarm_id !== "undefined" && route.params?.editData?.alarm_date !== null) {

            ReactNativeAN.deleteAlarm(parseFloat(route.params?.editData?.alarm_id));

        }
        let alarm;
        try {
            if (inPutdate !== null && inPutdate.length !== 0) {
                const alarmNotifData = {
                    title: noteName.trim(),
                    message: description.trim(),
                    channel: "my_channel_id",
                    small_icon: "ic_launcher",
                    has_button: true,
                    // You can add any additional data that is important for the notification
                    // It will be added to the PendingIntent along with the rest of the bundle.
                    // e.g.
                    data: { data: noteName }
                };
                console.log("alaram data==", alarmNotifData)
                //console.log("parse data==", ReactNativeAN.parseDate(date))


                alarm = await ReactNativeAN.scheduleAlarm({ ...alarmNotifData, fire_date: ReactNativeAN.parseDate(date) });
                console.log("alarm", alarm); // { id: 1 }
            }
            let formData = new FormData()

            if (comingType == "edit") {
                formData.append("id", route.params?.editData?.id)
            }


            formData.append("name", noteName)
            formData.append("description", description)
            formData.append("parent_id", rootFolder?.id)
            formData.append("created_at", createNoteDate === "" ? moment().format('yyyy-MM-DD HH:mm') : createNoteDate)
            formData.append("alarm_id", alarm?.id)
            formData.append("alarm_date", inPutdate)
            if (Object.keys(selectedFileObject).length !== 0) {
                // let object = selectedFileObject
                // var ext = selectedFileObject?.name.substr(selectedFileObject?.name.lastIndexOf('.') + 1);
     
                // //object.fileName = noteName + "." + ext
                // object.name = noteName + "." + ext
                formData.append("icon", selectedFileObject)
            }
            setselectedFileObject({})
            console.log("Response===", JSON.stringify(formData) + "==tokd== " + route.params?.user?.token)
            setLoading(true)
            AllGetPostRequestResponse.postRequestWithToken(formData, false, comingType == "edit" ? "updateText" : "/addText", route.params?.user?.token).then(async (response) => {
                // console.log("Responsedata===", JSON.stringify(response))
                if (response?.status) {
                    notifyMessage(response?.message)


                    setNoteName("")
                    setDesc("")
                    navigation.goBack();
                }
                setLoading(false)
            }).catch((error) => {
                setLoading(false)
                console.log("error==", JSON.stringify(error))
                console.log(error?.response?.data);
                //alert(error?.response?.data?.data)
            })
        } catch (e) {
            console.log("alaram error==", e)
        }
    };

    const handleFileSelection = async (inputval) => {
        try {
          const pickerResult = await DocumentPicker.pickSingle({
            presentationStyle: 'fullScreen',
            copyTo: 'cachesDirectory',
            type: [DocumentPicker.types.images]
          })
    
          console.log("file size ===", pickerResult.size / (1024 * 1024))
    
          let object = {
            name: pickerResult.name,
            size: pickerResult.size,
            type: pickerResult.type,
            uri: pickerResult.uri
          }
          setselectedFileObject(object)
          
        } catch (e) {
          handleError(e)
        }
      }

      const handleError = (err) => {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else if (isInProgress(err)) {
          console.warn('multiple pickers were opened, only the last will be considered')
        } else {
          throw err
        }
      }
    return (
        <View style={Styles.container}>
            {isLoading && <ActivityLoader isLoading={isLoading} />}
            {!isLoading && <View style={{marginTop:20}}>
              <TouchableOpacity style={Styles.FolderIcon}
                        onPress={() => { 
                            handleFileSelection()
                        }
                        }>
                            <Image
                                style={Styles.crossIcon}
                                source={Object.keys(selectedFileObject).length === 0 ? require('../assets/icons/add_icon.png'): selectedFileObject}
                            />
                            <Text>Notes Icon</Text>
                        </TouchableOpacity>
                    </View>}
            {!isLoading && <>
                <View style={Styles.inputView}>
                
                    <TextInput
                        style={Styles.inputText}
                        placeholder="Name"
                        value={noteName}
                        placeholderTextColor="#003f5c"
                        onChangeText={text => setNoteName(text)} />
                </View>
                <View style={[Styles.inputView, { height: 155 }]}>
                    <TextInput
                        style={Styles.inputMultiLineText}
                        placeholder="Notes Description"
                        value={description}
                        multiline={true}
                        textAlignVertical={'top'}
                        placeholderTextColor="#003f5c"
                        onChangeText={text => setDesc(text)} />
                </View>

                <View style={[Styles.inputView, { flexDirection: 'row', alignItems: 'center' }]}>
                    <TextInput
                        style={[Styles.inputText, { flex: 9, }]}
                        placeholder="Date and Time"
                        value={inPutdate}
                        editable={false}
                        placeholderTextColor="#003f5c"
                    />
                    {/* <Button title="Open" onPress={() => setOpen(true)} /> */}
                    <TouchableOpacity onPress={() => setOpen(true)} style={{ marginRight: 10, flex: 1 }} >
                        <FontAwesomeIcon style={Styles.addIcon} size={18} icon={faCalendar} />
                    </TouchableOpacity>

                </View>
                <View style={[Styles.inputView, { flexDirection: 'row', alignItems: 'center' }]}>
                    <TextInput
                        style={[Styles.inputText, { flex: 9, }]}
                        placeholder="Created Date and Time"
                        value={createNoteDate}
                        editable={false}
                        placeholderTextColor="#003f5c"
                    />
                    {/* <Button title="Open" onPress={() => setOpen(true)} /> */}
                    <TouchableOpacity onPress={() => setCreatedOpen(true)} style={{ marginRight: 10, flex: 1 }} >
                        <FontAwesomeIcon style={Styles.addIcon} size={18} icon={faCalendar} />
                    </TouchableOpacity>

                </View>
                <DatePicker
                    modal
                    open={open}
                    date={date}
                   

                    mode= {mode}
                    theme={'dark'}
                    title="Select date and time"
                    onConfirm={(date) => {
                        console.log("date is ===" + date)
                        setOpen(false)
                        setInputDate(moment(date).format('yyyy-MM-DD HH:mm'))
                        setDate(date)
                        if(mode == "date"){
                            setMode("time")
                        }else{
                            setMode("date")
                          
                        }
                       
                       
                       
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />
                <DatePicker
                    modal
                    open={createdopen}
                    date={new Date()}
                    //minimumDate={moment()}

                    mode="datetime"
                    theme={'dark'}
                    title="Select created date and time"
                    onConfirm={(date) => {
                        console.log("date is ===" + date)
                        setCreatedOpen(false)
                        setCreateNoteDate(moment(date).format('YYYY-MM-DD HH:mm'))
                        //setDate(date)
                    }}
                    onCancel={() => {
                        setCreatedOpen(false)
                    }}
                />
                <TouchableOpacity
                    onPress={onPressCreateNote}
                    style={Styles.loginBtn}>
                    <Text style={Styles.loginText}>{comingType == "add" ? "Create Note" : "Update Note"}</Text>
                </TouchableOpacity>
            </>}
        </View>
    );
}

export default CreateNotesScreen;