import React from 'react'

import PropTypes from 'prop-types'

import './quote.css'

const Quote = (props) => {
  return (
    <div className={`quote-quote ${props.rootClassName} `}>
      <div className="quote-quote1">
        <span className="quote-quote2">{props.Quote}</span>
      </div>
      <div className="quote-people">
        <div className="quote-person">
          <img
            alt="person-avatar"
            src={props.Avatar}
            className="quote-avatar"
          />
          <div className="quote-person-details">
            <span id="quote-author" className="quote-text">
              {props.Author}
            </span>
            <span id="quote-title" className="">
              {props.Title}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

Quote.defaultProps = {
  Quote:
    '“I love lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquaation ullamco 100%."',
  rootClassName: '',
  Title: 'Manager @Vista Social',
  Author: 'Andy Smith',
  Avatar: '/playground_assets/pastedimage-8jmb-200w.png',
}

Quote.propTypes = {
  Quote: PropTypes.string,
  rootClassName: PropTypes.string,
  Title: PropTypes.string,
  Author: PropTypes.string,
  Avatar: PropTypes.string,
}

export default Quote
