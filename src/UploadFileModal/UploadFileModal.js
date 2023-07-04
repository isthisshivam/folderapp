import React, { useState, useEffect, useRef } from "react";
import {
    Button, TouchableOpacity, Modal,
    View, TextInput, Image, Text
} from "react-native";
import Styles from "./Style";

const UploadFilePopup = (props) => {
    const inputTitle = useRef()
    const [isModalVisible, setModalVisible] = useState(props.createFolderPopupShowed);

    // This is to manage TextInput State
    const [inputValue, setInputValue] = useState(props.selectedFileObject ? props.selectedFileObject?.name?.split(".")[0] : "");

    // Create toggleModalVisibility function that will
    // Open and close modal upon button clicks.
    useEffect(() => {
        if (props.fileName) {
            setInputValue(props.fileName.split(".")[0])
        } else {
            setInputValue(props.selectedFileObject ? props.selectedFileObject?.fileName?.split(".")[0] : "")
        }

    }, [])
    const toggleModalVisibility = () => {
        props.togglePopUpVisibility(false)
    };
    return (
        <Modal animationType="slide"
            transparent visible={isModalVisible}
            presentationStyle="overFullScreen"
            onDismiss={toggleModalVisibility}
            onShow={() => {
                setTimeout(() => {
                    inputTitle.current.focus()
                }, 100);
            }}
        >
            <View style={Styles.viewWrapper}>

                <View style={Styles.modalView}>
                    <View style={Styles.crossView}>
                        <TouchableOpacity onPress={toggleModalVisibility}>
                            <Image
                                style={Styles.crossIcon}
                                source={require('../assets/icons/cross.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <TextInput maxLength={20} placeholder="File Name"
                        value={inputValue} style={Styles.textInput}
                        onChangeText={(value) => setInputValue(value)}
                        ref={inputTitle}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            // inputValue? props.handleFileSelection(inputValue): alert("Please enter file name")
                            if(inputValue == "" || inputValue === undefined){
                                alert("Please enter filename")
                                return
                            }
                            props.handleFileSelection(inputValue)
                            setTimeout(() => {
                                inputTitle.current.focus()
                            }, 100);
                        }

                        }
                        style={Styles.loginBtn}>
                        <Text style={Styles.loginText}>Attach file</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {

                             console.log(JSON.stringify(props.selectedFileObject)+"==="+inputValue)
                            {  if((inputValue == "" || inputValue === undefined) || JSON.stringify(props.selectedFileObject) === '{}' ){
                                alert("Please enter filename or select file")
                                return
                            }
                                 props.uploadSelectedFile(inputValue) 

                            }
                        }

                        }
                        style={Styles.loginBtn}>
                        <Text style={Styles.loginText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    )
}

export default UploadFilePopup;