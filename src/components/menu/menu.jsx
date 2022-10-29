import { Avatar, Menu } from 'antd'
import './menu.scss'
import React from 'react'
import Logo from '../../assets/logo.png'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { signOut } from '../../redux/userSlice'

export default function MenuBar() {
  const history = useHistory()
  const logo = <Avatar src={Logo} size='64' style={{ minWidth: 80, minHeight: 80 }} />

  const authState = useSelector((state) => state.user.authStatus)
  const dispatch = useDispatch()
  const [items, setItems] = useState()

  const name = 'Abdelrahman'

  const avatar = (
    <span>
      {name}{' '}
      <Avatar size={30} style={{ backgroundColor: '#d2001a' }}>
        {name[0] + name[1]}
      </Avatar>
    </span>
  )

  useEffect(() => {
    if (authState === 0) {
      setItems([
        { label: 'Kiddy', key: 'Kiddy', icon: logo },
        { label: 'About Us', key: 'AboutUs' },
        { label: 'Contact Us', key: 'ContactUs' },
        { label: 'Sign In', key: 'SignIn' }, // which is required
      ])
    } else if (authState === 1) {
      setItems([
        { label: 'Kiddy', key: 'kiddy', icon: logo },
        { label: 'Dashboard', key: 'dashboard' },
        { label: 'Messages', key: 'messages' },
        {
          label: avatar,
          key: 'name',
          children: [
            { label: 'My Profile', key: 'myProfile' },
            { label: 'Settings', key: 'settings' },
            { label: 'Sign Out', key: 'signOut' },
          ],
        }, // which is required
      ])
    }
  }, [authState])

  function onClick(e) {
    switch (e.key) {
      case 'kiddy':
        history.push('/')
        break
      case 'SignIn':
        history.push('/sign-in')
        break
      case 'SignIn':
        dispatch(signOut())
        history.push('/')
        break
      case 'dashboard':
        history.push('/parent-dashboard')
        break
      case 'messages':
        history.push('/parent-messeges')
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
      selectable={true}
      onClick={onClick}
      triggerSubMenuAction={'click'}
    />
  )
}
