import { Image, ScrollView, StatusBar, Text,View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {images} from '../constants';
import { Redirect,router } from "expo-router";
import CustomButton from "../components/CustomButton";

export default function App(){
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{height:'100%'}}>
                <View className="w-full justify-center items-center min-h-[85vh] px-4">
                    <Image source={images.logo}
                    className="w-[130px] h-[84px]"
                    resizeMode = "contain"/>

                    <Image 
                        source = {images.cards}
                        className = "max-w--[380px] w-full h-[300px]"
                        resizeMode="contain"
                    />

                    <View className="relative mt-5">
                        <Text className="text-3xl text-white font-bold text-center">
                            Videos with {''}
                            <Text className="text-secondary-200">Basico</Text>
                        </Text>
                        
                        <Image
                            source = {images.path}
                            className=" w-[136px] h-[15px] absolute-bottom-2 -right-8"
                            resizeMethod="contain"
                        />
                    </View>
                    <Text className="text-gray-100 mt-7 text-center text-sm font-pregular">Embark on a journey of limitless exploration!</Text>

                    <CustomButton 
                        title="Continue with Email"
                        handlePress={() => router.push('/sign-in')}
                        containerStyles = "w-full mt-7"></CustomButton>
                </View>
            </ScrollView>
            <StatusBar backgroundColor = '#161622' style = 'light'/>
        </SafeAreaView>
    )
}