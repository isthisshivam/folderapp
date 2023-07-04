import { StyleSheet, Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    backgroundColor: "rgba(226,226,226,1.0)"
  },
  titleText: {
    fontSize: 15,
    fontWeight: "500",
    width: windowWidth - 20,
    color: "#000000"
  },
  list: {
    flex: 1
  },
  listItemVertical: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,1.0)",
    height: 60,
    borderRadius: 6,
    paddingLeft: 5,
    paddingRight: 10,
    marginRight: 10,
    width: windowWidth - 20,

  },
  listItemVerticalAlarm: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,1.0)",
    borderRadius: 6,
    paddingLeft: 5,
    paddingRight: 10,
    marginRight: 10,
    width: windowWidth - 20,

  },
  listItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,1.0)",
    height: 60,
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10
  },

  galleryIconView: {
    flex: 2,
    justifyContent: 'center'
  },
  galleryLogo: {
    height: 35,
    width: 35
  },
  galleryLogoFileImage: {
    height: 65,
    width: 60,
    borderRadius:8
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 5.5,
    textAlignVertical: "center",
    marginLeft: 10
  },
  searchInput: {
    height: 50,
    borderColor: '#000',
    flex: 9
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,1.0)",
    height: 50,
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10
  },
  searchIconView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchLogo: {
    height: 20,
    width: 20
  },
  downloadLogo: {
    height: 15,
    width: 15,
    alignSelf: 'center'
  },
  forwardarrowView: {
   
  
    flexDirection: 'row'
   
  },
  forwardLogo: {
    height: 20,
    width: 20
  },
  addIcon: {
    height: 25,
    width: 25
  },
  listItemSelected: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,1.0)",
    height: 100,
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10
  },
  CrossIconView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 2
  },
  crossLogo: {
    height: 15,
    width: 15
  },
  editdeleteview: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editDelete: {
    height: 20,
    width: 20,
    padding:3
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    // justifyContent: "center",
    position: "absolute",
    top: "10%",
    // left: "5%",
    // right:"5%",
    elevation: 5,
    // transform: [{ translateX: -(windowWidth * 0.4) },
    // { translateY: -90 }],
    height: windowHeight-200,
    width: windowWidth-20,
    backgroundColor: "#d3d3d3",
    borderRadius: 7,
    justifyContent:'center',
    // paddingTop:20
  },
  crossView: {
    height: 20,
    width: windowWidth * 0.8,
    position:'absolute',
    top:10,
    right:10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    elevation: 8,
    flexDirection:'row'
  },
  crossIcon: {
    height: 20,
    width: 20
  },
  bigImageView:{
      justifyContent: 'center',
      paddingBottom:20
  },
  bigImageLogo: {
     //height:windowHeight-200,
  // resizeMode:'contain',
    //width:windowWidth-20,
  //  flex:1,
    // marginTop:15,
    alignSelf:'center',
    borderRadius: 7,
    height:windowHeight,
    // resizeMode:'contain',
      width:windowWidth,
  },
  
  slidingContainer:{alignItems:'center', justifyContent:'center', paddingTop:10}
});
export default Styles;