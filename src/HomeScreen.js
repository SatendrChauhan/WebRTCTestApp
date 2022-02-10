import React, {useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet,ViewStyle, StatusBar, ScrollView} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { RenderContent } from './render-content';
import CallScreen from './CallScreen';





export const HomeScreen = () => {

    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);
    // variables
    // const snapPoints = useMemo(() => ['12%', '60%'],[]);
    const snapPoints = useMemo(() => ["25%", "25%", "90%"], []);
    // callBack
    const handleSheetChanges = useCallback((index: number) => {
          // console.log('handleSheetChanges', index);
    },[]);

    const OuterStyle: ViewStyle = {
        backgroundColor:'rgba(38, 40, 50, 1)',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        // zIndex:5
    }
    const indictorStyle: ViewStyle = {
        borderWidth:3, 
        width:60,
        borderColor:'rgba(228, 228, 231, 0.2)', 
        borderRadius:6
    }

   /*  if (!res.data) {
      return <Text>No new messages</Text>;
    }else{
      {res.data.map((msg, i) => (
        <Text key={msg.id}>{msg.from}</Text>
    ))}
    } */
    
    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor={'#121212'}  />
            {/* <ScrollView style={{width:'100%'}}>
                <CallScreen  />
            </ScrollView> */}
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                backgroundStyle={OuterStyle}
                handleIndicatorStyle={indictorStyle}
                enableHandlePanningGesture={true}
                enableContentPanningGesture={true}
                enableOverDrag={true}
                onChange={handleSheetChanges}
            >
                <BottomSheetScrollView>
                   <RenderContent />
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    )
}


const styles = StyleSheet.create({
    mainContainer:{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor:'#121212',
        // zIndex: -5,
    },
    
})
