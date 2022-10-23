import { Avatar, Menu } from 'antd'
import React from 'react'
import './landing.scss'
import Logo from '../../assets/logo.png'

export default function landing() {
  const logo = <Avatar src={Logo} size='64' style={{ minWidth: 80, minHeight: 80 }} />
  const items = [
    { label: 'Kiddy', key: 'Kiddy', icon: logo },
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
