import { Navigate, Route, Routes } from "react-router-dom";

// All layouts containers
import DefaultLayout from "@/layouts/Default";
import VerticalLayout from "@/layouts/Vertical";
import DetachedLayout from "@/layouts/Detached";
import HorizontalLayout from "@/layouts/Horizontal/";
import TwoColumnLayout from "@/layouts/TwoColumn/";
import { authProtectedFlattenRoutes, publicProtectedFlattenRoutes } from "./index";
import { useLayoutContext } from "@/context/useLayoutContext.jsx";
import { useAuthContext } from "@/context/useAuthContext.jsx";
import React from "react";
const AllRoutes = props => {
  const {
    isAuthenticated
  } = useAuthContext();
  const {
    orientation
  } = useLayoutContext();
  const getLayout = () => {
    let layoutCls = TwoColumnLayout;
    switch (orientation) {
      case 'horizontal':
        layoutCls = HorizontalLayout;
        break;
      case 'detached':
        layoutCls = DetachedLayout;
        break;
      case 'vertical':
        layoutCls = VerticalLayout;
        break;
      default:
        layoutCls = TwoColumnLayout;
        break;
    }
    return layoutCls;
  };
  const Layout = getLayout();
  return <React.Fragment>
            <Routes>
                <Route>
                    {publicProtectedFlattenRoutes.map((route, idx) => <Route path={route.path} element={<DefaultLayout {...props}>
                                    {route.element}
                                </DefaultLayout>} key={idx} />)}
                </Route>

                <Route>
                    {authProtectedFlattenRoutes.map((route, idx) => <Route path={route.path} element={!isAuthenticated ? <Navigate to={{
          pathname: "/auth/login",
          // hash:route.path,
          search: "next=" + route.path
        }} /> : <Layout {...props}>{route.element}</Layout>} key={idx} />)}
                </Route>
            </Routes>
        </React.Fragment>;
};
export default AllRoutes;