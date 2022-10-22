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
        if (user.token) {
          if (
            (user.user.activeEmail === false && props.location.pathname !== '/CompleteProfile') ||
            (user.user.activeCommttiee === false && props.location.pathname !== '/CompleteProfile')
          ) {
            return (
              <Redirect
                to={{
                  pathname: '/CompleteProfile',
                  state: {
                    from: props.location,
                    redirected: true,
                  },
                }}
              />
            )
          } else {
            if (props.location.pathname.includes('Admin')) {
              if (user.user.role === 'committee' || user.user.role === 'admin') {
                return <Component {...rest} {...props} />
              } else {
                return <NotFound />
              }
            }
            return <Component {...rest} {...props} />
          }
        } else {
          return (
            <Redirect
              to={{
                pathname: '/signIn',
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
