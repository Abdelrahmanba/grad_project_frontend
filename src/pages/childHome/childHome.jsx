import {
  Breadcrumb,
  List,
  Button,
  Card,
  Descriptions,
  Empty,
  Layout,
  PageHeader,
  Tabs,
  Tag,
  Skeleton,
  Avatar,
  Spin,
  Menu,
} from 'antd'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import { get } from '../../utils/apiCall'
import './childHome.scss'
const { Content } = Layout

export default function ChildHome() {
  const [loading, setloading] = useState(true)
  const history = useHistory()
  let { id } = useParams()
  const menu = [
    {
      label: 'Profile',
      key: 'mail',
      icon: <MailOutlined style={{ fontSize: 24 }} />,
    },
    {
      label: 'Find Kindergarten',
      key: 'app',
      icon: <AppstoreOutlined style={{ fontSize: 24 }} />,
    },
    {
      label: 'Chat Center',
      key: 'SubMenu',
      icon: <SettingOutlined style={{ fontSize: 24 }} />,
    },
  ]
  const stat = {
    1: 'Under Review',
    2: 'Approved',
    3: 'Confirmed',
  }
  const [color, setColor] = useState('')
  const [child, setChild] = useState({ imgs: [], user: {} })
  const [activeApplications, setActiveApplications] = useState([])
  const [historyApplications, setHistoryApplications] = useState([])

  const items = [
    {
      label: 'Active Applications',
      key: 'Active',
      children: (
        <List>
          {activeApplications.map((e, i) => (
            <List.Item key={i}>
              <List.Item.Meta
                avatar={<Avatar src={process.env.REACT_APP_API_URL + e.kindergarten.imgs[0]} />}
                title={<Link to={'/kindergarten/' + e.kindergarten.id}>{e.kindergarten.name}</Link>}
                description={new Date(e.createdAt).toLocaleDateString()}
              />
              <div>
                <Tag color='blue'>{stat[e.ApplicationStatus]}</Tag>
              </div>
            </List.Item>
          ))}
        </List>
      ),
    }, // remember to pass the key prop
    {
      label: 'Application History',
      key: 'History',
      children: (
        <List>
          {historyApplications.map((e, i) => (
            <List.Item key={i}>
              <List.Item.Meta
                avatar={<Avatar src={process.env.REACT_APP_API_URL + e.kindergarten.imgs[0]} />}
                title={<Link to={'/kindergarten/' + e.kindergarten.id}>{e.kindergarten.name}</Link>}
                description={new Date(e.createdAt).toLocaleDateString()}
              />
              <div>
                <Tag color='blue'>{stat[e.ApplicationStatus]}</Tag>
              </div>
            </List.Item>
          ))}
        </List>
      ),
    },
  ]
  const token = useSelector((state) => state.user.token)
  const fetchk = async (id) => {
    const res = await get('/kindergartens/' + id, token)
    if (res.ok) {
      const resJson = await res.json()
      return resJson
    }
  }
  const fetchChild = async () => {
    const res = await get(
      `/children/${id}?includeParent=true&includeChildStatus=true&includeRegisterApplications=true&includeKindergarten=true&applicationStatus=1`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      if (resJson.childStatusId === 1) {
        setColor('volcano')
      }
      if (resJson.childStatusId === 2) {
        setColor('geekblue')
      }
      if (resJson.childStatusId === 3) {
        setColor('green')
      }
      if (resJson.register_applications) {
        resJson.register_applications.forEach(async (element) => {
          const kindergarten = await fetchk(element.kindergartenId)
          if (element.ApplicationStatus === 2) {
            setActiveApplications((a) => [...a, { ...element, kindergarten }])
          } else {
            setHistoryApplications((a) => [...a, { ...element, kindergarten }])
          }
        })
      }
      setChild(resJson)
      setloading(false)
    } else {
      history.push('/NotFound')
    }
  }
  useEffect(() => {
    fetchChild()
  }, [])
  if (loading) {
    return <Spin style={{ margin: '200px', display: 'flex', justifyContent: 'center' }} />
  } else
    return (
      <Layout className='layout' style={{ backgroundColor: '#efefef', alignItems: 'center' }}>
        <section className='menu-child'>
          <Menu theme='dark' mode='horizontal' items={menu} />
        </section>
        <Content
          className='content'
          style={{ backgroundColor: '#efefef', paddingTop: 0, width: '80vw', maxWidth: 1600 }}
        >
          <Card
            bodyStyle={{
              display: 'flex',
              flexDirection: 'row',
            }}
            className='child-card'
            hoverable={false}
            style={{ width: '100%' }}
          >
            <div
              className='child-bg'
              style={{
                backgroundImage: `url(${process.env.REACT_APP_API_URL + child.imgs[0]})`,
              }}
            />
            <section className='cbody'>
              <Descriptions
                title={<h1 style={{ margin: 0 }}>{child.firstName + ' ' + child.lastName}</h1>}
                layout='horizontal'
                bordered
                column={1}
              >
                <Descriptions.Item label='Date of birth'>{child.dateOfBirth}</Descriptions.Item>
                <Descriptions.Item label='Gender'>{child.gender}</Descriptions.Item>
                <Descriptions.Item label='Current Kindergarten'>
                  {child.kindergarten ? child.kindergarten.name : 'Not Enrolled'}
                </Descriptions.Item>

                <Descriptions.Item label='Status'>
                  <Tag color={color} key={child.childStatusId}>
                    {child.childStatusId === 1 && 'Looking For Kindergarten'}
                    {child.childStatusId === 2 && 'Enrolled'}
                    {child.childStatusId === 3 && 'Graduated'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                style={{ marginTop: 20 }}
                title={'Parent Info'}
                layout='horizontal'
                column={1}
                bordered
              >
                <Descriptions.Item label='Name'>
                  {child.user.firstName + ' ' + child.user.lastName}
                </Descriptions.Item>
                <Descriptions.Item label='Email'>{child.user.email}</Descriptions.Item>
                <Descriptions.Item label='Phone'>{child.user.phone}</Descriptions.Item>
              </Descriptions>
            </section>
          </Card>
          <Card
            className='child-card'
            hoverable={false}
            style={{ width: '100%', marginTop: 40 }}
            title={<h2 style={{ margin: 0 }}>Applications</h2>}
          >
            <Tabs className='cbody' style={{ paddingTop: 0 }} items={items} />
            <Button
              type='dashed'
              onClick={() => history.push('/all-kindergartens?child=' + child.id)}
              block
              style={{ height: 50, fontSize: 16 }}
            >
              Browser All Kindergartens
            </Button>
          </Card>
          <Card
            className='child-card'
            hoverable={false}
            style={{ width: '100%', marginTop: 40 }}
            title={<h2 style={{ margin: 0 }}>Kindergarten</h2>}
          >
            {child.kindergarten ? (
              <Descriptions
                title={<h1 style={{ margin: 0 }}>{child.firstName + ' ' + child.lastName}</h1>}
                layout='horizontal'
                bordered
                column={1}
              >
                <Descriptions.Item label='Date of birth'>{child.dateOfBirth}</Descriptions.Item>
                <Descriptions.Item label='Gender'>{child.gender}</Descriptions.Item>
                <Descriptions.Item label='Current Kindergarten'>
                  {child.kindergarten ? child.kindergarten.name : 'Not Enrolled'}
                </Descriptions.Item>

                <Descriptions.Item label='Status'>
                  <Tag color={color} key={child.childStatusId}>
                    {child.childStatusId === 1 && 'Looking For Kindergarten'}
                    {child.childStatusId === 2 && 'Enrolled'}
                    {child.childStatusId === 3 && 'Graduated'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
          <Card
            className='child-card'
            hoverable={false}
            style={{ width: '100%', marginTop: 40 }}
            title={<h2 style={{ margin: 0 }}>Child History</h2>}
          ></Card>
        </Content>
      </Layout>
    )
}
