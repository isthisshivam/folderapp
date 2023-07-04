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
      searchInput:{
         height: 50, 
         borderColor: '#000', 
         flex:9
      },
      searchContainer:{
        flexDirection:"row",
        backgroundColor:"rgba(255,255,255,1.0)",
        height:50,
        borderRadius:12,
        paddingLeft:10,
        paddingRight:10,
        marginTop:5
      },
      searchIconView:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
      },
      searchLogo:{
        height:20,
        width:20
      },
      list:{
        flex:1
      },
      listItem:{
        flexDirection:"row",
        backgroundColor:"rgba(255,255,255,1.0)",
        height:60,
        borderRadius:6,
        paddingLeft:10,
        paddingRight:10,
        marginTop:10

      },
      galleryIconView:{
        flex:1.5,
      
        justifyContent:'center'
      },
      galleryLogo:{
        height:35,
        width:35
      },
      itemText:{
        fontSize:15,
        fontWeight:'500',
        flex:7.5,
        textAlignVertical: "center"
      },
      forwardarrowView:{
        flex:2,
        justifyContent:'center',
        alignItems:'flex-end'
      },
      forwardLogo:{
        height:15,
        width:15
      },
      popup: {
        width: windowWidth * 0.8,
      },
      addFolderButtonView:{
        height:50,
        
        alignItems:'center',
        justifyContent:'flex-end',
        flexDirection:'row'
      },
      addIcon:{
        height:35,
        width:35
      },
      editdeleteview:{
        flexDirection:'row',
       // marginTop:10
      },
      textCreateFolder:{
        fontSize:15,
        fontWeight:'500',
        width:100,
        textAlignVertical: "center"
      },
})

export default Styles;