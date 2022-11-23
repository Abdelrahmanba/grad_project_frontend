import { Avatar, Breadcrumb, Layout, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, onSnapshot, query, collection } from 'firebase/firestore'

import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import { useParams } from 'react-router'
import { get } from '../../utils/apiCall'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { db } from '../../utils/firebase'
const { Content } = Layout

export default function ChatBox() {
  const { kid, cid } = useParams()
  const [child, setChild] = useState({ imgs: [], user: {} })
  const [kindergarten, setkindergarten] = useState({})
  const [messages, setmessages] = useState([])
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.user.token)
  const docRef = doc(db, 'children', cid.toString())

  const getDocs = async () => {
    setLoading(true)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setkindergarten(docSnap.data().kindergartens)
    } else {
      await setDoc(docRef, { kindergartens: [] })
      setkindergarten([])
    }
    await fetchK(docSnap.data().kindergartens)
    setLoading(false)
  }

  const fetchChild = async () => {
    setLoading(true)
    const res = await get(`/children/${cid}`, token)
    if (res.ok) {
      const resJson = await res.json()
      setChild(resJson)
    }
    setLoading(false)
  }
  const fetchK = async (kindergartens) => {
    setLoading(true)
    const res = await get(`/kindergartens/${kid}`, token)
    if (res.ok) {
      const resJson = await res.json()
      setkindergarten(resJson)
    }

    setLoading(false)
  }

  useEffect(() => {
    const colRef = collection(db, (cid + '-' + kid).toString())
    const q = query(colRef)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        console.log(change.doc.data())
        setmessages((msgs) => [...msgs, change.doc.data()])
      })
      console.log(messages)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    getDocs()
    fetchChild()
  }, [])

  return (
    <Layout className='layout'>
      <Content className='content'>
        <h1>Messages Center - {child.firstName}</h1>
        <div
          style={{
            border: '1px solid #eee',
            height: 400,
            overflow: 'auto',
            padding: '0 16px',
          }}
        >
          {messages.map((m, i) => (
            <h1 key={i}>{m.body}</h1>
          ))}
        </div>
      </Content>
    </Layout>
  )
}
