import React, { useState } from "react"
import ReactDOM from "react-dom"
import { faFileUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAuth } from "../../contexts/AuthContext"
import { storage, database,firestore } from "../../firebase"
import { ref, uploadBytesResumable,getDownloadURL } from "firebase/storage"
import { ROOT_FOLDER } from "../../hooks/useFolder"
import { addDoc, collection,serverTimestamp,query,where,updateDoc,getDocs } from "firebase/firestore"
import { v4 as uuidV4 } from "uuid"
import { ProgressBar, Toast } from "react-bootstrap"

export default function AddFileButton({ currentFolder }) {
  const { currentuser } = useAuth()
  const [uploadingFiles,setUploadingFiles]=useState([])
  function handleUpload(e) {
    const file = e.target.files[0]
    if (currentFolder == null || file == null) return
    
    const id = uuidV4()
    setUploadingFiles(prevUploadingFiles => [
      ...prevUploadingFiles,
      { id: id, name: file.name, progress: 0, error: false },
    ])

    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`

    const storageRef=ref(storage,`/files/${currentuser.uid}/${filePath}`)
    const uploadTask = uploadBytesResumable(storageRef,file)

    uploadTask.on(
      "state_changed",
      snapshot => {

        const progress = snapshot.bytesTransferred / snapshot.totalBytes
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress }
            }
            return uploadFile
          })
        })

      },
      () => {

        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true }
            }
            return uploadFile
          })
        })

      },
      () => {

        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.filter(uploadFile => {
            return uploadFile.id !== id
          })
        })

        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          const q=query(collection(firestore,database.files),
          where("userId","==",currentuser.uid),
          where("folderId","==",currentFolder.id),
          where("name","==",file.name));
           getDocs(q).then(snapshot=>{
            if(!snapshot.empty)
            {
              const existingFileref=snapshot.docs[0].ref
              updateDoc(existingFileref,{url:url,createdAt: serverTimestamp()})
            }
            else
            {
             addDoc(collection(firestore, database.files),{
               url: url,
               name: file.name,
               createdAt: serverTimestamp(),
               folderId: currentFolder.id,
               userId: currentuser.uid,
             })
            }
           })
           
              //end 
            }
            )
            })
  }
  return (
    <>
      <label className="btn btn-outline-success btn m-0 mr-3">
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {uploadingFiles.map(file => (
              <Toast
                key={file.id}
                onClose={() => {
                  setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.filter(uploadFile => {
                      return uploadFile.id !== file.id
                    })
                  })
                }}
              >
                <Toast.Header
                  closeButton={file.error}
                  className="text-truncate w-100 d-block"
                >
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={!file.error}
                    variant={file.error ? "danger" : "primary"}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error"
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  )
}