import { Avatar, Menu } from 'antd'
import './menu.scss'
import React from 'react'
import Logo from '../../assets/logo.png'
import { useHistory } from 'react-router-dom'

export default function MenuBar() {
  const history = useHistory()
  const logo = <Avatar src={Logo} size='64' style={{ minWidth: 80, minHeight: 80 }} />
  const items = [
    { label: 'Kiddy', key: 'Kiddy', icon: logo },
    { label: 'About Us', key: 'About Us' },
    { label: 'Contact Us', key: 'Contact Us' },
    { label: 'Sign In', key: 'Sign In' }, // which is required
  ]

  function onClick(e) {
    switch (e.key) {
      case 'Kiddy':
        history.push('/')
        break

      default:
        break
    }
  }
  return (
    <Menu
      items={items}
      mode={'horizontal'}
      className='header'
      selectable={false}
      onClick={onClick}
    />
  )
}
