import { message } from 'antd'
import store from '../redux/store'
import { signOut } from '../redux/userSlice'

export const get = async (url, token = undefined) => {
  try {
    const res = await fetch(process.env.REACT_APP_API_URL + url, {
      headers: new Headers({
        ...(token && { Authorization: 'Bearer ' + token }),
        Accept: 'application/json',
      }),
    })
    if (res.status === 401) {
      store.dispatch(signOut())
    }
    return res
  } catch (e) {
    return message.error('Something Wrong')
  }
}

export const post = async (url, token = undefined, body) => {
  try {
    const res = await fetch(process.env.REACT_APP_API_URL + url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...(token && { Authorization: 'Bearer ' + token }),
      }),
      body: JSON.stringify(body),
    })
    if (res.status === 401) {
      store.dispatch(signOut())
    }
    return res
  } catch (e) {
    return message.error('Something Wrong')
  }
}
