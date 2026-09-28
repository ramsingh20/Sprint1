import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const location = useLocation();

  if (!userInfo) {
    return (<Navigate to="/login" replace state={{ from: location }} />);
  }

  const userRole = userInfo.role;

  if (!allowedRoles.includes(userRole)) {
    return (<Navigate to="/dashboard" replace />);
  }

  return <Outlet />;
};

export default RoleProtectedRoute;