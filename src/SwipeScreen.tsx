import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import InfinitePager from 'react-native-infinite-pager';
import CameraOne from './CameraOne';
import CameraTwo from './CameraTwo';


type PageComponentType = (props: {
  index: number;
  focusAnim: Animated.DerivedValue<number>;
  isActive: boolean;
}) => JSX.Element | null;

type AnyStyle = StyleProp<ViewStyle> | ReturnType<typeof useAnimatedStyle>;

type ImperativeApiOptions = {
  animated?: boolean;
};

export type InfinitePagerImperativeApi = {
  setPage: (index: number, options: ImperativeApiOptions) => void;
  incrementPage: (options: ImperativeApiOptions) => void;
  decrementPage: (options: ImperativeApiOptions) => void;
};


const NUM_ITEMS = 50;

function getColor(i: number) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = Math.abs(i) * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const Page = ({ index }: { index: number }) => {
  if(index==0){
    return (
      <View style={[styles.container,{backgroundColor: getColor(index)}]}>
         <CameraOne  />
        <Text style={styles.Txt}>Screen 1 </Text>
      </View>
    );
  }else if(index==1){
    return (
      <View style={[styles.container,{backgroundColor: getColor(index)}]}>
        <CameraTwo  />
        <Text style={styles.Txt}>Screen 2</Text>
      </View>
    );
  }
  return false;
};

const SwipeScreen = () => {
  return (
    <View style={styles.flex}>
      <InfinitePager
        PageComponent={Page}
        style={styles.flex}
        pageWrapperStyle={styles.flex}
      />
       {/* <BottomSheetCom content={<RenderContent />} /> */}
    </View>
  )
}

export default SwipeScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    // backgroundColor: "#121212", 
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { 
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  Txt:{
    flex:1, 
    color: "white", 
    fontSize: 80, 
    textAlign:'center',  
    marginTop:100
  }
});



/* 
const Page = ({ index }: { index: number }) => {
  return (
    <CallScreen />
  );
} 
*/