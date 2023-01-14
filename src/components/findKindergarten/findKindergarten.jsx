import { Button, Divider, Form, Input, Layout, Radio, Select, Slider, Space, Statistic, Steps } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import { RightSquareOutlined, SwapRightOutlined } from '@ant-design/icons'
import img from './img.jpg'
import countries from '../../utils/countries'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import { useForm } from 'antd/lib/form/Form'
import { useSelector } from 'react-redux'
import { get } from '../../utils/apiCall'
import opencage from 'opencage-api-client'

import KinderGartenCards from '../KindergartensCards/kinderGartenCards'
import { useParams } from 'react-router-dom'
import Map2 from '../map/map2'
import MatchingList from '../KindergartensCards/matchingList'
export default function FindKindergarten() {
  const [current, setCurrent] = useState(0)
  const [location, setLocation] = useState({
    country: undefined,
    city: undefined,
    longitude: undefined,
    latitude: undefined,
  })
  const [tution, setTution] = useState([-1, -1])
  const [appliedK, setAppliedK] = useState([])
  const [url, seturl] = useState('')
  const [pos, setPos] = useState([32.22111, 35.25444])
  const [type, setType] = useState("exact")

  const { id } = useParams()

  const [form] = useForm()
  const history = useHistory()
  const user = useSelector((state) => state.user)

  const fetchChild = async () => {
    const res = await get(
      `/children/${id}?includeParent=true&includeChildStatus=true&includeRegisterApplications=true&includeKindergarten=true&applicationStatus=1`,
      user.token
    )
    if (res.ok) {
      const resJson = await res.json()
      setAppliedK(resJson.register_applications)
    } else {
      history.push('/NotFound')
    }
  }
  const onChange = (value) => {
    setCurrent(value)
  }
  const successCallback = async (position) => {
    const res = await opencage.geocode({
      key: 'dfbc15eb0c4f47238c36aa6ae7072741',
      q: position.coords.latitude + ',' + position.coords.longitude,
    })
    setPos([position.coords.latitude, position.coords.longitude])

    form.setFieldValue('latitude', position.coords.latitude)
    form.setFieldValue('longitude', position.coords.longitude)
    form.setFieldValue('city', res.results[0].components.city)
    form.setFieldValue('country', res.results[0].components.country)
  }
  const setPosition = async (position) => {
    const res = await opencage.geocode({
      key: 'dfbc15eb0c4f47238c36aa6ae7072741',
      q: position.latitude + ',' + position.longitude,
    })
    setPos([position.latitude, position.longitude])
    form.setFieldValue('latitude', position.latitude)
    form.setFieldValue('longitude', position.longitude)
    form.setFieldValue('city', res.results[0].components.city)
        if(res.results[0].components.country=="Palestinian Territory" ){
          form.setFieldValue('country', "Palestine")

        }else{
          form.setFieldValue('country', res.results[0].components.country)
        }
  }
  const onFinish = (values) => {
    setLocation(values)
    setCurrent(1)
  }
  const onFinishTution = (values) => {
    setTution(values.tution)
    setCurrent(2)
  }
  const onFinishType = (values) => {
    setType(values.type)
    setCurrent(3)
  }

  useEffect(() => {
    if (current === 3) {
      let url = `/matching?pageNumber=1&pageSize=10`
      if (location.city !== undefined && location.city !== '') {
        url += `&city=${location.city}`
      }
      if (location.country !== undefined && location.country !== '') {
        url += `&country=${location.country}`
      }
      if (location.latitude !== undefined && location.latitude !== '') {
        url += `&latitude=${location.latitude}`
      }
      if (location.longitude !== undefined && location.longitude !== '') {
        url += `&longitude=${location.longitude}`
      }
      url += `&minTuition=${tution[0]}&maxTuition=${tution[1]}&maxDistanceInKm=${location.distance}&registrationExpired=false`
      url+="&searchType="+type
      seturl(url)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])
  return (
    <Layout className='layout' style={{ width: '100%' }}>
      <Content className='content' style={{ padding: 0 }}>
        <h1 style={{ paddingLeft: 60, paddingBottom: 20 }}>
          Find the best kindergarten for your children
        </h1>
        <h2 style={{ width: 550, paddingLeft: 120 }}>
          <RightSquareOutlined /> Its as easy as filling up your data.
        </h2>
        <h3 style={{ paddingLeft: 120, paddingBottom: 60 }}>
          We will search our databases and give you the best options we have.
        </h3>
        <Space
          wrap
          className='plans find-bg'
          style={{
            padding: '0 60px',
            width: '100%',
            justifyContent: 'center',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center center',
          }}
        >
          <li className='feature-card'>
            <h2>
              <SwapRightOutlined />
              Quick And Easy
            </h2>
            <p>The results will show with in secends</p>
          </li>
          <li className='feature-card'>
            <h2>
              <SwapRightOutlined />
              Best Match
            </h2>
            <p>Monitors activity to project </p>
          </li>
          <li className='feature-card'>
            <h2>
              <SwapRightOutlined />
              Frequently Updated
            </h2>
            <p>New Kindergartens Joins Us daily</p>
          </li>
          <li className='feature-card'>
            <h2>
              <SwapRightOutlined />
              And Much More
            </h2>
            <p>Check it out yourself</p>
          </li>
        </Space>
        <Content
          className='content'
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <h1>Start The Proccess Now.</h1>
          <h2 style={{ paddingLeft: 60 }}>
            <RightSquareOutlined /> Its as easy as filling up your data.
          </h2>
          <h3 style={{ paddingLeft: 60, paddingBottom: 60 }}>
            Explore schools based on their distance from your home, locations, CCAs, subjects and
            programmes offered.
          </h3>
          <Steps
            style={{ padding: '0 60px 60px' }}
            current={current}
            onChange={onChange}
            direction='horizontal'
            items={[
              {
                title: <h2 style={{ padding: 0, margin: 0 }}>Location</h2>,
              },
              {
                title: <h2 style={{ padding: 0, margin: 0 }}>Tution</h2>,
              },
              {
                title: <h2 style={{ padding: 0, margin: 0 }}>Search Type</h2>,
              }, {
                title: <h2 style={{ padding: 0, margin: 0 }}>Results</h2>,
              },
            ]}
          />
          {current === 0 && (
            <Space
              style={{ padding: 30, alignItems: 'center', width: '100%' }}
              direction={'vertical'}
              wrap
            >
              <Button onClick={() => navigator.geolocation.getCurrentPosition(successCallback)}>
                Get my current Location
              </Button>
              <span>OR</span>
              <Map2 onChange={setPosition} pos={pos} />
              <Form
                form={form}
                style={{ width: '600px' }}
                name='basic'
                onFinish={onFinish}
                layout='horizontal'
                initialValues={{ distance: 30, country: 'Palestine' }}
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 18,
                }}
              >
                <Form.Item label='Longitude' name='longitude'>
                  <Input placeholder='Optional' />
                </Form.Item>
                <Form.Item label='Latitude' name='latitude'>
                  <Input placeholder='Optional' />
                </Form.Item>
                <Form.Item label='Country' name='country'>
                  <Select options={countries} />
                </Form.Item>
                <Form.Item label='City' name='city'>
                  <Input placeholder='Optional' />
                </Form.Item>
                <Form.Item
                  label='Max Distance from me'
                  name='distance'
                  rules={[
                    {
                      required: true,
                      message: 'Please input max distance!',
                    },
                  ]}
                >
                  <Slider
                    tooltip={{
                      formatter: (value) => (
                        <Statistic
                          valueStyle={{ color: 'white', fontSize: 18 }}
                          value={value}
                          suffix='km'
                        />
                      ),
                    }}
                    step={1}
                    min={0}
                    max={200}
                  />
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    offset: 6,
                    span: 18,
                  }}
                >
                  <Button type='primary' htmlType='submit' block>
                    Next
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          )}
          {current === 1 && (
            <Space
              style={{ padding: 30, alignItems: 'center', width: '100%' }}
              direction={'vertical'}
              wrap
            >
              <Form
                style={{ width: '600px' }}
                name='basic'
                initialValues={{ tution: [100, 500] }}
                onFinish={onFinishTution}
                layout='horizontal'
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 18,
                }}
              >
                <h2>Choose a range for your Tution</h2>
                <Form.Item
                  label='Tution'
                  name='tution'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your tution!',
                    },
                  ]}
                >
                  <Slider
                    tooltip={{
                      formatter: (value) => (
                        <Statistic
                          valueStyle={{ color: 'white', fontSize: 18 }}
                          value={value}
                          suffix='$'
                        />
                      ),
                    }}
                    range={{ draggableTrack: true }}
                    step={50}
                    min={0}
                    max={1000}
                  />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 6,
                    span: 18,
                  }}
                >
                  <Button type='primary' htmlType='submit' block>
                    Next
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          )}


{current === 2 && (
            <Space
              style={{ padding: 30, alignItems: 'center', width: '100%' }}
              direction={'vertical'}
              wrap
            >
              <Form
                style={{ width: '600px' }}
                name='basic'
                onFinish={onFinishType}
                layout='horizontal'
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 18,
                }}
              >
                <h2>Choose what type of results you want:</h2>
                <Form.Item
                  label='Type'
                  name='type'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your selection!',
                    },
                  ]}
                >
                  <Radio.Group defaultValue="a" size="large">
      <Radio.Button value="exact">Exact</Radio.Button>
      <Radio.Button value="most_similar">Most Similar</Radio.Button>
    </Radio.Group>
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 6,
                    span: 18,
                  }}
                >
                  <Button type='primary' htmlType='submit' block>
                    Next
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          )}
          {url !== '' && (
            <Space direction='vertical' style={{ width: '100%', padding: '60px' }}>
              {current === 3 && (
                <MatchingList
                  url={url}
                  matching
                  appliable
                  childId={id}
                  appliedK={appliedK}
                  onUpdate={() => fetchChild()}
                />
              )}
            </Space>
          )}
          <Space direction='vertical' style={{ width: '100%', padding: '60px' }}>
            <Divider />
            <Button
              style={{ width: '100%', height: 80 }}
              type='dashed'
              block
              onClick={() => history.push('/all-kindergartens?' + id)}
            >
              View All Kindergartens
            </Button>
          </Space>
        </Content>
      </Content>
    </Layout>
  )
}
