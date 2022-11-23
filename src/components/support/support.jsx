import { List } from 'antd'
import React from 'react'

export default function Support() {
  const item = { name: 'asfasf' }
  return (
    <>
      <h1>Customers Support</h1>
      <div
        style={{
          border: '1px solid #eee',
          height: 400,
          overflow: 'auto',
          padding: '0 16px',
        }}
      >
        <List>
          <List.Item key={item.email} style={{ minHeight: 70 }}>
            <List.Item.Meta
              title={<a href='https://ant.design'>{item.name}</a>}
              description={item.email}
            />
            <div>Content</div>
          </List.Item>
          <List.Item key={item.email}>
            <List.Item.Meta
              title={<a href='https://ant.design'>{item.name}</a>}
              description={item.email}
            />
            <div>Content</div>
          </List.Item>
        </List>
      </div>
    </>
  )
}
