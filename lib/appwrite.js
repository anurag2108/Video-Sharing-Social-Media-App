import { Alert } from 'react-native';
import { Client,Account, ID, Avatars, Databases, Query, Storage} from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.ank.basico',
    projectId: '674f8c3f000ff75be6a2',
    databaseId:'674f8e7700138a7fef5f',
    userCollectionId: '674f8e9e003603917a86',
    vidoeCollectionId: '674f8ed80011749ee279',
    storageId: '674f906500249a45a92e'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId) 
    .setPlatform(config.platform) 
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email,password,username) => {
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email,password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId:newAccount.$id,
                email:email,
                username:username,
                avatar:avatarUrl,
            }
        );

        return newUser;

    } catch(error){
        console.log(error);
        throw new Error(error);
    }

}

export const signIn = async (email,password) =>{
    try{
        const session = await account.createEmailPasswordSession(email,password);
        return session;
    } catch(error){
        console.log(error);
        throw new Error(error);
    }
}

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }
  

export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

export const getAllPosts = async () =>{
    try{
        const posts = await databases.listDocuments(
            config.databaseId,
            config.vidoeCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    } catch(error){
        throw new Error(error);
    }
}

export const getLatestPosts = async () =>{
    try{
        const posts = await databases.listDocuments(
            config.databaseId,
            config.vidoeCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
        )
        return posts.documents;
    } catch(error){
        throw new Error(error);
    }
}

export const searchPosts = async (query) => {
    try{
        const posts = await databases.listDocuments(
            config.databaseId,
            config.vidoeCollectionId,
            [Query.search('title',query)]
        )
        return posts.documents;
    } catch(error){
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try{
        const posts = await databases.listDocuments(
            config.databaseId,
            config.vidoeCollectionId,
            [Query.equal('creator',userId), Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    } catch(error){
        throw new Error(error);
    }
}

export const signout = async () => {
    try{
        const session  = await account.deleteSession('current');
        return session;
    } catch(error){
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId, type) =>{
    let fileUrl;
    try {
        if(type === 'video'){
            fileUrl = storage.getFileView(console.storageId, fileId)
        } else if(type === 'image') {
            fileUrl = storage.getFilePreview(console.storageId, fileId, 2000,2000, 'top', 100);
        } else{
            throw new Error('Invalid file type');
        }

        if(!fileUrl){
            throw Error;
        }

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) =>{
    if(!file) return;

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    };

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const createVideo = async (form) =>{
    try {
        const {thumbnailUrl, videoUrl} = await Promise.all([
        uploadFile(form.thumbnail, 'image'),
        uploadFile(form.video, 'video')
        ]);

        const newPost = await databases.createDocument(console.databaseId, console.vidoeCollectionId, ID.unique(), {
            title: form.title,
            thumbnail: thumbnailUrl,
            prompt: form.prompt,
            creator: form.userId,
            video: videoUrl
        })

        return newPost;
        
    } catch (error) {
        throw new Error(error);
    }
}