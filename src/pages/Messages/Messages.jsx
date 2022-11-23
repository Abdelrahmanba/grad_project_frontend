import { Avatar, Breadcrumb, Layout, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'

import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import { useParams } from 'react-router'
import { get } from '../../utils/apiCall'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
const { Content } = Layout

export default function Messages() {
  const { kid, cid } = useParams()
  const db = getFirestore()
  const [child, setChild] = useState({ imgs: [], user: {} })
  const [kindergartens, setkindergartens] = useState([])

  const [kindergartensNames, setkindergartensNames] = useState([])
  const [loading, setLoading] = useState(false)

  const token = useSelector((state) => state.user.token)
  const docRef = doc(db, 'children', cid.toString())
  const getDocs = async () => {
    setLoading(true)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setkindergartens(docSnap.data().kindergartens)
    } else {
      await setDoc(docRef, { kindergartens: [] })
      setkindergartens([])
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
    for (const k of kindergartens) {
      const res = await get(`/kindergartens/${k}`, token)
      if (res.ok) {
        const resJson = await res.json()
        console.log(resJson.name)
        setkindergartensNames([...kindergartensNames, resJson])
      }
    }
    setLoading(false)
  }
  useEffect(() => {
    getDocs()
    fetchChild()
  }, [])
  // useEffect(() => {
  //   for (const k of kindergartens) {
  //     const querySnapshot = await getDocs(collection(db, cid + '-' + k));
  //   }
  // }, [kindergartens])
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
          <List loading={loading}>
            {kindergartensNames.map((k, i) => (
              <List.Item key={i}>
                <List.Item.Meta
                  avatar={<Avatar src={`${process.env.REACT_APP_API_URL + k.imgs[0]}`} />}
                  title={<Link to={'/messages/' + cid + '/' + kindergartens[i]}>{k.name}</Link>}
                  description={k.locationFormatted}
                />
              </List.Item>
            ))}
          </List>
        </div>
      </Content>
    </Layout>
  )
}
