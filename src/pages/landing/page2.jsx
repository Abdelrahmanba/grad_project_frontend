import { Carousel } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
export default function Page2() {
  return (
    <section className='layout page2'>
      <Content className='content'>
        <h1 style={{ textTransform: 'capitalize' }}>What Users say about us</h1>
        <Carousel autoplay>
          <div className='slide'>
            <div className='testimonial'>
              <blockquote>
                “ Kiddy ticks all the boxes! Extremely easy to navigate; intuitive and easy on the
                eye. Observations are a joy and not a chore; our team actually look forward to
                entering their data! The people at Blossom are just wonderful; so helpful,
                knowledgeable, efficient and friendly.”
              </blockquote>
              <p className='author'>
                Jan Sinclair
                <span>Grandmother</span>
              </p>
            </div>

            <div className='slider-img'>
              <img
                src='https://alcs-slider.netlify.app/images/image-tanya.jpg'
                alt='Author Image'
              />
            </div>
          </div>
          <div className='slide'>
            <div className='testimonial'>
              <blockquote>
                “ It is hard to come by people with such a genuine interest in helping their
                customers. We feel very lucky to have a dedicated account manager that has helped us
                get started on our Kiddy journey.”
              </blockquote>
              <p className='author'>
                Kelly Kapoor
                <span>Kinderfarten Owner</span>
              </p>
            </div>

            <div className='slider-img'>
              <img
                src='https://media.istockphoto.com/id/846730696/photo/portrait-teenager.jpg?b=1&s=170667a&w=0&k=20&c=PNz3dsppr_Q0s_dNI_LaZdoY0oQtH812tvwZ13n-ods='
                alt='Author Image'
              />
            </div>
          </div>
          <div className='slide'>
            <div className='testimonial'>
              <blockquote>
                “ The Kiddy team are driven and really understand the needs of the modern childcare
                provider. Kiddy has cut the amount of time spent doing paperwork, which means our
                childcare team can focus on the children and their needs.” ”
              </blockquote>
              <p className='author'>
                Pam Beesly
                <span>Mother</span>
              </p>
            </div>

            <div className='slider-img'>
              <img
                src='https://media.istockphoto.com/id/1170911876/photo/selfie-time.jpg?b=1&s=170667a&w=0&k=20&c=ptX2-VggRmWw9M33keVHbfp2-MHUE0k9c3YKlS4QOKs='
                alt='Author Image'
              />
            </div>
          </div>
        </Carousel>
      </Content>
    </section>
  )
}
