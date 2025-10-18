import React, { Suspense, useEffect, useState } from "react";
import { Container } from "react-bootstrap";

// utils
import { toggleDocumentAttribute } from "@/utils";
import { useViewport } from "@/hooks/useViewPort";
import { useLayoutContext } from "@/context/useLayoutContext.jsx";

// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const Topbar = React.lazy(() => import("../Topbar"));
const Navbar = React.lazy(() => import("./Navbar"));
const Footer = React.lazy(() => import("../Footer"));
const RightSidebar = React.lazy(() => import("../RightSidebar"));
const loading = () => <div className="text-center"></div>;
const HorizontalLayout = ({
  children
}) => {
  const {
    width
  } = useViewport();
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const {
    topBar,
    menu,
    width: layoutWidth,
    theme,
    showTwoToneIcons,
    changeMenuSize,
    changeLayoutOrientation,
    themeCustomizer
  } = useLayoutContext();
  useEffect(() => {
    if (width < 1140) {
      changeLayoutOrientation('vertical');
      changeMenuSize('full');
    } else if (width >= 1140) {
      changeLayoutOrientation('horizontal');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  /*
  layout defaults
  */
  useEffect(() => {
    toggleDocumentAttribute("data-layout", 'horizontal');
  }, []);
  useEffect(() => {
    toggleDocumentAttribute("data-menu-color", menu.theme);
  }, [menu.theme]);
  useEffect(() => {
    toggleDocumentAttribute("data-bs-theme", theme);
  }, [theme]);
  useEffect(() => {
    toggleDocumentAttribute("data-layout-width", layoutWidth);
  }, [layoutWidth]);
  useEffect(() => {
    toggleDocumentAttribute("data-menu-position", menu.position);
  }, [menu.position]);
  useEffect(() => {
    toggleDocumentAttribute("data-menu-icon", showTwoToneIcons ? "twotones" : "default");
  }, [showTwoToneIcons]);
  useEffect(() => {
    toggleDocumentAttribute("data-topbar-color", topBar.theme);
  }, [topBar.theme]);

  /**
   * Open the menu when having mobile screen
   */
  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
    if (document.body) {
      if (isMenuOpened) {
        document.body.classList.remove("sidebar-enable");
      } else {
        document.body.classList.add("sidebar-enable");
      }
    }
  };
  return <>
            <div id="wrapper">
                <Suspense fallback={loading()}>
                    <Navbar />
                </Suspense>

                <div className="content-page">
                    <Suspense fallback={loading()}>
                        <Topbar openLeftMenuCallBack={openMenu} topbarDark={false} />
                    </Suspense>

                    <div className="content">
                        <Container fluid>
                            <Suspense fallback={loading()}>{children}</Suspense>
                        </Container>
                    </div>

                    <Suspense fallback={loading()}>
                        <Footer />
                    </Suspense>

                    {themeCustomizer.open && <Suspense fallback={loading()}>
                            <RightSidebar />
                        </Suspense>}
                </div>
            </div>
        </>;
};
export default HorizontalLayout;