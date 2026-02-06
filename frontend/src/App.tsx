import { Toaster } from 'react-hot-toast'
import { Layout } from './components/layout/Layout'

function App() {
  return (
    <div>
      <Toaster position='top-right'/>
      <Layout />
    </div>
  )
}

export default App
