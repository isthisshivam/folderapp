import React from "react";
import { ActivityIndicator,View } from "react-native";

const  ActivityLoader = (props) => {
    let {isLoading} = props
    return (
        <View style={{ flex:1,height:"100%",justifyContent: "center", alignItems: "center", backgroundColor :'rgba(0,0,0,0.7)', position:'absolute', top:0, left:0, right:0, bottom:0 }}>
            {isLoading && <ActivityIndicator size={"large"} color={"#000"} />}
        </View>
    )
}

export default ActivityLoader;