import React, { useEffect, useState } from "react";
import {
    Button, TouchableOpacity, Modal,
    View, TextInput, Image,Text
} from "react-native";
import Styles from "./Style";
const CreateFolderPopup = (props) => {
    const [isModalVisible, setModalVisible] = useState(props.createFolderPopupShowed);

    // This is to manage TextInput State
    const [inputValue, setInputValue] = useState(props.foldername);

    // Create toggleModalVisibility function that will
    // Open and close modal upon button clicks.
    const toggleModalVisibility = (inputValue) => {
        props.togglePopUpVisibility(false, inputValue)
    };

    useEffect(()=>{
        console.log("CreateFolder",JSON.stringify(props))
    },[])

    useEffect(() => {
        return () => {
            // Anything in here is fired on component unmount.
        }
    }, [])
    return (
        
        <Modal animationType="slide"
            transparent visible={isModalVisible}
            presentationStyle="overFullScreen"
            onDismiss={()=>toggleModalVisibility(inputValue)}>
            <View style={Styles.viewWrapper}>

                <View style={Styles.modalView}>
                    <View style={Styles.crossView}>
                        <TouchableOpacity onPress={()=>toggleModalVisibility("")}>
                            <Image
                                style={Styles.crossIcon}
                                source={require('../assets/icons/cross.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={Styles.FolderIcon}
                        onPress={() => {
                            props.handleFileSelection(inputValue)
                        }

                        }
                        >
                            <Image
                                style={Styles.crossIcon}
                                source={require('../assets/icons/add_icon.png')}
                            />
                            <Text>Folder Icon</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput  placeholder="Enter folder names"
                        value={inputValue} style={Styles.textInput}
                        onChangeText={(value) => setInputValue(value)} />

                    {/** This button is responsible to close the modal */}
                    {/* <Button title="Done" onPress={toggleModalVisibility} /> */}
                    <TouchableOpacity
                        onPress={()=>{
                            if(inputValue.length !== 0){
                                toggleModalVisibility(inputValue)
                            }else {
                                alert("Please enter folder name.")
                            }
                            
                        }
                        
                        }
                        style={Styles.loginBtn}>
                        <Text style={Styles.loginText}>{props.text}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    )
}

export default CreateFolderPopup;