import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/Auth/AuthContext"


const ProductesRoute = () => {
  const { isAuthenticated } = useAuth();

  if(!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet/>
}

export default ProductesRoute