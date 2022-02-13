import 'react-native-gesture-handler';
import React,{useState} from 'react';
import { LogBox, View, Text, StyleSheet } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import GraphqlScreen from './src/GraphqlScreen';
import { SuperContext } from './src/contextProvider';
import CameraTwo from './src/CameraTwo';
import CameraOne from './src/CameraOne';
import MapScreen from './src/MapScreen';
import { MbxScreen } from './src/MbxScreen';
import SwipeScreen from './src/SwipeScreen';
import RSTPScreen from './src/RSTPScreen';




const Stack = createStackNavigator();

const App = () => {
  const [senderId] = useState({peerId:'hm4444'});
  const [receiverId] = useState({peerIdOne:'hm9999', peerIdTwo:'hm8888'});
  return (
    <SuperContext.Provider value={{senderId,receiverId}}>
        <NavigationContainer>
          <Stack.Navigator>
           {/* <Stack.Screen
              name="GoogleMap"
              component={MapScreen}
              options={{headerShown: false}}
            /> */}
           {/* <Stack.Screen
              name="Graphql"
              component={GraphqlScreen}
              options={{headerShown: false}}
            />  */}
            {/* <Stack.Screen name="CameraOne" 
              component={CameraOne} 
            />
            <Stack.Screen name="CameraTwo" 
              component={CameraTwo} 
            /> */}
            {/* <Stack.Screen name="mbx" 
              component={MbxScreen} 
            /> */}
            <Stack.Screen name="swipe" 
              component={SwipeScreen} 
            />
         {/*    <Stack.Screen name="RTSP Streaming Screen" 
              component={RSTPScreen} 
            /> */}
          </Stack.Navigator>
        </NavigationContainer>
    </SuperContext.Provider>
  );
};

export default App;



LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);







/* 
const Stack = createStackNavigator();
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen name="Call" 
      component={CallScreen} 
      // component={Call}
    />
  </Stack.Navigator>
</NavigationContainer>
*/


/* 
 <ApolloProvider client={client}>
          <GraphqlScreen />
      </ApolloProvider>

*/