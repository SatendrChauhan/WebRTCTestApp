import { Button, PermissionsAndroid, StyleSheet, Text, View } from "react-native";
import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NodePlayerView } from 'react-native-nodemediaclient';



const MediaPlayer = () => {
  const [isPublish, setIsPublish] = useState(false);
  const [publishBtnTitle, setPublishBtnTitle] = useState('')

  const ref = React.useRef()
  return (
        <View style={{flex: 1}}>
          <NodePlayerView 
            style={{height: 320 }}
            ref={ref}
            inputUrl={"rtsp://172.30.1.234:18554/camera1"}
            scaleMode={"ScaleAspectFit"}
            bufferTime={300}
            maxBufferTime={1000}
            autoplay={true}
            audioEnable={false}
          />
        </View>
    
  );
};

export default MediaPlayer;

const styles = StyleSheet.create({


});
