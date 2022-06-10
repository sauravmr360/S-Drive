import { useEffect, useReducer } from "react";
import { getDoc,doc, collection, where, orderBy, onSnapshot,query } from "firebase/firestore";
import { firestore,database } from "../firebase";
import { useAuth } from "../contexts/AuthContext";


const ACTION={
    SELECT_FOLDER:'select-folder',
    UPDATE_FOLDER:'update-folder',
    SET_CHILD_FOLDERS:'set-child-folders',
    SET_CHILD_FILES:'set-child-files'
}

export const ROOT_FOLDER={ name:'Root',id:null,path:[] }

function reducer(state,{type,payload})
{ 
   switch(type)
   {
       case ACTION.SELECT_FOLDER:
           return{
               folder:payload.folder,
               folderId:payload.folderId,
               childFolders:[],
               childFiles:[]
           }
        case ACTION.UPDATE_FOLDER:
            return {
                ...state,
                folder:payload.folder
            }   
        case ACTION.SET_CHILD_FOLDERS:
            return {  
                ...state,
                childFolders:payload.childFolders
            }  
        case ACTION.SET_CHILD_FILES:
            return {  
                ...state,
                childFiles:payload.childFiles
            }    
        default:
            return state
   }
}

export function useFolder(folderId=null ,folder =null)
{
   const [state,dispatch]=useReducer(reducer,{
       folderId,
       folder,
       childFolders: [],
       childFiles: []
   })
   
   const {currentuser}=useAuth()

   useEffect(()=>{
     dispatch({type:ACTION.SELECT_FOLDER,payload:{folder,folderId}})
   },[folder,folderId])
   
   useEffect(()=>{
       if(folderId==null)
       {
       return dispatch({type:ACTION.UPDATE_FOLDER,payload:{folder:ROOT_FOLDER}})
       }
       getDoc(doc(firestore,database.folders,folderId))
       .then(doc=>{
           dispatch({type:ACTION.UPDATE_FOLDER,payload:{folder:database.formatDoc(doc)}})
       })
       .catch(()=>{
        dispatch({type:ACTION.UPDATE_FOLDER,payload:{folder:ROOT_FOLDER}})
       })
   },[folderId])

   useEffect(()=>{
   const q=query(collection(firestore,database.folders),
    where("parentId","==",folderId),
    where("userId","==",currentuser.uid),
    orderBy("createdAt","asc"));

    return onSnapshot(q,(snapshot)=>{
        dispatch({
             type:ACTION.SET_CHILD_FOLDERS,
             payload:{childFolders:snapshot.docs.map((doc)=>{return database.formatDoc(doc)})}
            })
    });
   },[folderId,currentuser])

   useEffect(()=>{
    const q=query(collection(firestore,database.files),
     where("folderId","==",folderId),
     where("userId","==",currentuser.uid),
     orderBy("createdAt","asc"));
 
     return onSnapshot(q,(snapshot)=>{
         dispatch({
              type:ACTION.SET_CHILD_FILES,
              payload:{childFiles:snapshot.docs.map((doc)=>{return database.formatDoc(doc)})}
             })
     });
    },[folderId,currentuser])

   return state
}