import { CommonActions } from '@react-navigation/native';
import {
  Alert,
  ToastAndroid,
  AlertIOS
} from "react-native"
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from "react-native-file-viewer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';



export const screenNavigation = (navigation, routeName, params = {}) => {
  navigation.navigate(routeName, params)
}

export const resetStack = (navigation, routeName, params = {}) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        { name: routeName },
      ],
    })
  );
}

export const createAlert = (title, message, messageCode) => {
  Alert.alert(title, message, [
    {
      text: 'OK', onPress: () => {

      }
    },
    {
      text: 'Cancel', onPress: () => {

      }
    },
  ]);
}

export const downloadImage = (url, navigation) => {
  // Main function to download the image

  // To add the time suffix in filename
  let date = new Date();
  // Image URL which we want to download
  let image_URL = url;
  // Getting the extention of the file
  let ext = getExtention(image_URL);
  ext = '.' + ext[0];
  // Get config and fs from RNFetchBlob
  // config: To pass the downloading related options
  // fs: Directory path where we want our image to download
  const { config, fs } = RNFetchBlob;
  let PictureDir = fs.dirs.DocumentDir;
  const filePath = `${RNFS.DocumentDirectoryPath}/${'/file_' +
  Math.floor(date.getTime() + date.getSeconds() / 2) +
  ext}`;
  RNFS.downloadFile({
    fromUrl: image_URL,
    toFile: filePath,
  }).promise.then(res => {
    notifyMessage('File Downloaded Successfully at ' + filePath);
    const path = FileViewer.open(filePath, { showOpenWithDialog: true }) 
    console.log('File downloaded successfully.'+ filePath);
  }).catch(err => {
    console.log('Error downloading file: ', err);
  });
  return
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      // Related to the Android only
      useDownloadManager: true,
      notification: true,
      path:
        PictureDir +
        '/file_' +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        ext,
      description: 'File',
    },
  };
  config(options)
    .fetch('GET', image_URL)
    .then(res => {
      // Showing alert after successful downloading
      console.log('res -> ', JSON.stringify(res));
      notifyMessage('File Downloaded Successfully');
      const path = FileViewer.open(res.data, { showOpenWithDialog: true }) // absolute-path-to-my-local-file.
      .then(() => {
        // success
        console.log("success==")
      })
      .catch((error) => {
        // error
        console.log("error file==",error)
      });
  
    }).catch((error)=>{
        console.log("error==",error)
    });
};

const getExtention = filename => {
  // To get the file extension
  return /[.]/.exec(filename) ?
    /[^.]+$/.exec(filename) : undefined;
};

export const notifyMessage = (msg)=> {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    AlertIOS.alert(msg);
  }
}

export  const storeData = async (value, navigation) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('logindata', jsonValue);
    navigation.dispatch(
      CommonActions.reset({
          index: -0,
          routes: [
              { name: 'AfterLoginStack'},
          ],
      })
  );
  } catch (e) {
    // saving error
    console.log("error  in saving",e)
  }
}

export const  getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('logindata')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
    console.log("error  in reading",e)
  }
}

