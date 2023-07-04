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
    
   
    inputView: {
        width: "80%",
        backgroundColor: white,
        borderRadius: 25,
        height: 50,
        marginTop: 20,
        justifyContent: "center",
        padding: 20,
        borderColor:"#d3d3d3",
        flexDirection:"column",
        borderWidth:1
    },
    inputText: {
        height: 50,
        color: "#000",
       
        fontWeight:'700'
    },

    inputMultiLineText: {
      height: 150,
      fontWeight:'700',
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
   
    label: {
      margin: 8,
    },
    addIcon: {
      height: 25,
      width: 25
    },
    crossView: {
      height: 20,
      width: windowWidth * 0.8,
      marginTop: 10,
      alignItems:'flex-end',
      justifyContent:'center',
      paddingRight:20
  },
  crossIcon:{
      height:35,
      width:35,
      borderRadius:10
  },
  
    FolderIcon:{
        alignItems:'center',
        justifyContent:'center',
    }
    });

    export default Styles;