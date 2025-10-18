import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/useAuthContext.jsx";

/**
 * Private Route forces the authorization before the route can be accessed.
 *
 * NOTE: This component is updated for react-router-dom v6+. 
 * It uses the 'element' prop when defined in a route configuration.
 *
 * @param {object} props
 * @param {string[]} [props.roles] - Array of roles required to access the route.
 * @returns {JSX.Element}
 */
const PrivateRoute = ({ roles }) => {
  // Use useAuthContext to get the current authentication state
  const { isAuthenticated, user } = useAuthContext();
  // Get the current location to redirect back to after login
  const location = useLocation();

  // 1. Check if the user is authenticated
  if (!isAuthenticated) {
    // If not logged in, redirect to the login page.
    // We pass the current path (location.pathname) in the 'state' 
    // so the login page knows where to send the user back after successful login.
    return <Navigate 
      to="/auth/login" 
      state={{ from: location }} 
      replace 
    />;
  }

  // 2. Check if the route is restricted by role
  if (roles && !roles.includes(user?.role)) {
    // If roles are defined and the user's role is not authorized,
    // redirect to the desired default page (e.g., a dashboard or product list)
    return <Navigate 
      to="/apps/ecommerce/products" // <-- Redirect target for unauthorized role
      replace 
    />;
  }

  // 3. If authenticated and authorized, render the child routes/elements.
  // The <Outlet /> component is used in v6 to render the next match in the route hierarchy.
  return <Outlet />;
};

export default PrivateRoute;