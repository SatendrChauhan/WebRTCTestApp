import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {gql,useQuery } from '@apollo/client';
import { GET_ALL_DATA } from './queries';




const GraphqlScreen = () => {
  const {loading, error, data} = useQuery(GET_ALL_DATA);

  if(loading) return <View style={styles.container}><Text>Loading.....</Text></View>
  
  const filtered = data.allFilms.films.filter((item) => item.__typename === 'Film');

  console.log(filtered);
  
  return (
      <View style={styles.container}>
        <ScrollView>

        {filtered.map((item, x) => 
            <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between', marginTop:50}}>
                <View>
                    <Text style={{color:'black'}}>{` ${item.director}  : `} </Text>
                </View>
                <View key={x}>
                  <Text style={{color:'red', margin:10,}}>{item.title}</Text>
                </View>
                <View style={{width:100}}>
                  <Text style={{color:'green', marginLeft:15}}>{item.releaseDate}</Text>
                </View>
            </View>
          )}  
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
    }
})
