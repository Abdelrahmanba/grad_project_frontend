import React from 'react'
import './landing.scss'

import Page1 from './page1'
import Page2 from './page2'

export default function landing() {
  return (
    <div className='landing'>
      <Page1 />
      <Page2 />
    </div>
  )
}
