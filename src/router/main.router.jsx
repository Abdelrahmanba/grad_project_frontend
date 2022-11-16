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
import Settings from '../pages/settings/settings'
import RegisterP from '../pages/registerP/registerP'

const Router = () => {
  return (
    <BrowserRouter>
      <MenuBar />
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/sign-in" exact component={SignIn} />
        <Route path="/register-kindergarten" exact component={RegisterK} />
        <Route path="/register-child" exact component={RegisterP} />

        <ProtectedRoute path="/dashboard" exact component={Dashboard} />
        <ProtectedRoute path="/messeges" exact component={Messages} />
        <ProtectedRoute path="/settings" exact component={Settings} />

        <Route path="/child/:id" component={ChildHome} />

        <Route path="*" component={NotFound} />
      </Switch>
      <Footer />
    </BrowserRouter>
  )
}

export default Router
