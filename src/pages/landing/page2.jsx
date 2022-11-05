import { Carousel } from 'antd'
import React from 'react'

export default function Page2() {
  const contentStyle = {
    height: '160px',
    lineHeight: '200px',
    textAlign: 'center',
  }
  return (
    <section className='layout'>
      <h2>What parents say about us</h2>
      <Carousel autoplay>
        <div>
          <h3 style={contentStyle}>"Best way to find the right kindergarten"</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
    </section>
  )
}
