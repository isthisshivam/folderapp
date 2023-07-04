/**
 * @format
 */
//implementation 'com.github.uccmawei:Fingerprintidentify:1.2.6'
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import folderCreateDetail from "./src/FolderCreateAndDetails/FolderCreateAndDetails"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginWithListing from './src/LoginWithListing/LoginWithListing';
import BiometricPopup from "./src/FingerPrintPopup/FingerPrintPopup"
import Login from './src/Login/LoginScreen';
import LandingScreen from './src/Landing/LandingScreen';
import Register from './src/Register/RegisterScreen';
import VerifyPin from './src/VerifyPin/VerifyPinScreen';
import CreateNotesScreen from './src/CreateNotes/CreateNotesScreen';
import Splash from './src/Splash/SplashScreen';
import MyPDFViewer from './src/Utils/MyPdfViewer';

const Stack = createNativeStackNavigator();

const AfterLoginStack = () => {
    return (
        <Stack.Navigator initialRouteName="LoginListing">
        <Stack.Screen name="LoginListing" component={LoginWithListing} options={{ title: 'DB Security', headerLeft: null}} />
           <Stack.Screen name="folderCreate" component={folderCreateDetail} options={{ title: 'DB Security'}} />
           <Stack.Screen name="Reminder" component={CreateNotesScreen} options={{ title: 'DB Security'}} />
           <Stack.Screen name="MyPDFViewer" component={MyPDFViewer} options={{ title: 'DB Security'}} />
        </Stack.Navigator>
    )
}
const screensStacks = () => {
    return (
        <Stack.Navigator initialRouteName="Splash">
             <Stack.Screen name="Splash" options={{headerShown: false,statusBarHidden:true}} component={Splash}  />
             <Stack.Screen name="Landing"  component={LandingScreen} options={{ title: 'DB Security' }} />
            <Stack.Screen name="bioMetricPopup" component={BiometricPopup} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="VerifyPin" component={VerifyPin} options={{ title: 'DB Security' }}/>
            <Stack.Screen name="Register" component={Register} options={{ title: 'DB Security' }}/>
            {/* <Stack.Screen name="LoginListing" component={LoginWithListing} options={{ title: 'Resources', headerLeft: null}} />
           <Stack.Screen name="folderCreate" component={folderCreateDetail} options={{ title: 'User Files'}} />
           <Stack.Screen name="Reminder" component={CreateNotesScreen} options={{ title: 'Add Reminder Note'}} /> */}
           
            <Stack.Screen name ="AfterLoginStack" component={AfterLoginStack} options={{ headerShown: false }}/>
        </Stack.Navigator>
    )
}



function App() {
    return (
        <NavigationContainer>
            {screensStacks()}
            {/* {AfterLoginStack()} */}
        </NavigationContainer>
    );
}

AppRegistry.registerComponent(appName, () => App);
