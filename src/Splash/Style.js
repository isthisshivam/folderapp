import {StyleSheet,Dimensions} from 'react-native';
import { lightGreen,white } from '../Utils/Color';
import { height } from '@fortawesome/free-solid-svg-icons/faSquarePlus';
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
      splacLogo: {
        width: 80,
        height: 80
      }
    });

    export default Styles;