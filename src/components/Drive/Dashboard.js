import React from 'react'
import { Container } from 'react-bootstrap'
import { useFolder } from '../../hooks/useFolder'
import AddFolderButton from './AddFolderButton'
import Folder from './Folder'
import File from './File'
import NavbarComponent from './Navbar'
import { useParams} from 'react-router-dom'
import FolderBreadcrumbs from './FolderBreadcrumbs'
import AddFileButton from './AddFileButton'

export default function Dashboard() {
  const {folderId} = useParams()
 // const {state={}}=useLocation()
 // console.log(state)
  const {folder,childFolders,childFiles}=useFolder(folderId)
  return (
    <>
    <NavbarComponent/>
    <Container fluid>
    <div className="d-flex align-items-center">
          <FolderBreadcrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder}/>
          &nbsp;&nbsp;
          <AddFolderButton currentFolder={folder} />
       </div>
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map(childFolder => (
              <div
                key={childFolder.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map(childFile => (
              <div
                key={childFile.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
    </Container>
    </>
  )
}

