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
import KindergartenHome from '../pages/kindergartenHome/kindergartenHome'
import KindergartensList from '../pages/kindergartensList/kindergartensList'
import KindergartenControl from '../pages/kindergartenControl/kindergartenControl'
import ChatBoxCh from '../components/chatBox/chatBoxCh'
import ChatBoxK from '../components/chatBox/chatBoxK'
import Plans from '../components/plans/plans'
import Sem from '../components/sem/sem'

const Router = () => {
  return (
    <BrowserRouter>
      <MenuBar />
      <Switch>
        <Route path='/' exact component={Landing} />
        <Route path='/sign-in' exact component={SignIn} />
        <Route path='/register-kindergarten' exact component={RegisterK} />
        <Route path='/register-child' exact component={RegisterP} />

        <ProtectedRoute path='/dashboard' exact component={Dashboard} />
        <ProtectedRoute path={['/messages/:id']} exact component={Messages} />
        <ProtectedRoute path={'/messages/:cid/:kid/'} component={ChatBoxCh} />
        <ProtectedRoute path={'/kinder/messages/:cid/:kid/'} component={ChatBoxK} />

        <ProtectedRoute path='/settings' exact component={Settings} />

        <Route path='/child/:id' exact component={ChildHome} />
        <Route path='/kindergarten/:kid' exact component={KindergartenControl} />
        <Route path='/kindergarten/:kid/s/:sid' exact component={Sem} />

        <Route path='/kindergarten/:kid/plans/hr' component={Plans} />

        <Route path='/all-kindergartens' component={KindergartensList} />

        <Route path='/child/:cid/kindergarten/:kid' exact component={KindergartenHome} />

        <Route path='*' component={NotFound} />
      </Switch>
      <Footer />
    </BrowserRouter>
  )
}

export default Router
