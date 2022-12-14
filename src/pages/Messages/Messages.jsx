import { Avatar, Empty, Layout, List, PageHeader } from 'antd'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { get } from '../../utils/apiCall'
const { Content } = Layout

export default function Messages() {
  const { id } = useParams()
  const db = getFirestore()
  const history = useHistory()
  const [child, setChild] = useState({ imgs: [], user: {} })
  const [kindergartens, setkindergartens] = useState([])

  const [kindergartensNames, setkindergartensNames] = useState([])
  const [loading, setLoading] = useState(false)

  const token = useSelector((state) => state.user.token)
  const docRef = doc(db, 'children', id.toString())
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

    const res = await get(`/children/${id}`, token)
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
        setkindergartensNames((kindergartensNames) => [...kindergartensNames, resJson])
      }
    }
    setLoading(false)
  }
  useEffect(() => {
    getDocs()
    fetchChild()
  }, [])

  return (
    <Layout className='layout' style={{ width: '100%' }}>
      <Content className='content'>
        <PageHeader
          className='site-page-header'
          onBack={() => history.push('/dashboard/')}
          title={'Messages Center -' + child.firstName}
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
            {kindergartensNames.length === 0 && <Empty />}
            {kindergartensNames.map((k, i) => (
              <List.Item key={i}>
                <List.Item.Meta
                  avatar={<Avatar src={`${process.env.REACT_APP_API_URL + k.imgs[0]}`} />}
                  title={<Link to={'/messages/' + id + '/' + kindergartens[i]}>{k.name}</Link>}
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
