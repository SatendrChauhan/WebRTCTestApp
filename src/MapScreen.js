import React,{useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { mapStyle } from './mapStyle';
import axios from 'axios';




let markers = [
  {
    latitude: 45.65,
    longitude: -78.90,
    title: 'Happy Monk',
    subtitle: 'Happy Monk is tracking'
  }
];

const MapScreen = () => {
  return (
    <View style={styles.container}>
     <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map} 
       customMapStyle={mapStyle}
       region={{
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
       annotations={markers}
     >
     </MapView>
   </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
 });