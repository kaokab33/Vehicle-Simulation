import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NotFound from './components/NotFound.jsx'
import Vehicles from './components/Vehicles/vehicles.jsx'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
const router = createBrowserRouter([
  {path:'/', element:<App/>},
  {path:'/vehicles',element:<Vehicles/>},
  {path:'*',element:<NotFound/>}
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
