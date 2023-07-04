import { StyleSheet, Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
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
        top: "50%",
        left: "50%",
        elevation: 5,
        transform: [{ translateX: -(windowWidth * 0.4) },
        { translateY: -90 }],
        height: 220,
        width: windowWidth * 0.8,
        backgroundColor: "#fff",
        borderRadius: 7,
    },
    textInput: {
        width: "80%",
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 8,
        marginTop:20
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
        height:20,
        width:20
    },
    loginBtn: {
        width: "50%",
        backgroundColor: "green",
        borderRadius: 12,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10
    },
    loginText:{
      fontSize:13,
      color:"#fff",
      fontWeight:"500"
    },
});
export default Styles;