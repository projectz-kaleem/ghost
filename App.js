

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { RNCamera } from 'react-native-camera';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
import Modal from "react-native-modal";

import mime from "mime";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      cameraType: RNCamera.Constants.Type.back,
      image: '',
      showModel: false,
      success: false,
      loading: true,
      result:''
    }
  }
  createFormData = () => {
    const data = new FormData();
    data.append("file", {
        name: this.state.image.split('/').pop(),
        type: mime.getType(this.state.image),
        uri:Platform.OS === "android" ? this.state.image : this.state.image.replace("file://", "/private")
      });
   
    console.log(data);
    return data;
};
uploadImage = () => {
  if (this.state.image.length > 5) {
    this.setState({ showModel: true });
    var data = this.createFormData();
    fetch("http://149.248.20.31/", {
      method: "POST",
      body: data
  })
      .then(response => response.json())
      .then(response => {
          console.log("Upload Success", response);
          if (response.status == "success") {

            this.setState({result:response.result_image})

             
            

              this.setState({success:true})
            this.setState({loading:false})
          }
          else
          {
            this.setState({success:false})
            this.setState({loading:false})
          }
          

      })
      .catch(error => {
          console.log("upload error", error);
          
          this.setState({success:false})
            this.setState({loading:false})
      })
  }
  else {
    alert("Please select image");
  }
}
  render() {
    return (
      <View style={{ flex: 1 }}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={{ flex: 1 }}
          type={this.state.cameraType}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}

        />
        <Image source={require('./assets/frame.png')}
          style={{
            position: 'absolute', zIndex: 10,
            width: ScreenWidth,
            height: ScreenHeight,

            resizeMode: 'stretch',
          }} />
        <TouchableOpacity
          onPress={async() => {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
            this.setState({loading:true});
            this.setState({success:false});
            this.setState({showModel:true});
            this.setState({image:data.uri},()=>{
              this.uploadImage();
            });
            


          }}
          style={{
            position: 'absolute', zIndex: 10, display: 'flex', alignItems: 'center', width: ScreenWidth,
            bottom: 70,
          }}>
          <View style={{

            height: 80, width: 80, backgroundColor: '#fff', borderRadius: 100, justifyContent: 'center'
            , alignItems: 'center'
          }}>
            <View style={{
              height: 70, width: 70, backgroundColor: '#fff', borderRadius: 100, borderWidth: 1
            }}>

            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (this.state.cameraType == RNCamera.Constants.Type.back) {
              this.setState({ cameraType: RNCamera.Constants.Type.front });
            }
            else {
              this.setState({ cameraType: RNCamera.Constants.Type.back });
            }
          }}
          style={{
            position: 'absolute',
            zIndex: 10,
            bottom: 100, right: 20,
          }}>
          <Image source={require('./assets/switch.png')} style={{


            width: 50,
            height: 50,
            tintColor: '#fff'
          }}></Image>
        </TouchableOpacity>
        <Modal isVisible={this.state.showModel}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              width: 300, height: 500, borderRadius: 10, backgroundColor: '#fff',
              justifyContent: 'center', alignItems: 'center'
            }}>
              {
                this.state.loading == true ? <View>
                  <ActivityIndicator size={50}></ActivityIndicator>
                  <Text style={{color:'#000'}}>Please Wait</Text>
                </View> : <View>
                  {
                    this.state.success == true ?
                      <View>
                        <Image
        style={{height:400,width:250,marginTop:10}}
        source={{
          uri: this.state.result,
        }}
      />

                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ showModel: false });
                          }}
                          style={{
                            padding: 10, height: 40, width: 120, backgroundColor: '#F5F5F5', justifyContent: 'center',
                            alignItems: 'center', marginTop: 10, borderRadius: 10,color:'#000'
                          }}>
                          <Text style={{color:'#000'}}>Close</Text>
                        </TouchableOpacity>

                      </View> : <View>
                        <Text style={{ textAlign: 'center',color:'#000' }}>Error while uploading image</Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ showModel: false });
                          }}
                          style={{
                            padding: 10, height: 40, width: 120, backgroundColor: '#F5F5F5', justifyContent: 'center',
                            alignItems: 'center', marginTop: 10, borderRadius: 10,color:'#000'
                          }}>
                          <Text style={{color:'#000'}}>Close</Text>
                        </TouchableOpacity>
                      </View>
                  }
                </View>
              }
            </View>


          </View>
        </Modal>
      </View>
    );
  }
}