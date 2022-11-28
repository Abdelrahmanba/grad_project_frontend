import { Button, Form, Layout, Space, Steps } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useState } from 'react'
import { RightSquareOutlined, SwapRightOutlined } from '@ant-design/icons'
import img from './img.jpg'
export default function FindKindergarten() {
  const [current, setCurrent] = useState(0)
  const onChange = (value) => {
    console.log('onChange:', current)
    setCurrent(value)
  }
  const successCallback = (position) => {
    console.log(position)
  }

  const errorCallback = (error) => {
    console.log(error)
  }
  const description = 'This is a description.'
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
              Feature
            </h2>
            <p>Monitors activity to identify project roadblocks</p>
          </li>
          <li className='feature-card'>
            <h2>
              <SwapRightOutlined />
              Feature
            </h2>
            <p>Monitors activity to identify project roadblocks</p>
          </li>
          <li className='feature-card'>
            <h2>
              <SwapRightOutlined />
              Feature
            </h2>
            <p>Monitors activity to identify project roadblocks</p>
          </li>
          <li className='feature-card'>
            <h2>
              <SwapRightOutlined />
              Feature
            </h2>
            <p>Monitors activity to identify project roadblocks</p>
          </li>
        </Space>
        <Content className='content'>
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
                title: <h2 style={{ padding: 0, margin: 0 }}>Results</h2>,
              },
            ]}
          />
          {current === 0 && (
            <section>
              <Button
                onClick={() =>
                  navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
                }
              >
                Get my current Location
              </Button>
              OR
              <Form></Form>
            </section>
          )}
          {current === 1 && 'test 2'}
          {current === 2 && 'test 3'}
        </Content>
      </Content>
    </Layout>
  )
}
