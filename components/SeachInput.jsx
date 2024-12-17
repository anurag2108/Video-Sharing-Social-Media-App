import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'

import { icons } from '../constants';
import { router, usePathname } from 'expo-router';

const SearchInput = ({initialQuery}) => {

    const pathName = usePathname();
    const [query, setQuery] = useState(initialQuery || '');
  return (
      <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
        <TextInput 
            className="flex-1 font-pregular text-white mt-0.5 text-base" 
            value = {query} 
            placeholder="Search for a video topic" 
            placeholderTextColor = "#CDCDE0" 
            onChangeText = {(e) =>{setQuery(e)}}>
        </TextInput>
        
        <TouchableOpacity>
            onPress = {()=>{
                if(!query){
                    return Alert.alert('Missing Query', "Please input something to search results across database!")
                }
                if(pathName.startsWith('/search')){
                    router.setParams({query})
                }
                else{
                    router.push(`/search/${query}`)
                }
            }}
            <Image source={icons.search}
            className = "w-5 h-5"
            resizeMode='contain'>

            </Image>
        </TouchableOpacity>
      </View>
  )
}

export default SearchInput
