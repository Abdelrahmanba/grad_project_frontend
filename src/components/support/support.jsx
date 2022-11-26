import { Avatar, Breadcrumb, Empty, Layout, List, PageHeader } from 'antd'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'

import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import { useHistory, useParams } from 'react-router'
import { get } from '../../utils/apiCall'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
const { Content } = Layout

export default function Messages() {
  const { kid } = useParams()
  const db = getFirestore()
  const history = useHistory()
  const [kindergarten, setKindergarten] = useState({ imgs: [] })
  const [children, setChildren] = useState([])

  const [childrenNames, setChildrenNames] = useState([])
  const [loading, setLoading] = useState(false)

  const token = useSelector((state) => state.user.token)
  const docRef = doc(db, 'kindergartens', kid.toString())
  const getDocs = async () => {
    setLoading(true)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setChildren(docSnap.data().children)
    } else {
      await setDoc(docRef, { children: [] })
      setChildren([])
    }
    await fetchC(docSnap.data().children)
    setLoading(false)
  }

  const fetchKindergarten = async () => {
    setLoading(true)

    const res = await get(`/kindergartens/${kid}`, token)
    if (res.ok) {
      const resJson = await res.json()
      setKindergarten(resJson)
    }
    setLoading(false)
  }
  const fetchC = async (children) => {
    setLoading(true)
    for (const c of children) {
      const res = await get(`/children/${c}`, token)
      if (res.ok) {
        const resJson = await res.json()
        setChildrenNames((childrenNames) => [...childrenNames, resJson])
      }
    }
    setLoading(false)
  }
  useEffect(() => {
    getDocs()
    fetchKindergarten()
  }, [])

  return (
    <Layout className='layout'>
      <Content className='content'>
        <PageHeader
          className='site-page-header'
          onBack={() => history.push('/dashboard/')}
          title={'Messages Center -' + kindergarten.name}
        />
        <div
          style={{
            border: '1px solid #eee',
            height: 400,
            overflow: 'auto',
            padding: '0 16px',
          }}
        >
          <List loading={loading}>
            {childrenNames.length === 0 && <Empty />}
            {childrenNames.map((k, i) => (
              <List.Item key={i}>
                <List.Item.Meta
                  avatar={<Avatar src={`${process.env.REACT_APP_API_URL + k.imgs[0]}`} />}
                  title={
                    <Link to={'/kinder/messages/' + children[i] + '/' + kid}>
                      {k.firstName + ' ' + k.lastName}
                    </Link>
                  }
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
