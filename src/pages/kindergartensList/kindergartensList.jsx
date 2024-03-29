import { Layout } from 'antd'
import Search from 'antd/lib/input/Search'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import KinderGartenCards from '../../components/KindergartensCards/kinderGartenCards'
import KinderGartenCardsuser from '../../components/KindergartensCards/kinderGartenCardsuser'
import { get } from '../../utils/apiCall'

export default function KindergartensList() {
  const { search } = useLocation()
  const id = search.match(/(\d+)/)[0]
  const [child, setChild] = useState({ imgs: [], user: {} })
  const [appliedS, setAppliedS] = useState([])
  const token = useSelector((state) => state.user.token)
  const history = useHistory()
  const fetchChild = async () => {
    const res = await get(
      `/children/${id}?includeParent=true&includeChildStatus=true&includeRegisterApplications=true&includeKindergarten=true&applicationStatus=1`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      setAppliedS(resJson.register_applications)
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
        <h1>All Kindergartens</h1>
        
        <KinderGartenCardsuser
          appliable
          childId={id}
          appliedS={appliedS}
          onUpdate={() => fetchChild()}
        />
      </Content>
    </Layout>
  )
}
