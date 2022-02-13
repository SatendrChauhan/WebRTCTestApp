import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';



const GraphqlScreen = () => {
  // const {loading, error, data} = useSubscription(GET_ALL_DATA);

  // if(loading) return <View style={styles.container}><Text>Loading.....</Text></View>

  // console.log(data);
  
  // // const getData = data.map((item, i) => {
  // //    return item;
  // // })
  

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.midSec}>
          <View>
            <Text style={{ color: 'black' }}>{'Item 1'} </Text>
            <Text style={{ color: 'black' }}>{'Item 2'} </Text>
            <Text style={{ color: 'black' }}>{'Item 3'} </Text>
            <Text style={{ color: 'black' }}>{'Item 4'} </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GraphqlScreen;

const styles = StyleSheet.create({
    container:{
      flex:1, 
      alignItems:'center', 
      justifyContent: 'center',
    },
    midSec:{
      flexDirection:'row', 
      alignItems:'center',
      justifyContent:'space-between', 
      marginTop:50
    }
})
