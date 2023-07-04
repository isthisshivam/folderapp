import React, { Component } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions,
} from "react-native";

import Carousel, { Pagination } from "react-native-snap-carousel"; //Thank From distributer(s) of this lib
import styles from "./SliderBox.style";
import VideoPlayer from 'react-native-video-player';
import Video from 'react-native-video';
// -------------------Props--------------------
// images
// onCurrentImagePressed
// sliderBoxHeight
// parentWidth
// dotColor
// inactiveDotColor
// dotStyle
// paginationBoxVerticalPadding
// circleLoop
// autoplay
// ImageComponent
// ImageLoader
// paginationBoxStyle
// resizeMethod
// resizeMode
// ImageComponentStyle,
// imageLoadingColor = "#E91E63"
// firstItem = 0
// activeOpacity
// autoplayInterval = 3000

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export class SliderBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImage: props.firstItem || 0,
      loading: [],
      videPaused: false
    };
    this.onCurrentImagePressedHandler =
      this.onCurrentImagePressedHandler.bind(this);
    this.onSnap = this.onSnap.bind(this);
    this._renderItem = this._renderItem.bind(this);
   // alert(props.firstItem)
  }

  componentDidMount() {
    //let a = [...Array(this.props.images.length).keys()].map((i) => false);
    let extension = this.props.images[0].substring(this.props.images[0].lastIndexOf("."));
    if(this.checkVideoExtension( extension)){
       this.setState({videPaused:false})
    }else{
     this.setState({videPaused:true})
    }
  }

  onCurrentImagePressedHandler() {
    if (this.props.onCurrentImagePressed) {
      this.props.onCurrentImagePressed(this.state.currentImage);
    }
  }

  onSnap(index) {
    this._ref.snapToItem(index);
    const { currentImageEmitter } = this.props;
     
    this.setState({ currentImage: index }, () => {
      if (currentImageEmitter) {
        currentImageEmitter(this.state.currentImage);
        let extension = this.props.images[index].substring(this.props.images[index].lastIndexOf("."));
       if(this.checkVideoExtension( extension)){
        console.log("yes=="+this.props.images[index]+"=="+index)
          this.setState({videPaused:false})
       }else{
        console.log("false=="+this.props.images[index]+"=="+index)
        this.setState({videPaused:true})
       }
      }
    });
  }
  checkVideoExtension = (ext) => {
    var types = ['.mp4', '.mov', '.webm'];
    if (types.indexOf(ext) !== -1) {
    
      return true
    }
   
    return false;
  }

  _renderItem({ item, index }) {
    const {
      ImageComponent,
      ImageComponentStyle = {},
      LoaderComponent,
      sliderBoxHeight,
      disableOnPress,
      resizeMethod,
      resizeMode,
      imageLoadingColor = "#E91E63",
      underlayColor = "transparent",
      activeOpacity = 0.85,
    } = this.props;
    let extension = item.substring(item.lastIndexOf("."));
    return (
      <View
        style={{
          position: "relative",
          justifyContent: "center",
        }}
      >
        <TouchableHighlight
          key={index}
          underlayColor={underlayColor}
          disabled={disableOnPress}
          onPress={this.onCurrentImagePressedHandler}
          activeOpacity={activeOpacity}
        >
          {!this.checkVideoExtension(extension) ?
            <ImageComponent
              style={[
                {
                  width: "100%",
                  height: sliderBoxHeight || 200,
                  alignSelf: "center",
                },
                ImageComponentStyle,
              ]}
              source={typeof item === "string" ? { uri: item } : item}
              resizeMethod={resizeMethod || "resize"}
              resizeMode={resizeMode || "cover"}
              //onLoad={() => {}}
              //onLoadStart={() => {}}
              onLoadEnd={() => {
                let t = this.state.loading;
                t[index] = true;
                this.setState({ loading: t });
              }}
              {...this.props}
            /> :

            <View style={[
              {
                width: "100%",
                height: sliderBoxHeight || 200,
                alignSelf: "center",
                backgroundColor: '#d3d3d3'
              },
              ImageComponentStyle,
            ]}>

               <Video source={{ uri: item }}   // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref
                }}
                paused= {this.state.videPaused}
                controls= {true}
                resizeMode = {'contain'}
                minLoadRetryCount={50}
                style={[
                  {
                    width: "100%",
                    height:  height-200,
                    alignSelf: "center",
                  },
                ]}                                  // Store reference
                onBuffer={() => {
                  console.log("buffer")
                  let t = this.state.loading;
                  t[index] = false;
                  this.setState({ loading: t })
                }}    
                onReadyForDisplay= {() => {
                  console.log("Ready")
                  let t = this.state.loading;
                  t[index] = true;
                 
                }}     
                onVideoEnd = {() => {
                  console.log("end")
                  let t = this.state.loading;
                  t[index] = true;
                  this.setState({ loading: t })
                }}           // Callback when remote video is buffering
                onError={(error) => {
                  console.log(error)
                  let t = this.state.loading;
                  t[index] = true;
                  this.setState({ loading: t })
                }}
                resizeMethod={resizeMethod || "resize"}
                           // Callback when video cannot be loaded
              />

              {/* <VideoPlayer
            video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
              videoWidth={width-40}
              videoHeight={height-200}
            thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
        /> */}
            </View>
           
          }
        </TouchableHighlight>


        { !this.checkVideoExtension(extension) && !this.state.loading[index] && (
          <LoaderComponent
            index={index}
            size="large"
            color={imageLoadingColor}
            style={{
              position: "absolute",
              alignSelf: "center",
            }}
          />
        )}
      </View>
    );
  }

  get pagination() {
    const { currentImage } = this.state;
    const {
      images,
      dotStyle,
      dotColor,
      inactiveDotColor,
      paginationBoxStyle,
      paginationBoxVerticalPadding,
    } = this.props;
    return (
      <Pagination
        borderRadius={2}
        dotsLength={images.length}
        activeDotIndex={currentImage}
        dotStyle={dotStyle || styles.dotStyle}
        dotColor={dotColor || colors.dotColors}
        inactiveDotColor={inactiveDotColor || colors.white}
        inactiveDotScale={0.8}
        carouselRef={this._ref}
        inactiveDotOpacity={0.8}
        tappableDots={!!this._ref}
        containerStyle={[
          styles.paginationBoxStyle,
          paginationBoxVerticalPadding
            ? { paddingVertical: paginationBoxVerticalPadding }
            : {},
          paginationBoxStyle ? paginationBoxStyle : {},
        ]}
        {...this.props}
      />
    );
  }

  render() {
    const {
      images,
      circleLoop,
      autoplay,
      parentWidth,
      loopClonesPerSide,
      autoplayDelay,
      useScrollView,
      autoplayInterval,
    } = this.props;

    return (
      <View>
        <Carousel
          autoplayDelay={autoplayDelay}
          autoplayInterval={autoplayInterval || 3000}
          layout={"default"}
          useScrollView={useScrollView}
          data={images}
          ref={(c) => (this._ref = c)}
          loop={circleLoop || false}
          enableSnap={true}
          autoplay={autoplay || false}
          itemWidth={parentWidth || width}
          sliderWidth={parentWidth || width}
          loopClonesPerSide={loopClonesPerSide || 5}
          renderItem={this._renderItem}
          onSnapToItem={(index) => this.onSnap(index)}
          {...this.props}
        />
        {images.length > 1 && this.pagination}
      </View>
    );
  }
}

const colors = {
  dotColors: "#BDBDBD",
  white: "#FFFFFF",
};

SliderBox.defaultProps = {
  ImageComponent: Image,
  LoaderComponent: ActivityIndicator,
};
