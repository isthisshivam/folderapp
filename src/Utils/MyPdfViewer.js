import { faL } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';

class MyPDFViewer extends Component {
    
  componentDidMount(){
  //  alert(JSON.stringify(this.props.route))
  }  
  render() {
    const source = {uri:this.props.route.params.url,cache:false};
    return (
      <View style={styles.container}>
        <Pdf
         trustAllCerts={false}
          source={source}
          onLoadComplete={(numberOfPages,filePath)=>{
              console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page,numberOfPages)=>{
              console.log(`current page: ${page}`);
          }}
          onError={(error)=>{
              console.log(error);
          }}
          onPressLink={(uri)=>{
              console.log(`Link presse: ${uri}`)
          }}
          style={styles.pdf}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
  }
});

export default MyPDFViewer;
