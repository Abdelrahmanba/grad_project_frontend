import { Switch, BrowserRouter, Route } from 'react-router-dom'
import NotFound from '../pages/NotFound/notFound'
import Landing from '../pages/landing/landing'
import MenuBar from '../components/menu/menu'
import RegisterK from '../pages/registerK/registerK'
import Footer from '../components/footer/Footer'
import SignIn from '../pages/signIn/signIn'
import Dashboard from '../pages/dashboard/dashboard'
import Messages from '../pages/Messages/Messages'
import ChildHome from '../pages/childHome/childHome'
import ProtectedRoute from './protectedRoute'

const Router = () => {
  return (
    <BrowserRouter>
      <MenuBar />
      <Switch>
        <Route path='/' exact component={Landing} />
        <Route path='/sign-in' exact component={SignIn} />
        <Route path='/register-kindergarten' exact component={RegisterK} />
        <ProtectedRoute path='/dashboard' exact component={Dashboard} />
        <ProtectedRoute path='/messeges' exact component={Messages} />
        <Route path='/child-home/' component={ChildHome} />

        <Route path='*' component={NotFound} />
      </Switch>
      <Footer />
    </BrowserRouter>
  )
}

export default Router
