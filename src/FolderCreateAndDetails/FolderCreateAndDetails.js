import React, { useEffect, useState,useRef } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  PermissionsAndroid,
  Image,
  Platform,
  Modal,
  Alert,
  Share,
  BackHandler,
  Clipboard,
  AppState
} from "react-native"
import Styles from "./Style";
import DocumentPicker, {
  isInProgress,
} from 'react-native-document-picker'
import CreateFolderPopup from '../CreateFolderModal/CreateFolderPopup';
import UploadFilePopup from '../UploadFileModal/UploadFileModal';
import { createAlert, downloadImage, notifyMessage } from '../Utils/Utility';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFolderPlus, faPen, faCopy, faTrash, faFileUpload, faShare, faVideo, faNoteSticky, faFilePdf, faFileExcel, faFileWord, faFileAudio, faClockFour, faPlayCircle,faStopCircle,faShareSquare, faDownload, faPauseCircle } from '@fortawesome/free-solid-svg-icons'
import { AllGetPostRequestResponse } from "../Api/AllGetPostApi"
import ActivityLoader from '../Loader/ActivityLoader';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import { SliderBox } from '../Components/SliderBox/SliderBox';
//import { SliderBox } from "react-native-image-slider-box";
import ReactNativeAN from 'react-native-alarm-notification';
import DeviceInfo from "react-native-device-info";
import {start,stop} from "./../MediaPlayer/mediaPlayer"
import MyPDFViewer from '../Utils/MyPdfViewer';
var sliderCurrentItem=-1
export default folderCreateDetail = ({ navigation, routdata }) => {
  const route = useRoute();
  const [searchItem, setSeachItem] = useState("")
  const [resources, setResources] = useState([])
  const [files, setFiles] = useState([])
  const [masterDataFiles, setMasterDataFiles] = useState([]);
  const [selectedFiles, SetSelectedFiles] = useState([])
  const [createFolderPopupShowed, setCreatePopupShowed] = useState(false)
  const [editFolderPopupShowed, setEditFolderPopupShowed] = useState(false)
  const [uploadFileModalVisible, setuploadFileModalVisible] = useState(false)
  const [selectedFileObject, setselectedFileObject] = useState({})
  const [isModalVisible, toggleModalVisibility] = useState(false)
  const [isLoading, setLoading] = useState(false);
  const [currentRootFolder, setCurrentRootFolder] = useState(route.params?.data);
  const [page, setPage] = useState(1);
  const [sliderUrl, setSliderUrl] = useState(null)
  const [editFileModalVisible, setEditFileModalVisible] = useState(false)
  const [editFile, setEditFile] = useState(null)
  const [sliderArray, setSliderAray] = useState([])
  const [sliderArrayVideo, setSliderArrayVideo] = useState([])
  const [currentImageIndx, setCurrentImageIndex] = useState(0)
  //const [sliderCurrentItem, setSliderCurrentItemIndex] = useState(-1)
   const [sliderType, setSliderType] = useState("image")
   const appState = useRef(AppState.currentState);
   const [appStateVisible, setAppStateVisible] = useState(appState.current);
   const [mediaPlayIndex, setmediaPlayIndex] = useState(-1)
   const [showPdfViewer, setshowPdfViewer] = useState("")
   useEffect(() => {
     const subscription = AppState.addEventListener('change', nextAppState => {
       if (
         appState.current.match(/inactive|background/) &&
         nextAppState === 'active'
       ) {
         console.log('App has come to the foreground!');
       }
 
       appState.current = nextAppState;
       setAppStateVisible(appState.current);
       console.log('AppState', appState.current);
     });
 
     return () => {
      sliderCurrentItem= -1
        setmediaPlayIndex(-1)
       stop()
       subscription.remove();
      };
    }, []);

    useEffect(() => {

      if(appStateVisible === "background"){
        stop()
        setmediaPlayIndex(-1)
      }

    },[appStateVisible])
  useEffect(() => {
    let navFocusListener = navigation.addListener('focus', () => {
      // do some API calls here
      
      getFolderData()
      getFileListing()
    });

    const backAction = () => {
      //alert(route.name)
      if (route.name == "folderCreate") {
        navigation.goBack()
        //alert("ss")
        stop()
        setmediaPlayIndex(-1)
      }

      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    // getFolderData()
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
      backHandler.remove();

    };

  }, [navigation])

  useEffect(() => {
    if(isLoading){
      navigation.setOptions({headerRight:null});
    }else{
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row', }}>
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {!isLoading && navigation.navigate('Reminder', { "data": currentRootFolder,
             "user": route.params.user, "coming": "add" })}}>
              <FontAwesomeIcon style={Styles.addIcon} size={25} icon={faNoteSticky} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {!isLoading && setuploadFileModalVisible(true)}}>
              <FontAwesomeIcon style={Styles.addIcon} size={25} icon={faFileUpload} />
            </TouchableOpacity>
  
            <TouchableOpacity onPress={() => {!isLoading && setCreatePopupShowed(true)}}>
              <FontAwesomeIcon style={Styles.addIcon} size={25} icon={faFolderPlus} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() =>  {if(!isLoading){setEditFolderPopupShowed(!editFolderPopupShowed) } }}>
              <FontAwesomeIcon style={Styles.addIcon} size={25} icon={faPen} />
            </TouchableOpacity>
  
          </View>
        ),
        title: "DB Security"     //currentRootFolder?.name
        });
     
    }
   

    
   

  }, [isLoading])

  // useEffect(()=>{
  //  console.log("slider array length", sliderArray.length)
  // }, [sliderArray])

  const renderListData = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 70,
          alignSelf: 'center',
          justifyContent: 'center',
          marginTop: 20
        }}>
        <FlatList
          horizontal
          style={Styles.list}
          data={resources}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => {
              navigation.push("folderCreate", { "data": item, "user": route.params.user })
            }}>
              {listItem(item, index)}
            </TouchableOpacity>
          )}
          keyExtractor={item => item.name}
        />
      </View>

    )
  }
  const listItem = (item, index) => {

    console.log("slider_array_item==",JSON.stringify(item))
    return (
      <View style={Styles.listItem}>
        <View style={Styles.galleryIconView}>
          <Image
            style={Styles.galleryLogo}
            source={(typeof item?.icon !== "undefined" && item?.icon !== "")  ?{uri:item?.icon}:require('../assets/icons/gallery.png')}
          />
        </View>
        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={Styles.itemText}>
          {item.name}
        </Text>
        <View style={Styles.editdeleteview}>
          {/* <TouchableOpacity onPress={() => alert("In Progress...")}>
            <FontAwesomeIcon style={Styles.editDelete} size={15}  icon={faPen} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => {
            Alert.alert("Delete", "Are you sure you want to delete this item", [
              {
                text: 'OK', onPress: () => {
                  deleteFolderApiRequest(item.id, index)
                }
              },
              {
                text: 'Cancel', onPress: () => {

                }
              },
            ]);
          }
          }>
            <FontAwesomeIcon style={[Styles.editDelete]} size={15} icon={faTrash} />
          </TouchableOpacity>

        </View>

      </View>
    )
  }

  const updateSliderArray = async (item) => {
    //check if the extension matches list 
    if (checkImage(item.name)) {
      setSliderType("image")
      //http://workathome.divasdoor.com/files/71/Hh.jpg
      const itemIndex = await sliderArray.findIndex(ob => ob == item.file_url)
      console.log("Slider_Box array==", sliderArray.length, item.file_url, itemIndex)
      if (itemIndex >= 0) {
        sliderCurrentItem = parseInt(itemIndex);
       // setSliderCurrentItemIndex(itemIndex)
        console.log("Slider_Box slider sliderCurrentItem==", sliderArray,sliderCurrentItem)
        setTimeout(()=>{
          toggleModalVisibility(!isModalVisible)
        }, 500)
        
      }

    } else if (checkVideoExtension(item.name)) {
      setSliderType("video")
      let itemIndex = sliderArrayVideo.findIndex(ob => ob == item.file_url)
      console.log("slider array==", sliderArrayVideo.length, item.file_url, itemIndex)
      if (itemIndex >= 0) {
        sliderCurrentItem= parseInt(itemIndex);
       // setSliderCurrentItemIndex(itemIndex)
        console.log("slider sliderCurrentItem==", sliderArrayVideo,sliderCurrentItem)
        setTimeout(()=>{
          toggleModalVisibility(!isModalVisible)
        }, 500)
        
      }
    }
  }

  const renderListDataVertical = () => {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,

          alignSelf: 'center',
          justifyContent: 'center',
          marginTop: 0
        }}>
        <FlatList
          style={Styles.list}
          data={files}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => {
              updateSliderArray(item)
            }

            }>
              {listItemvertical(item, index)}
            </TouchableOpacity>

          )}
          keyExtractor={item => item.id}
        />
      </View>

    )
  }

  const checkImage = (name) => {
    var types = ['jpg', 'jpeg', 'tiff', 'png', 'gif', 'bmp', 'svg'];

    //split the url into parts that has dots before them
    var parts = name.split('.');
    //get the last part 
    var extension = parts[parts.length - 1];
    if (types.indexOf(extension) !== -1) {
      return true
    }
    return false;
  }

  const checkVideoExtension = (name) => {
    var types = ['mp4', 'mov', 'webm'];

    //split the url into parts that has dots before them
    var parts = name.split('.');
    //get the last part 
    var extension = parts[parts.length - 1];
    if (types.indexOf(extension) !== -1) {
      return true
    }
    return false;
  }

  const checkTypeExtension = (fileName)=> {
    var parts = fileName.split('.');
    console.log("parts image==", parts)
    switch (parts[2]){
      
      case 'doc':
        return 1;
  
        case 'pdf':
          return 2;
  
        case 'txt':
          return 3;
  
       case 'docx':
       case 'DOC':
       case 'word':
          return 4;
  
        case 'mp3':
        case 'mp4': 
        case 'wav': 
        case 'aac':
          case '3gpp':
          return 5;
  
        case 'xls':
        case 'xlsx':
        case 'xl':
        case 'xlsm':            
        case 'excel':
        case 'xml':
          return 6;
        case 'zip':
          case 'Zip':
            case 'RAR':
              case 'RAR4':
            return 7;
        default :
        return 8;
  
    }
   }

  const checkFileExtension = (fileName)=> {
    var parts = fileName.split('.');
    console.log("parts image==", parts[1])
    switch (parts[1]){
      
      case 'doc':
        return require('../assets/icons/docs.png');
  
        case 'pdf':
          return require('../assets/icons/pdf.png');
  
        case 'txt':
          return require('../assets/icons/file.png');
  
       case 'docx':
       case 'DOC':
       case 'word':
          return require('../assets/icons/docs.png');
  
        case 'mp3':
        case 'mp4': 
        case 'wav': 
        case 'aac':
          case '3gpp':
          return require('../assets/icons/music.png');
  
        case 'xls':
        case 'xlsx':
        case 'xl':
        case 'xlsm':            
        case 'excel':
        case 'xml':
          return require('../assets/icons/xcel.png');
        case 'zip':
          case 'Zip':
            case 'RAR':
              case 'RAR4':
            return require('../assets/icons/zip.png');
        default :
        return require('../assets/icons/gallery.png');
  
    }
   }

   const mediaCallback = async (callback) => {
   // alert(JSON.stringify(callback))
    if(callback.state == "stopped"){
      setmediaPlayIndex(-1)
    }
   }

  
  const showPdf = async (url) => {
   //setshowPdfViewer(url)
   navigation.navigate("MyPDFViewer", { "url": url }) 
  };

  const listItemvertical = (item, index) => {
    return (
      item.description == null ?
        <View style={[Styles.listItemVertical, { marginTop: 20, height: 95 }]}>
          <View style={Styles.galleryIconView}>

           
{ (checkImage(item.name) || checkVideoExtension(item.name)) ? 
 <Image
     style={Styles.galleryLogoFileImage}
      source={(typeof item?.icon !== "undefined" && item?.icon !== "")  ?{uri:item?.icon} :
        item.file_url !== "" ? (checkImage(item.name) ?
      { uri: item.file_url } : checkVideoExtension(item.name) 
     ? require('../assets/icons/videothumb.png') : 
     require('../assets/icons/gallery.png')) :
      require('../assets/icons/gallery.png')
    
    }
   />:
   <TouchableOpacity onPress={()=> {
    const array = item?.file_url.split('.');
    
    array[2] === "pdf" ? showPdf(item?.file_url.replace(" ","")): null}}>
   <Image
     style={[Styles.galleryLogoFileImage,{resizeMode:"center",borderRadius:0}]}
     source={checkFileExtension(item?.name)}
   />
</TouchableOpacity>
   // <FontAwesomeIcon style={Styles.galleryLogoFileImage} size={50}
   //  icon={checkFileExtension(item?.name)}  />  
}
<Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ fontSize: 10,marginStart:10}}>
                {moment(item.created_at).format('DD-MM-YYYY')}
              </Text>
 </View>
          <View style={{ flex: 6 }}>
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[Styles.itemText]}>
              {item.name}
            </Text>

          </View>
          <View style={[Styles.forwardarrowView]}>
          <View style={[Styles.forwardarrowView,{flexDirection:"column",justifyContent:"space-around",
    }]}>
            <TouchableOpacity onPress={() => checkPermission(item.file_url)}>
            <FontAwesomeIcon style={[Styles.editDelete]} size={20} icon={faDownload} />
            </TouchableOpacity>
            {<TouchableOpacity onPress={async() => await onShare(item?.file_url.replace(" ", ""))}>
              <FontAwesomeIcon style={[Styles.editDelete]} size={20} icon={faShareSquare} />
            </TouchableOpacity>}
            </View>
            <View style={[Styles.forwardarrowView,{flexDirection:"column",justifyContent:"space-around",marginStart:15,
    }]}>
              <TouchableOpacity onPress={() => {
                setEditFile(item)
                setEditFileModalVisible(!editFileModalVisible)
              }}>
                <FontAwesomeIcon style={Styles.editDelete} size={20} icon={faPen} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                Alert.alert("Delete", "Are you sure you want to delete this item", [
                  {
                    text: 'OK', onPress: () => {
                      deleteFileApiRequest(item.id, index)
                    }
                  },
                  {
                    text: 'Cancel', onPress: () => {

                    }
                  },
                ]);

              }}>
                {/* <Image
                style={[Styles.editDelete, { marginTop: 20 }]}
                source={require('../assets/icons/delete.png')}
              /> */}
                <FontAwesomeIcon style={[Styles.editDelete]} size={20} icon={faTrash} />
              </TouchableOpacity>
              { checkTypeExtension(item?.file_url) == 5 ?
              <TouchableOpacity onPress={() => {
                if(mediaPlayIndex === -1 || mediaPlayIndex !== index){
                  start(item?.file_url,mediaCallback)
                  setmediaPlayIndex(index)
                }
              
                else{
                  stop()
                  setmediaPlayIndex(-1)
                }
                
                
              }}>
                <FontAwesomeIcon style={Styles.editDelete} size={20} icon={index === mediaPlayIndex ? faPauseCircle:faPlayCircle} />
              </TouchableOpacity>:null}
              
            </View>
          </View>

        </View>
        : <View style={[Styles.listItemVerticalAlarm, { marginTop: 20, paddingTop:10, paddingBottom:10,}]}>
          <View style={[Styles.galleryIconView,{flexDirection:"column",marginStart:10}]}>
           {item?.icon === ""? <FontAwesomeIcon style={Styles.galleryLogoFileImage} size={50} icon={faClockFour} color={"#880808"} /> :
           <Image
           style={Styles.galleryLogoFileImage}
           source={{uri:item?.icon}}
         />
           }
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ fontSize: 10, marginTop: 7 }}>
                {item.created_at !== null? moment(item.created_at ).format('DD-MM-YYYY'): "N/A"}
              </Text>
          </View>
          <View style={{ flex: 6 }}>
            <Text  numberOfLines={1} style={[Styles.itemText, { fontWeight: "bold" }]}>
              {item.name}
            </Text>
            <Text   style={[Styles.itemText, { fontSize: 12 }]}>
              {item.description}
            </Text>
            <Text  numberOfLines={1} style={[Styles.itemText,{fontSize:12}]}>
              {(item.alarm_date !== null && item.alarm_date !== "null") ? "Reminder -"+ moment(item.alarm_date).format('DD-MM-YYYY hh:mm a') : "Alarm N/A"}
            </Text>

          </View>
          <View style={Styles.forwardarrowView}>
              <View style={{alignSelf:"center"}}>
                <TouchableOpacity style={{marginRight:10}} onPress={() => {
                  Clipboard.setString(item.name+'\n'+item.description);
                }}>
                <FontAwesomeIcon style={Styles.editDelete} size={20} icon={faCopy} />
                </TouchableOpacity>
              </View>
            <View style={[Styles.editdeleteview, { marginLeft: 10 }]}>
              <TouchableOpacity onPress={() => {
                navigation.navigate('Reminder', { "data": currentRootFolder, "user": route.params.user, "coming": "edit", "editData": item })
              }}>
                <FontAwesomeIcon style={Styles.editDelete} size={15} icon={faPen} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
              
                Alert.alert("Delete", "Are you sure you want to delete this item", [
                  {
                    text: 'OK', onPress: () => {
                      if(item?.alarm_id !== "undefined" && item?.alarm_date !== null) {
                        ReactNativeAN.deleteAlarm(parseFloat(item?.alarm_id))
                      }
                     
                      deleteFileApiRequest(item.id, index)
                    }
                  },
                  {
                    text: 'Cancel', onPress: () => {

                    }
                  },
                ]);

              }}>
                
                <FontAwesomeIcon style={[Styles.editDelete, { marginTop: 20 }]} size={15} icon={faTrash} />
              </TouchableOpacity>
              
            </View>
           
          </View>
          
        </View>

    )

  }
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = files.filter(
        function (item) {
          // Applying filter for the inserted text in search bar
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      );
      setFiles(newData);
      setSeachItem(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      //getFolderData();
      setFiles(masterDataFiles);
      setSeachItem(text);
    }
  };
  const SearchContainer = () => {
    return (
      <View style={Styles.searchContainer}>
        {renderSearch()}
        <View style={Styles.searchIconView}>
          <Image
            style={Styles.searchLogo}
            source={require('../assets/icons/search.png')}
          />
        </View>
      </View>
    )
  }
  const renderSearch = () => {
    return (
      <TextInput
        style={Styles.searchInput}
        placeholder="Search for files..."
        onChangeText={text => searchFilterFunction(text)}
        value={searchItem}
      />
    );
  };



  const handleError = (err) => {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  }
  const handleFileSelection = async (inputval) => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.images, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.plainText, DocumentPicker.types.docx,DocumentPicker.types.doc, DocumentPicker.types.zip, DocumentPicker.types.video, DocumentPicker.types.audio]
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
  const handleFileSelectionEditFile = async (inputval) => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        
        copyTo: 'cachesDirectory',
        type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.images, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.plainText, DocumentPicker.types.docx,DocumentPicker.types.doc, DocumentPicker.types.zip, DocumentPicker.types.video, DocumentPicker.types.audio]
      })
      console.log("file size ===", pickerResult.size / (1024 * 1024))
      // if ((pickerResult.size / (1024 * 1024)) > 15) {
      //   alert("Please select file size of less than 15MB")
      //   return
      // }
      let object = {
        name: pickerResult.name,
        size: pickerResult.size,
        type: pickerResult.type,
        uri: pickerResult.uri,
      }
      setselectedFileObject(object)

    } catch (e) {
      handleError(e)
    }
  }
  


  const checkPermission = async (imageUrl) => {

    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'android') {
     
   
      try {
        if (DeviceInfo.getSystemVersion() >= 13) {
          downloadImage(imageUrl, navigation);
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,

            {
              title: 'Storage Permission Required',
              message:
                'App needs access to your storage to download Photos',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Once user grant the permission start downloading
            console.log('Storage Permission Granted.');
            downloadImage(imageUrl, navigation);
          } else {
            // If permission denied then show alert
            alert('Storage Permission Not Granted');

          }
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }

    }

  };

  const onShare = async (url) => {
   
    const title = 'DbSecurity App Content';
    const message = 'Please check this out.';
    
    try {
      const result = await Share.share({
        message:  `${message} ${url.replace(" ", "")}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared scuccessfully activity")
          // shared with activity type of result.activityType
        } else {
          console.log("Shared scuccessfully shared")
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      //alert(error.message);
    }
  };
 
  const showModalImage = (image) => {
    return (
      <Modal animationType="slide"
        transparent visible={isModalVisible}
        presentationStyle="overFullScreen"
        onRequestClose={() => toggleModalVisibility(false)}
        onDismiss={toggleModalVisibility}>
        <View style={Styles.viewWrapper}>

          <View style={Styles.modalView}>

            {sliderCurrentItem > -1 && <SliderBox
              images={ sliderType=="image"? sliderArray: sliderArrayVideo}
              // sliderBoxHeight= {300}
              
            //   resizeMethod={'resize'}
            //  resizeMode={'cover'}
              //resizeMode='center'
              //resizeMode='contain'
              firstItem={sliderCurrentItem}
              currentImageEmitter={index => {
                console.log("image index==" + index)
                //setCurrentImageIndex(index)
              }

              }
              onCurrentImagePressed={index =>
                console.log(`image ${index} pressed`)
              }
             
              dotStyle={{ display: 'none' }}
              ImageComponentStyle={Styles.bigImageLogo}
              videoPlayArray = {[true, true, true, true, true, true, true, true, true, true]}
            />}
            
            <View style={Styles.crossView}>
              <TouchableOpacity style={{ marginRight: 10 }} onPress={async () => await onShare(sliderType=="image"? sliderArray[sliderCurrentItem]:sliderArrayVideo[sliderCurrentItem])}>
                <FontAwesomeIcon style={Styles.addIcon} size={18} icon={faShare} color={"#880808"} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => checkPermission(sliderArray[sliderCurrentItem])}>
                <Image
                  style={[Styles.crossIcon, { marginRight: 10, tintColor: '#880808' }]}
                  source={require('../assets/icons/download.png')}

                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                toggleModalVisibility(!isModalVisible)
                // setSliderAray([])
                setCurrentImageIndex(0)
                sliderCurrentItem= -1
                //setSliderCurrentItemIndex(-1)
              }
              }>
                <Image
                  style={[Styles.crossIcon, { tintColor: '#880808' }]}
                  source={require('../assets/icons/cross.png')}
                />
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

    )
  }

  const getFolderData = () => {
    setLoading(true)
    console.log("currentRootFolder?.id",route?.params?.user?.token, "/folderListing?parent_id=" + currentRootFolder?.id)
    AllGetPostRequestResponse.getRequest(route?.params?.user?.token, false, "/folderListing?parent_id=" + currentRootFolder?.id).then((response) => {
      console.log("currentRootFolder?.data" ,JSON.stringify(response))
      if (response?.status) {
        if (response.data.length > 0) {
          setResources(response.data)
        }
      }
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      console.log("error==", err)
    })
  }

  const getFileListing = () => {
    // route.params.user.token
    setLoading(true)
    let path = "/fileListing?parent_id=" + currentRootFolder?.id + "&page=" + page + "&pagination=70"
    AllGetPostRequestResponse.getRequest(route.params.user.token, false, path).then((response) => {
      console.log('File listing response===' + JSON.stringify(response))
      setLoading(false)
      if (response?.status) {
        if (response.data && response.data.data.length > 0) {
          setFiles(response.data.data)
          setMasterDataFiles(response.data.data)
          let arr = [];
          response.data.data.map((data) => {
            if ((checkImage(data.name))) {
              arr.push(data.file_url)
            }
          })
          setSliderAray([...arr])

          let arrVideo = [];
          response.data.data.map((data) => {
            if ((checkVideoExtension(data.name))) {
              arrVideo.push(data.file_url)
            }
          })
          setSliderArrayVideo([...arrVideo])
          console.log("video==",arrVideo)
        } else {
          setFiles([])
        }
      }
    }).catch((err) => {
      setLoading(false)
      console.log("error==", err)
    })
  }

  const createFolderApiRequest = (folderName) => {
    setLoading(true)
    let formdata = new FormData()
    formdata.append("name", folderName.trim())
    formdata.append("parent_id", currentRootFolder?.id)
    if (Object.keys(selectedFileObject).length !== 0) {
      let object = selectedFileObject
      var ext = selectedFileObject?.name.substr(selectedFileObject?.name.lastIndexOf('.') + 1);
     
      object.fileName = folderName + "." + ext
      object.name = folderName + "." + ext
      formdata.append("image", object)
    }
    setselectedFileObject({})
    AllGetPostRequestResponse.postRequestWithToken(formdata, false, "/addFolder", route.params?.user?.token).then((response) => {
      if (response?.status) {
        notifyMessage(response?.message)
        getFolderData();
      }
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      console.log("error==", err)
    })
  }

  const editFolderApiRequest = (folderName, folderid) => {
    setLoading(true)
    let formdata = new FormData()
    formdata.append("name", folderName.trim())
    formdata.append("id", folderid)
    if (Object.keys(selectedFileObject).length !== 0) {
      let object = selectedFileObject
      var ext = selectedFileObject?.name.substr(selectedFileObject?.name.lastIndexOf('.') + 1);
     
      object.fileName = folderName + "." + ext
      object.name = folderName + "." + ext
      formdata.append("image", object)
    }
    setselectedFileObject({})
    AllGetPostRequestResponse.postRequestWithToken(formdata, false, "/updateFolder", route.params?.user?.token).then((response) => {
      if (response?.status) {
        notifyMessage(response?.message)
        currentRootFolder['name'] = folderName.trim()
        setCurrentRootFolder(currentRootFolder)
        navigation.setOptions({
          title: folderName.trim()
        })
        getFolderData();

      }
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      console.log("error==", err)
    })
  }

  const deleteFolderApiRequest = (folderid, index) => {
    setLoading(true)
    let formdata = new FormData()
    formdata.append("id", folderid)
    AllGetPostRequestResponse.postRequestWithToken(formdata, false, "/deleteFolder", route.params?.user?.token).then((response) => {
      setLoading(false)
      if (response?.status) {
        notifyMessage(response?.message)
        let arr = [...resources]
        arr.splice(index, 1)
        setResources([...arr])
      }

    }).catch((err) => {
      setLoading(false)
      console.log("error==", err)
    })
  }
  const uploadFile = (object) => {
    setLoading(true)
    // selectedFileObject['name'] = fileName
    let formdata = new FormData()
    formdata.append("parent_id", currentRootFolder?.id)
    formdata.append("file", object)
    console.log("edit api request===", formdata, "== token ===" + route.params?.user?.token + " file object ==" + JSON.stringify(object))
    AllGetPostRequestResponse.postRequestWithToken(formdata, false, "/addFile", route.params?.user?.token).then((response) => {
      setLoading(false)
      if (response?.status) {
        notifyMessage(response?.message)
        getFileListing()
        setselectedFileObject({})
      }


    }).catch((error) => {
      setLoading(false)
      // console.log("error==", JSON.stringify(error))
      // console.log("error data ===", error?.response?.data);
      notifyMessage("Something went wrong! Please try again.")
      // console.log(error.response.status);  
      // console.log(error.response.headers); 
    })
  }

  const updateFile = (object, id, fileStatus) => {
    setLoading(true)
    // selectedFileObject['name'] = fileName
    let formdata = new FormData()
    formdata.append("file_id", id)
    if (fileStatus) {
      formdata.append("file", object)
    }
    formdata.append("name", object.name)
    console.log("edit api request===", formdata, "== token ===" + route.params?.user?.token + " file object ==" + JSON.stringify(object))
    AllGetPostRequestResponse.postRequestWithToken(formdata, false, "/updateFile", route.params?.user?.token).then((response) => {
      setLoading(false)
      if (response?.status) {
        notifyMessage(response?.message)
        setEditFile(null)
        getFileListing()
      }
    }).catch((error) => {
      setLoading(false)
      console.log("error==", JSON.stringify(error))
      console.log("error data ===", error?.response?.data);
      notifyMessage(error?.response?.data?.message)
      setEditFile(null)
      getFileListing()
    })
  }
  const deleteFileApiRequest = (fileId, index) => {
    setLoading(true)
    let formdata = new FormData()
    formdata.append("id", fileId)
    AllGetPostRequestResponse.postRequestWithToken(formdata, false, "/deleteFile", route.params?.user?.token).then((response) => {
      setLoading(false)
      if (response?.status) {
        notifyMessage(response?.message)
        let arr = [...files]
        arr.splice(index, 1)
        setFiles([...arr])
      }

    }).catch((err) => {
      setLoading(false)
      console.log("error==", err)
    })
  }
  return (
    <View style={Styles.container}>
      { <>
        {showPdfViewer  !== "" && <MyPDFViewer url={showPdfViewer}>
          </MyPDFViewer>}
        {/* {selectedFiles.length > 0 ? renderListDataSelectedFiles() : <Text style={[Styles.titleText, { color: "green", fontSize: 14 }]}>{"Please select file from + icon on header"}</Text>} */}
        {/* {resources.length > 0 && <Text style={[Styles.titleText, { marginTop: 20 }]}>{"Dummy Folders"}</Text>} */}
        {resources.length > 0 && renderListData()}
        {/* <Text style={[Styles.titleText, { marginTop: 20 }]}>{""}</Text> */}
        {SearchContainer()}
        {/* <Text style={[Styles.titleText, { marginTop: 20, fontSize: 12, textAlign: 'right', textAlignVertical: 'center' }]}>{"Select file(s) to download"}</Text> */}
        {renderListDataVertical()}
        {createFolderPopupShowed &&
          <CreateFolderPopup
          text={"Create"}
            togglePopUpVisibility={(value, folderName) => {
              setCreatePopupShowed(value)
              setselectedFileObject({})
              { folderName && createFolderApiRequest(folderName) }
            }}
            handleFileSelection={(input) => handleFileSelection(input)}
            
            uploadSelectedFile={(value) => {
              // let arr = [...selectedFiles]
              let object = selectedFileObject
              console.log("file name===", JSON.stringify(selectedFileObject))
              if (value.length === 0) {
                alert("Please enter file name to update")
                return
              }
              let file = false
              if (Object.keys(selectedFileObject).length === 0 && value.length > 0) {
                file = false;
                var ext = editFile?.name?.substr(editFile?.name?.lastIndexOf('.') + 1);
                object.fileName = value + "." + ext
                object.name = value + "." + ext
              } else {
                file = true
                var ext = selectedFileObject?.name?.substr(selectedFileObject?.name?.lastIndexOf('.') + 1);
                if (selectedFileObject?.type.includes('vnd.ms-excel')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                } else if (selectedFileObject?.type.includes('msword')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                } else if (selectedFileObject?.type.includes('text/plain')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                } else if (selectedFileObject?.type.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                }
                else {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                }

                console.log("selected file object===", JSON.stringify(selectedFileObject))
                // arr.push(object)
                //SetSelectedFiles([...arr])
                // return
              }
              setselectedFileObject({})
              setEditFileModalVisible(false)
              { Object.keys(selectedFileObject).length && updateFile(object, editFile.id, file) }
            }}
            visible={createFolderPopupShowed}
          
          />}
        {editFolderPopupShowed &&
          <CreateFolderPopup
            text={"Update"}
            togglePopUpVisibility={(value, folderName) => {
              setEditFolderPopupShowed(value)
              if( (folderName.trim() !== currentRootFolder.name || Object.keys(selectedFileObject).length > 0)) {

                editFolderApiRequest(folderName, currentRootFolder?.id)
              }
            }}
            visible={editFolderPopupShowed}
            foldername={currentRootFolder?.name}
           
            handleFileSelection={(input) => handleFileSelectionEditFile(input)}
            uploadSelectedFile={(value) => {
              // let arr = [...selectedFiles]
              let object = selectedFileObject
              console.log("file name===", JSON.stringify(selectedFileObject))
              if (value.length === 0) {
                alert("Please enter file name to update")
                return
              }
              let file = false
              if (Object.keys(selectedFileObject).length === 0 && value.length > 0) {
                file = false;
                var ext = editFile?.name?.substr(editFile?.name?.lastIndexOf('.') + 1);
                object.fileName = value + "." + ext
                object.name = value + "." + ext
              } else {
                file = true
                var ext = selectedFileObject?.name?.substr(selectedFileObject?.name?.lastIndexOf('.') + 1);
                if (selectedFileObject?.type.includes('vnd.ms-excel')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                } else if (selectedFileObject?.type.includes('msword')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                } else if (selectedFileObject?.type.includes('text/plain')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                } else if (selectedFileObject?.type.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                }
                else {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                }

                console.log("selected file object===", JSON.stringify(selectedFileObject))
                // arr.push(object)
                //SetSelectedFiles([...arr])
                // return
              }
              setselectedFileObject({})
              setEditFileModalVisible(false)
              { Object.keys(selectedFileObject).length && updateFile(object, editFile.id, file) }
            }}
          />}

        {uploadFileModalVisible &&
          <UploadFilePopup
            togglePopUpVisibility={(value) => {
              setselectedFileObject({})
              setuploadFileModalVisible(value)
            }}
            visible={uploadFileModalVisible}
            handleFileSelection={(input) => handleFileSelection(input)}
            selectedFileObject={selectedFileObject}
            uploadSelectedFile={(value) => {
              // let arr = [...selectedFiles]
              let object = selectedFileObject
              var ext = selectedFileObject?.name.substr(selectedFileObject?.name.lastIndexOf('.') + 1);
              if (selectedFileObject?.type.includes('vnd.ms-excel')) {
                object.fileName = value + "." + ext
                object.name = value + "." + ext
              } else if (selectedFileObject?.type.includes('msword')) {
                object.fileName = value + "." + ext
                object.name = value + "." + ext
              } else if (selectedFileObject?.type.includes('text/plain')) {
                object.fileName = value + "." + ext
                object.name = value + "." + ext
              } else if (selectedFileObject?.type.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                object.fileName = value + "." + ext
                object.name = value + "." + ext
              }
              else {
                object.fileName = value + "." + ext
                object.name = value + "." + ext
              }

              console.log("selected file object===", JSON.stringify(selectedFileObject))
              // arr.push(object)
              //SetSelectedFiles([...arr])
              // return
              setselectedFileObject({})
              setuploadFileModalVisible(false)
              { Object.keys(selectedFileObject).length && uploadFile(object) }
            }}
          />}

        {editFileModalVisible &&
          <UploadFilePopup
            togglePopUpVisibility={(value) => {
              setEditFileModalVisible(value)
              setselectedFileObject({})
            }}
            visible={editFileModalVisible}
            handleFileSelection={(input) => handleFileSelectionEditFile(input)}
            fileName={editFile.name}
            uploadSelectedFile={(value) => {
              // let arr = [...selectedFiles]
              let object = selectedFileObject
              console.log("file name===", JSON.stringify(selectedFileObject))
              if (value.length === 0) {
                alert("Please enter file name to update")
                return
              }
              let file = false
              if (Object.keys(selectedFileObject).length === 0 && value.length > 0) {
                file = false;
                var ext = editFile?.name?.substr(editFile?.name?.lastIndexOf('.') + 1);
                object.fileName = value + "." + ext
                object.name = value + "." + ext
              } else {
                file = true
                var ext = selectedFileObject?.name?.substr(selectedFileObject?.name?.lastIndexOf('.') + 1);
                if (selectedFileObject?.type.includes('vnd.ms-excel')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                } else if (selectedFileObject?.type.includes('msword')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                } else if (selectedFileObject?.type.includes('text/plain')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                } else if (selectedFileObject?.type.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                }
                else {
                  object.fileName = value + "." + ext
                  object.name = value + "." + ext
                }

                console.log("selected file object===", JSON.stringify(selectedFileObject))
                // arr.push(object)
                //SetSelectedFiles([...arr])
                // return
              }
              setselectedFileObject({})
              setEditFileModalVisible(false)
              { Object.keys(selectedFileObject).length && updateFile(object, editFile.id, file) }
            }}
          />}

        {(isModalVisible && sliderCurrentItem>-1) && showModalImage(sliderUrl)}
      </>}
      {isLoading && <ActivityLoader isLoading={isLoading} />}
    </View>
  )
}