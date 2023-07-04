import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    BackHandler
} from "react-native"
import DocumentPicker, {
    isInProgress,
  } from 'react-native-document-picker'
import { CommonActions,NavigationActions, StackActions } from '@react-navigation/native';
import Styles from "./Style";
import CreateFolderPopup from '../CreateFolderModal/CreateFolderPopup';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFolderPlus, faPen, faTrash, faNoteSticky, faL } from '@fortawesome/free-solid-svg-icons'
// import FingerprintScanner from 'react-native-fingerprint-scanner';
// import FingerprintPopup from '../FingerPrintPopup/FingerPrintPopup';
// import { CommonActions } from '@react-navigation/native';
import { AllGetPostRequestResponse } from "../Api/AllGetPostApi"
import ActivityLoader from '../Loader/ActivityLoader';
import { useRoute,useNavigationState } from '@react-navigation/native';
import moment from 'moment';
import { notifyMessage } from '../Utils/Utility';
import {getData} from '../Utils/Utility';
export default loginWithListing = ({ navigation }) => {
    const routing = useRoute()
    const routes = useNavigationState(state => state.routes)
    const currentRoute = routes[routes.length -1].name
    const [selectedFileObject, setselectedFileObject] = useState({})
     const [route, setRoute] = useState(null)
    const [searchItem, setSeachItem] = useState("")
    const [resources, setResources] = useState([])
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [createFolderPopupShowed, setCreatePopupShowed] = useState(false)
    const [editFolderPopupShowed, setEditPopupShowed] = useState(false)
    const [isLoading, setLoading] = useState(false);
    const [folderItem, setFolderItem] = useState(null);
    // const [errorMessage, seterrorMessage] = useState("")
    // const [biometric, setbiometric] = useState(null)
    // const [popupShowed, setpopupShowed] = useState(false)
    useEffect(() => {
        if(isLoading){
          navigation.setOptions({headerRight:null});
        }else{
            navigation.setOptions({
                headerRight: () => (
                    <View style={Styles.addFolderButtonView}>
                    
                   
                    <TouchableOpacity onPress={() => {
                        if(!isLoading){
                            setFolderItem(null)
                            setCreatePopupShowed(true)
                        }
                       
                    }
    
                    }>
                        <FontAwesomeIcon style={Styles.addIcon} size={30} icon={faFolderPlus} />
                    </TouchableOpacity>
                    
                </View>
                ),
                title: "DB Security"     //currentRootFolder?.name
              });
         
        }
       
    
        
       
    
      }, [isLoading])
    useEffect(() => {
        // detectFingerprintAvailable()
      
        let navFocusListener = navigation.addListener('focus', () => {
            // do some API calls here
          //let data = await getData()
          getData().then( async data=>{
             setRoute(data)
           
             if(data !== null ){
                getFolderData(data)
             }
             
          })
          
        });
        const backAction = () => {
            if(routing.name === "LoginListing"){
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'Landing'},
                        ],
                    })
                   
        
                );
            }else {
                navigation.back();
            }
            return true;
          };
          const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
          );
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction);
            navFocusListener.remove();
            
        };

    }, [])

    const getFolderData = (param = route) => {
        setLoading(true)
        let token = param?.token
        console.log("token==", token+"=="+JSON.stringify(param))
        AllGetPostRequestResponse.getRequest(token, false, "/folderListing?parent_id=" + param?.id).then((response) => {
            if (response?.status) {
                if (response.data.length > 0) {
                    console.log("response.data",JSON.stringify(response.data))
                    setResources(response.data)
                    setMasterDataSource(response.data)

                } else {
                    setResources([])
                    setMasterDataSource([])
                }
            }
            setLoading(false)
        }).catch((err) => {
            setLoading(false)
            console.log("error==", err)
        })
    }
    // const handleFingerprintShowed = () => {
    //     setpopupShowed(true)
    // };

    // const handleFingerprintDismissed = () => {
    //     setpopupShowed(false)
    // };
    // const detectFingerprintAvailable = () => {
    //     FingerprintScanner
    //         .isSensorAvailable()
    //         .catch(error => {
    //             seterrorMessage(error.errorMessage)
    //             setbiometric(error.biometric)
    //         });
    // }

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = resources.filter(
                function (item) {
                    // Applying filter for the inserted text in search bar
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                }
            );
            setResources(newData);
            setSeachItem(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            //getFolderData();
            setResources(masterDataSource);
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
                placeholder="Search for name..."
                onChangeText={text => searchFilterFunction(text)}
                value={searchItem}
            />
        );
    };
    useEffect(() => {
      
       
        const backAction = () => {
          //alert(route.name)
           navigation.goBack()
           BackHandler.exitApp()
          
          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', backAction);
          backHandler.remove();
          
        };
    
      }, [navigation])
    const listItem = (item) => {
        console.log("List_Item",JSON.stringify(item))
        return (
            <View style={Styles.listItem}>
                <View style={Styles.galleryIconView}>
                    <Image
                        style={Styles.galleryLogo}
                        source={(typeof item?.icon !== "undefined" && item?.icon !== "")  ?{uri:item?.icon}:require('../assets/icons/gallery.png')}
                    />

                </View>
                <View style={{ flex: 7.5 }}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={2} ellipsizeMode={'tail'} style={[Styles.itemText]}>
                        {item.name}
                    </Text>

                </View>
                <View style={Styles.forwardarrowView}>
                    {/* <Image
                        style={Styles.forwardLogo}
                        source={require('../assets/icons/forwardarrow.png')}
                    /> */}
                    <View style={Styles.editdeleteview}>
                        <TouchableOpacity onPress={() => {
                            setEditPopupShowed(true)
                            setFolderItem(item)
                        }
                        }>
                            <FontAwesomeIcon style={Styles.forwardLogo} size={15} icon={faPen} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            Alert.alert("Delete", "Are you sure you want to delete this item", [
                                {
                                    text: 'OK', onPress: () => {
                                        deleteFolderApiRequest(item.id)
                                    }
                                },
                                {
                                    text: 'Cancel', onPress: () => {

                                    }
                                },
                            ]);
                        }
                        }>
                            <FontAwesomeIcon style={[Styles.forwardLogo, { marginLeft: 10 }]} size={15} icon={faTrash} />
                        </TouchableOpacity>

                    </View>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ fontSize: 12, marginTop: 10 }}>
                        {moment(item.created_at).format('DD-MM-YYYY')}
                    </Text>
                </View>
            </View>
        )
    }
    const renderListData = () => {
        return (
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginTop: 10
                }}>
                <FlatList
                    style={Styles.list}
                    data={resources}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate("folderCreate", { "data": item, "user": route })}>
                            {listItem(item)}
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                />
            </View>

        )
    }


    const createFolderApiRequest = (folderName) => {
        let formdata = new FormData()
        formdata.append("name", folderName.trim())
        formdata.append("parent_id", route.id)
        if (Object.keys(selectedFileObject).length !== 0) {
            let object = selectedFileObject
            var ext = selectedFileObject?.name.substr(selectedFileObject?.name.lastIndexOf('.') + 1);
           
            object.fileName = folderName + "." + ext
            object.name = folderName + "." + ext
            formdata.append("image", object)
            console.log("selected file object===>>", JSON.stringify(object))
       }
          
       
        

        console.log("selected file object===>>>>", JSON.stringify(formdata),route?.token)
        // arr.push(object)
        //SetSelectedFiles([...arr])
        // return
        setselectedFileObject({})
        setLoading(true)
       
        console.log("create folder folder", formdata)
        AllGetPostRequestResponse.postRequestWithToken(formdata, false, "/addFolder", route?.token).
        then((response) => {
            console.log("create folder folder response", JSON.stringify(response))
            if (response?.status) {
                notifyMessage(response?.message)
            }
            setLoading(false)
            getFolderData();
        }).catch((err) => {
            console.log("create folder folder error", JSON.stringify(err))
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

        AllGetPostRequestResponse.postRequestWithToken(formdata, false, "/updateFolder", route?.token).then((response) => {
            if (response?.status) {
                notifyMessage(response?.message)
            }
            setLoading(false)
            setFolderItem(null)
            getFolderData();
        }).catch((err) => {
            setLoading(false)
            console.log("error==", err)
        })
    }

    const deleteFolderApiRequest = (folderid) => {
        setLoading(true)
        let formdata = new FormData()
        formdata.append("id", folderid)
        AllGetPostRequestResponse.postRequestWithToken(formdata, false, "/deleteFolder", route?.token).then((response) => {
            if (response?.status) {
                notifyMessage(response?.message)
            }
            setLoading(false)
            getFolderData();
        }).catch((err) => {
            setLoading(false)
            console.log("error==", err)
        })
    }
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

            {<>
                {(resources.length > 0 || masterDataSource.length > 0) && SearchContainer()}
                {(resources.length > 0 || masterDataSource.length > 0) && renderListData()}
                {(resources.length == 0 && masterDataSource.length == 0 && !isLoading) && <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ fontSize: 18, flex: 1, textAlign: 'center', textAlignVertical: 'center' }}>
                    {"No Folder Created, Please create folder"}
                </Text>
                }
                {(createFolderPopupShowed || editFolderPopupShowed) &&
                    <CreateFolderPopup
                        text={createFolderPopupShowed ?"Create":"Update"}
                        togglePopUpVisibility={(value, folderName) => {
                            setCreatePopupShowed(value)
                            setEditPopupShowed(value)
                            { (folderName !== "" && folderItem === null) ? createFolderApiRequest(folderName) : (folderItem != null && (folderItem.name !== folderName.trim() || Object.keys(selectedFileObject).length > 0) && editFolderApiRequest(folderName, folderItem.id)) }
                        }}
                        visible={createFolderPopupShowed}
                        foldername={folderItem ? folderItem.name : ""}
                        handleFileSelection={(input) => handleFileSelection(input)}
                    />}
                {/* {popupShowed && (
                <FingerprintPopup
                    style={Styles.popup}
                    bioMetricParseResult = {(messageCode,message)=> parseResultOfBioMetric(messageCode,message)}
                    handlePopupDismissedLegacy={()=>handleFingerprintDismissed()}
                />
            )} */}
            </>
            }
            {isLoading && <ActivityLoader isLoading={isLoading} />}
        </View>
    )
}