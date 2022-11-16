import { Breadcrumb, Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { get } from '../../utils/apiCall'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'

export default function ChildHome() {
  let { id } = useParams()
  const [child, setChild] = useState({})
  const token = useSelector((state) => state.user.token)
  useEffect(() => {
    const fetchChild = async () => {
      const res = await get(
        `/children/${id}?includeParent=false&includeChildStatus=true`,
        token
      )
      if (res.ok) {
        const resJson = await res.json()
        setChild(resJson)
      }
    }
    fetchChild()
  }, [])

  return (
    <Layout className="layout">
      <Content className="content">
        <Breadcrumb>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <UserOutlined />
            <span>Parent</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{child.firstName}</Breadcrumb.Item>
        </Breadcrumb>{' '}
      </Content>
    </Layout>
  )
}
