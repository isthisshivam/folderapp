import {StyleSheet,Dimensions} from 'react-native';
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
      square: {
        width: '46%',
        height:130,
        backgroundColor: '#ffffff',
        borderColor: '#d3d3d3',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginLeft:10,
        alignItems:'center',
        justifyContent:'center'
      },
      row: {
        flex: 1,
        justifyContent: 'space-around',
        marginTop:20
      },
      userNameText:{
        color:"#000000",
        fontSize:18,
        fontWeight:"500",
        textAlign:'center',
        textAlignVertical:"center"
      },
      addIcon:{
        marginTop:15
      },
      profileRounderView:{
        height:50,
        width:50,
        borderRadius:25,
        borderWidth:1,
        borderColor:"green",
       
      },
      profileImage:{
        height:48,
        width:48,
        borderRadius:24,

      },
    });

    export default Styles;