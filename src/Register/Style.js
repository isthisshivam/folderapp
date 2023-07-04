import {StyleSheet,Dimensions} from 'react-native';
import { lightGreen,white } from '../Utils/Color';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
  const Styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        paddingBottom:10,
        flex:1,
        backgroundColor:"rgba(226,226,226,1.0)"
      },
    
    title: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#fb5b5a",
        marginBottom: 40,
    },
    inputView: {
        width: "80%",
        backgroundColor: white,
        borderRadius: 25,
        height: 50,
        marginTop: 20,
        justifyContent: "center",
        padding: 20,
        borderColor:"#d3d3d3",
        borderWidth:1
    },
    inputText: {
        height: 50,
        color: "#000"
    },
    loginBtn: {
        width: "80%",
        backgroundColor: "green",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },
    loginText:{
      fontSize:16,
      color:"#fff",
      fontWeight:"500"
    },
    profileImageView:{
      height:100,
      width:windowWidth-20,
      alignItems:'center',
      justifyContent:'center'
    },
    profileRounderView:{
      height:90,
      width:90,
      borderRadius:45,
      borderWidth:2,
      borderColor:"green",
     
    },
    addIcon:{
      height:20,
      width:20,
      marginTop:15,
      position:'absolute',
      bottom:5,
      right:(windowWidth-100)/2,
    },
    profileImage:{
      height:86,
      width:86,
      borderRadius:43
    },
    checkboxContainer: {
      flexDirection: 'row',
      marginTop: 20,

    },
    checkbox: {
      alignSelf: 'center',
    },
    label: {
      margin: 8,
    },
    });

    export default Styles;