import 'react-native-gesture-handler';
import React,{useState} from 'react';
import { LogBox, View, Text, StyleSheet } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import GraphqlScreen from './src/GraphqlScreen';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { SuperContext } from './src/contextProvider';
import CameraTwo from './src/CameraTwo';
import CameraOne from './src/CameraOne';
import MapScreen from './src/MapScreen';





// Initialize Apollo Client
/* const client = new ApolloClient({
  uri: 'https://2a29-2405-201-e018-a69-c44a-4ffe-2326-a83b.ngrok.io/graphql',
  cache: new InMemoryCache(),
  
}); */
const httpLink = new HttpLink({
  uri: 'https://283f-2405-201-e018-a69-4ca3-8ad8-6b3e-4ee4.ngrok.io/graphql'
});

const wsLink = new WebSocketLink({
  uri: 'wss://283f-2405-201-e018-a69-4ca3-8ad8-6b3e-4ee4.ngrok.io/graphql',
  options: {
    reconnect: true
  }
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

const Stack = createStackNavigator();

const App = () => {
  const [senderId] = useState({peerId:'hm4444'});
  const [receiverId] = useState({peerIdOne:'hm2222', peerIdTwo:'hm3333'});
  return (
    <SuperContext.Provider value={{senderId,receiverId}}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator>
          {/* <Stack.Screen
              name="GoogleMap"
              component={MapScreen}
              options={{headerShown: false}}
            /> */}
         {/*    <Stack.Screen
              name="Graphql"
              component={GraphqlScreen}
              options={{headerShown: false}}
            /> */}
           <Stack.Screen name="CameraOne" 
              component={CameraOne} 
            />
             <Stack.Screen name="CameraTwo" 
              component={CameraTwo} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
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