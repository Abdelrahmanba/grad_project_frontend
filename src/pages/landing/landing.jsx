import { Menu } from 'antd'
import React from 'react'
import './landing.scss'

export default function landing() {
  const items = [
    { label: 'About Us', key: 'About Us' },
    { label: 'Contact Us', key: 'Contact Us' },
    { label: 'Sign In', key: 'Sign In' }, // which is required
  ]
  return (
    <div>
      <Menu items={items} mode={'horizontal'} className='header' />
    </div>
  )
}
