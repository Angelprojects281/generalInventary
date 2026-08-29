import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface tokenPayload {
  idusers: string;
  rol: string;
  iat: number;
  exp: number;
}

interface props {
  page: React.ReactNode;
  authorizedRol: string;
}

function ProtectRoute({ page, authorizedRol }: props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const decodedToken = jwtDecode<tokenPayload>(token);

  if (authorizedRol && decodedToken.rol !== authorizedRol) {
    return <Navigate to="/" replace />;
  } else {
    return page;
  }
}

export default ProtectRoute;
