import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import NotFound from '../pages/NotFound/notFound'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.user)
  return (
    <Route
      {...rest}
      render={(props) => {
        if (user.authStatus !== 0) {
          return <Component {...rest} {...props} />
        } else {
          return (
            <Redirect
              to={{
                pathname: '/sign-in',
                state: {
                  from: props.location,
                  redirected: true,
                },
              }}
            />
          )
        }
      }}
    />
  )
}

export default ProtectedRoute
