import { Card, Divider, Space } from 'antd'
import React from 'react'

export default function Section({ title, children }) {
  return (
    <>
      <Divider orientation='left' className='divider'>
        {title}
      </Divider>
      <Space size={'large'} style={{ padding: '20px 0 20px' }} wrap>
        {children}
      </Space>
    </>
  )
}
