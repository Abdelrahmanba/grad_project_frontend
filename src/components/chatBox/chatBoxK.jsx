import { Avatar, Breadcrumb, Button, Form, Input, Layout, List, PageHeader } from 'antd'
import React, { useEffect, useState } from 'react'
import {
  doc,
  arrayUnion,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  collection,
} from 'firebase/firestore'
import { ChatFeed, Message } from 'react-chat-ui'
import { useHistory, useParams } from 'react-router'
import { get } from '../../utils/apiCall'
import { useSelector } from 'react-redux'
import { db } from '../../utils/firebase'
const { Content } = Layout

export default function ChatBoxK() {
  const { kid, cid } = useParams()
  const [child, setChild] = useState({ imgs: [], user: {} })
  const [value, setValue] = useState('')
  const history = useHistory()
  const [kindergarten, setkindergarten] = useState({ imgs: [''] })

  const [messages, setmessages] = useState([])
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.user.token)
  const col = cid + '-' + kid

  const fetchChild = async () => {
    setLoading(true)
    const res = await get(`/children/${cid}`, token)
    if (res.ok) {
      const resJson = await res.json()
      setChild(resJson)
    }
    setLoading(false)
  }
  const fetchK = async () => {
    setLoading(true)
    const res = await get(`/kindergartens/${kid}`, token)
    if (res.ok) {
      const resJson = await res.json()
      setkindergarten(resJson)
    }

    setLoading(false)
  }

  useEffect(() => {
    const colRef = collection(db, col.toString())
    const q = query(colRef)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        setmessages((msgs) => [
          ...msgs,
          new Message({
            ...change.doc.data(),
            id: change.doc.data().id === 'c' ? 1 : 0,
          }),
        ])
      })
    })
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    fetchChild()
    fetchK()
  }, [])
  const sendMessage = async () => {
    await addDoc(collection(db, col), {
      message: value,
      id: 'k',
      senderName: kindergarten.name,
    })
    setValue('')
  }
  return (
    <Layout className='layout'>
      <Content className='content'>
        <PageHeader
          className='site-page-header'
          onBack={() => history.push('/kindergarten/' + kid)}
          title='Messages Center'
        />
        <div
          style={{
            maxWidth: '70%',
            margin: 'auto',
            border: '1px solid #efefef',
            padding: '10px 40px',
            borderRadius: 20,
          }}
        >
          <PageHeader
            style={{ margin: '-10px' }}
            title={child.firstName + ' ' + child.lastName}
            avatar={{
              src: process.env.REACT_APP_API_URL + child.imgs[0],
            }}
          ></PageHeader>
          <ChatFeed
            messages={messages} // Array: list of message objects
            showSenderName={true} // show the name of the user who sent the message
            bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
            hasInputField={false}
            maxHeight={600}
          />
          <Form onFinish={sendMessage}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Input.Group compact>
                <Input
                  style={{ width: 'calc(100% - 60px)' }}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button type='primary' htmlType='submit'>
                  Send
                </Button>
              </Input.Group>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  )
}
