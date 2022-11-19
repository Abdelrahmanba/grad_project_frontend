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

  const user = useSelector((state) => state.user)

  const name = user.authStatus === 0 ? '' : user.user.firstName
  const { authStatus } = user
  const dispatch = useDispatch()
  const [items, setItems] = useState()

  useEffect(() => {
    const avatar = (
      <span>
        {name}{' '}
        <Avatar size={30} style={{ backgroundColor: '#d2001a' }}>
          {name[0]}
        </Avatar>
      </span>
    )
    if (authStatus === 0) {
      setItems([
        { label: 'Kiddy', key: 'Kiddy', icon: logo },
        { label: 'About Us', key: 'AboutUs' },
        { label: 'Contact Us', key: 'ContactUs' },
        { label: 'Sign In', key: 'SignIn' }, // which is required
      ])
    } else if (authStatus === 2 || authStatus === 1) {
      setItems([
        { label: 'Kiddy', key: 'Kiddy', icon: logo },
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
    } else if (authStatus === 3) {
      setItems([
        { label: 'Kiddy', key: 'Kiddy', icon: logo },
        { label: 'Manager Dashboard', key: 'dashboard' },
        { label: 'Sign Out', key: 'signOut' },
      ])
    }
  }, [authStatus, name])

  function onClick(e) {
    switch (e.key) {
      case 'Kiddy':
        if (authStatus === 0) {
          history.push('/')
        } else {
          history.push('/dashboard')
        }
        break
      case 'SignIn':
        history.push('/sign-in')
        break
      case 'settings':
        history.push('/settings')
        break
      case 'signOut':
        dispatch(signOut())
        history.push('/')
        break
      case 'dashboard':
        history.push('/dashboard')
        break
      case 'messages':
        history.push('/messeges')
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
