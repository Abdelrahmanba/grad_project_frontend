import { Breadcrumb, Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { get } from '../../utils/apiCall'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import KinderGartenCards from '../../components/KindergartensCards/kinderGartenCards'

const { Content }  = Layout

export default function ChildHome() {
  const history = useHistory()
  let { id } = useParams()
  const [child, setChild] = useState({})
  const [appliedK, setAppliedK] = useState([])
  const token = useSelector((state) => state.user.token)
  const fetchChild = async () => {
    const res = await get(
      `/children/${id}?includeParent=true&includeChildStatus=true&includeRegisterApplications=true&includeKindergarten=true&applicationStatus=1`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      console.log(resJson)
      setAppliedK(resJson.register_applications)
      setChild(resJson)
    } else {
      history.push('/NotFound')
    }
  }
  useEffect(() => {
    fetchChild()
  }, [])

  return (
    <Layout className='layout'>
      <Content className='content'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <UserOutlined />
            <span>Parent</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{child.firstName}</Breadcrumb.Item>
        </Breadcrumb>
        <h1>{child.firstName + ' ' + child.lastName}</h1>
        <KinderGartenCards
          url='/kindergartens?pageNumber=1&pageSize=200&includeImages=true'
          appliable
          childId={id}
          appliedK={appliedK}
          onUpdate={() => fetchChild()}
        />
      </Content>
    </Layout>
  )
}
