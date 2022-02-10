import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Icon from './icons';


const danger  = "#B73052";
const warning = "rgba(212, 126, 49, 0.8)";
const success = "rgba(0, 195, 5, 1)";

export const RenderContent = () => {
    // const navigation = useNavigation()
    // const activityScreen = () => navigation.navigate("Activity")
    return (
        <View style={styles.sheetContainer}>
            <View style={styles.mainCard}>
                <TouchableOpacity style={[styles.card,{marginLeft:-2}]}
                    onPress={activityScreen}
                >
                    <Icon type="ionicon" size={27} name="location-sharp" color={danger} />
                    <Text style={[styles.midTxt,{lineHeight:26}]}>Your Geo location is being tracked</Text>
                    <Text style={styles.rTxt}>2 min agoo</Text>
                </TouchableOpacity>
                <View style={[styles.card,{marginLeft:30, marginTop:10}]}>
                    <View style={styles.mCard}><Text  style={styles.memTxt}>Members</Text></View>
                    <Text style={styles.pTxt}>Priority 0</Text>
                    <View style={{paddingHorizontal:80}}>
                            <Text>{' '}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.mainCard,{marginTop:30}]}>
                <View style={styles.card}>
                    {/* <AntDesign_Icon name="exclamationcircle" size={20} color={success} /> */}
                    <Icon type="ant" name="exclamationcircle" size={20} color={success} />
                    <Text style={styles.midTxt}>FL5096 Documents are shared</Text>
                    <Text style={styles.rTxt}>11:30am</Text>
                </View>
                <View style={[styles.card,{marginLeft:30, marginTop:10}]}>
                    <View style={styles.mCard}><Text  style={styles.memTxt}>Fleet</Text></View>
                    <Text style={[styles.pTxt,{color:warning}]}>Priority 1</Text>
                    <TouchableOpacity style={{paddingLeft:95}}>
                        <Text style={styles.docsTxt}>View Docs</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.mainCard,{marginTop:30}]}>
                <View style={styles.card}>
                    {/* <AntDesign_Icon name="exclamationcircle" size={20} color={warning} /> */}
                    <Icon type="ant" name="exclamationcircle" size={20} color={warning} />
                    <Text style={styles.midTxt}>You have been captured at Check point</Text>
                    <Text style={styles.rTxt}>11:20am</Text>
                </View>
                <View style={[styles.card,{marginLeft:30, marginTop:10}]}>
                    <View style={styles.mCard}><Text  style={styles.memTxt}>Fleet</Text></View>
                    <Text style={[styles.pTxt]}>Priority 0</Text>
                    <View style={{paddingHorizontal:80}}>
                            <Text>{' '}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.mainCard,{marginTop:30}]}>
                <View style={styles.card}>
                    <Icon type="ant" name="exclamationcircle" size={20} color={warning} />
                    <Text style={styles.midTxt}>Unidentified Person found jumping</Text>
                    <Text style={styles.rTxt}>11:20am</Text>
                </View>
                <View style={[styles.card,{marginLeft:30, marginTop:10}]}>
                    <View style={styles.mCard}><Text  style={styles.memTxt}>Fleet</Text></View>
                    <Text style={[styles.pTxt]}>Priority 0</Text>
                    <View style={{paddingHorizontal:80}}>
                            <Text>{' '}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.mainCard,{marginTop:30}]}>
                <View style={styles.card}>
                    <Icon type="ant" name="exclamationcircle" size={20} color={warning} />
                    <Text style={styles.midTxt}>Unidentified Person found jumping</Text>
                    <Text style={styles.rTxt}>11:20am</Text>
                </View>
                <View style={[styles.card,{marginLeft:30, marginTop:10}]}>
                    <View style={styles.mCard}><Text  style={styles.memTxt}>Fleet</Text></View>
                    <Text style={[styles.pTxt]}>Priority 0</Text>
                    <View style={{paddingHorizontal:80}}>
                            <Text>{' '}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.mainCard,{marginTop:30}]}>
                <View style={styles.card}>
                    <Icon type="ant" name="exclamationcircle" size={20} color={warning} />
                    <Text style={styles.midTxt}>Unidentified Person found jumping</Text>
                    <Text style={styles.rTxt}>11:20am</Text>
                </View>
                <View style={[styles.card,{marginLeft:30, marginTop:10}]}>
                    <View style={styles.mCard}><Text  style={styles.memTxt}>Fleet</Text></View>
                    <Text style={[styles.pTxt]}>Priority 1</Text>
                    <View style={{paddingHorizontal:80}}>
                            <Text>{' '}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    sheetContainer: {
        flex:1,
        paddingHorizontal:15,
        marginTop:20
    },
    mainCard:{
        flex:1,
    },
    card: {
        flexDirection:'row', 
        alignItems:'flex-start',
        justifyContent:'space-between' 
    },
    mCard:{
        height:22, 
        width:90,
        backgroundColor:'rgba(228, 228, 231, 0.2)',
        borderRadius:35,
        marginRight:30
    },
    midTxt:{
        paddingLeft:15, 
        fontFamily:'SourceSansPro', 
        fontSize:14, 
        color:'rgba(228, 228, 231, 0.8)', 
        lineHeight:20,
        position:'absolute', 
        left:15
    },
    rTxt:{
        marginLeft:70,
        fontFamily:'SourceSansPro', 
        fontSize:12, 
        color:'rgba(228, 228, 231, 0.4)', 
        lineHeight:25,
        // textAlign:'right'
    },
    memTxt:{
        fontFamily:'SourceSansPro', 
        fontSize:12, 
        color:'rgba(255, 255, 255, 0.8)', 
        textAlign:'center',
        lineHeight:20
    },
    pTxt:{
        fontFamily:'SourceSansPro', 
        fontSize:14, 
        color:'rgba(83, 215, 105, 0.8)', 
        lineHeight:22
    },
    docsTxt:{
        fontFamily:'SourceSansPro', 
        fontWeight:'700',
        color:'rgba(1, 143, 106, 0.85)'
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        zIndex: 1,
        backgroundColor: "#1d1d1d",
        color: "#fff",
    },
})
