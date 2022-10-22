import { Route, Switch } from 'react-router-dom'
import ProtectedRoute from './protectedRoute'
//Headers
import AdminHeader from '../components/header/adminHeader'
import UserHeader from '../components/header/userHeader'
import PublicHeaderAlt from '../components/header/publicHeaderAlt'

const HeaderRouting = () => {
  return (
    <Switch>
      <Route path={['/signin', '/signup']} exact component={PublicHeaderAlt} />
      <ProtectedRoute path='/Member' component={UserHeader} />
      <ProtectedRoute path='/Admin' component={AdminHeader} />
    </Switch>
  )
}

export default HeaderRouting
