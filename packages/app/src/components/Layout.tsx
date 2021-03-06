import React, {FC, ReactNode, useEffect, useState} from "react"
import {useRelayEnvironment} from "react-relay"
import {fetchQuery} from "relay-runtime"

import {UserQuery} from "@app/src/queries/User"

import {UserQuery as UserQueryType} from "../queries/__generated__/UserQuery.graphql"
import Navbar from "./atomic/2-molecules/Navbar"
import Modal from "./modal/Modal"
import ModalContext from "./modal/ModalContext"
import UserContext, {UserContextType} from "./UserContext"

const Layout: FC = ({children}) => {
  const [user, setUser] = useState<UserContextType>({isSignedIn: null})

  const environment = useRelayEnvironment()
  useEffect(() => {
    fetchQuery<UserQueryType>(environment, UserQuery, {}).subscribe({
      error: () => {
        setUser({isSignedIn: false})
      },
      next: ({user}) => {
        setUser({isSignedIn: true, ...user})
      },
    })
  }, [environment])

  // Modal logic
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalContents, setModalContents] = useState<ReactNode>()

  return (
    <UserContext.Provider value={{user, setUser}}>
      <ModalContext.Provider value={{setIsModalVisible, setModalContents}}>
        <style jsx global>{`
          span {
            margin-bottom: -0.2em;
          }
        `}</style>
        <div className="min-h-screen grid" style={{gridTemplateRows: `max-content 1fr`}}>
          <Navbar className="sticky t-0 l-0" />
          <main>{children}</main>
          {isModalVisible && <Modal>{modalContents}</Modal>}
        </div>
      </ModalContext.Provider>
    </UserContext.Provider>
  )
}

export default Layout
