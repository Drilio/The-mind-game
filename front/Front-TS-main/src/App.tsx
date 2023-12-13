import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Connexion from './routes/Connexion'
import Home from './routes/Home'
import ChangePassword from "./routes/ChangePassword.tsx";
const router = createBrowserRouter([
  {
    path: '/',
    element: <Connexion />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/change-password',
    element: <ChangePassword/>
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
