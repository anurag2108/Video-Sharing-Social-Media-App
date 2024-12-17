import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SeachInput'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppWrite'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const {query} = useLocalSearchParams();
  const {data: posts, refetch} = useAppwrite( ()=>searchPosts(query) );

  useEffect(()=>{
    refetch()
  },[query])
  //console.log(posts);

  return (
    <SafeAreaView className = "bg-primary h-full">
      <FlatList 
        data = {posts}
        keyExtractor={(item)=>item.$id}
        renderItem={(item)=>(
           <VideoCart video = {item}/>
        )}
        ListHeaderComponent={(item)=>(
          <View className="my-6 px-4">
                <Text className = "font-medium text-sm text-gray-100">
                    Search Results:
                </Text>
                <Text className = "text-2xl font-psemibold text-white">
                    {query}
                </Text>
                <View className = "mt-6 mb-8">
                  <SearchInput initialQuery = {query}/>
                </View>
          </View>
        )}
        ListEmptyComponent={()=>(
          <EmptyState
          title = "No Videos Found"
          subtitle = "No Videos found for this search query!"/>
        )}
        >
      </FlatList>
    </SafeAreaView>
  )
}

export default Search