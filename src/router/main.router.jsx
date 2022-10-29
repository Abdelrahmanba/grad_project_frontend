import { Switch, BrowserRouter, Route } from 'react-router-dom'
import NotFound from '../pages/NotFound/notFound'
import Landing from '../pages/landing/landing'
import MenuBar from '../components/menu/menu'
import RegisterK from '../pages/registerK/registerK'
import Footer from '../components/footer/Footer'
import SignIn from '../pages/signIn/signIn'
import Dashboard from '../pages/dashboard/dashboard'
import ParentMessages from '../pages/parentMessages/parentMessages'

const Router = () => {
  return (
    <BrowserRouter>
      <MenuBar />
      <Switch>
        <Route path='/' exact component={Landing} />
        <Route path='/sign-in' exact component={SignIn} />
        <Route path='/register-kindergarten' exact component={RegisterK} />
        <Route path='/parent-dashboard' exact component={Dashboard} />
        <Route path='/parent-messeges' exact component={ParentMessages} />
        <Route path='*' component={NotFound} />
      </Switch>
      <Footer />
    </BrowserRouter>
  )
}

export default Router
