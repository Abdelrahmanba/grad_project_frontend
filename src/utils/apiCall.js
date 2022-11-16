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
    return res
  } catch (e) {
    return message.error('Something Wrong')
  }
}

export const postFile = async (url, token = undefined, body) => {
  try {
    const res = await fetch(process.env.REACT_APP_API_URL + url, {
      method: 'POST',
      headers: new Headers({
        ...(token && { Authorization: 'Bearer ' + token }),
      }),
      body: body,
    })
    return res
  } catch (e) {
    return message.error('Something Wrong')
  }
}
export const deleteCall = async (url, token = undefined) => {
  try {
    const res = await fetch(process.env.REACT_APP_API_URL + url, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...(token && { Authorization: 'Bearer ' + token }),
      }),
    })
    return res
  } catch (e) {
    return message.error('Something Wrong')
  }
}

export const patchCall = async (url, token = undefined, body) => {
  try {
    const res = await fetch(process.env.REACT_APP_API_URL + url, {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...(token && { Authorization: 'Bearer ' + token }),
      }),
      body: JSON.stringify(body),
    })
    return res
  } catch (e) {
    return message.error('Something Wrong')
  }
}
