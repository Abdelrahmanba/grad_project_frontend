import React from 'react'
import { Row, Col } from 'antd'
import './footer.scss'
function Footer() {
  return (
    <footer id='footer' className='dark'>
      <div className='footer-wrap'>
        <Row>
          <Col lg={6} sm={24} xs={24}>
            <div className='footer-center'>
              <h2>Kiddy School </h2>
              <div>
                
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Row className='bottom-bar'>
        <Col lg={4} sm={24} />
        <Col lg={20} sm={24}>
          <span>Copyright © Kiddy School</span>
        </Col>
      </Row>
    </footer>
  )
}

export default Footer
