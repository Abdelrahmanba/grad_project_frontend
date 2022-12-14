// Router
import Router from './router/main.router'
// Redux
import { Provider } from 'react-redux'
import store from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
// AOS
import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'leaflet/dist/leaflet.css'
import { getTokenImp, onMessageListener } from './utils/firebase'
import { message } from 'antd'

let persistor = persistStore(store)

function App() {
  const [loading, setLoading] = useState(true)
  const [isTokenFound, setTokenFound] = useState(false)
  getTokenImp(setTokenFound)

  onMessageListener()
    .then((payload) => {
      message.success('heldddddddddddddddddlo')
      console.log('hello')
    })
    .catch((err) => console.log('failed: ', err))

  useEffect(() => {
    const el = document.querySelector('.spinner-pre')
    if (el) {
      el.remove()
      setLoading(false)
    }
    AOS.init()
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {!loading && <Router />}
      </PersistGate>
    </Provider>
  )
}

export default App
