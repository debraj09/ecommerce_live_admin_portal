import React, { Suspense, useEffect, useState } from "react";
import { Container } from "react-bootstrap";

// utils
import { toggleDocumentAttribute } from "@/utils";
import { useViewport } from "@/hooks/useViewPort";
import { useLayoutContext } from "@/context/useLayoutContext.jsx";

// code splitting and lazy loading
const Topbar = React.lazy(() => import("../Topbar"));
const LeftSidebar = React.lazy(() => import("./LeftSidebar"));
const Footer = React.lazy(() => import("../Footer"));
const RightSidebar = React.lazy(() => import("../RightSidebar"));
const loading = () => <div className="text-center"></div>;
const TwoColumnLayout = ({
  children
}) => {
  const {
    width
  } = useViewport();
  const {
    topBar,
    menu,
    mode,
    orientation,
    width: layoutWidth,
    theme,
    showTwoToneIcons,
    changeMenuSize,
    themeCustomizer
  } = useLayoutContext();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  /*
   * layout defaults
   */

  useEffect(() => {
    if (window.outerWidth < 1140) {
      changeMenuSize('full');
    } else if (width >= 1140) {
      changeMenuSize('default');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);
  useEffect(() => {
    toggleDocumentAttribute("data-layout", 'two-column');
  }, []);
  useEffect(() => {
    toggleDocumentAttribute("data-two-column-color", menu.theme);
  }, [menu.theme]);
  useEffect(() => {
    toggleDocumentAttribute("data-layout-mode", mode);
  }, [mode]);
  useEffect(() => {
    toggleDocumentAttribute("data-bs-theme", theme);
  }, [theme]);
  useEffect(() => {
    toggleDocumentAttribute("data-layout-width", layoutWidth);
  }, [layoutWidth]);
  useEffect(() => {
    toggleDocumentAttribute("data-menu-color", menu.theme);
  }, [menu.theme]);
  useEffect(() => {
    toggleDocumentAttribute("data-topbar-color", topBar.theme);
  }, [topBar.theme]);
  useEffect(() => {
    toggleDocumentAttribute("data-sidenav-size", menu.size);
  }, [menu.size]);
  useEffect(() => {
    toggleDocumentAttribute("data-menu-icon", showTwoToneIcons ? "twotones" : "default");
  }, [showTwoToneIcons]);

  /**
   * Open the menu when having mobile screen
   */
  const openMenu = () => {
    setIsMenuOpened(prevState => !prevState);
    if (document.body) {
      if (isMenuOpened) {
        document.body.classList.add("sidebar-enable");
      } else {
        document.body.classList.remove("sidebar-enable");
      }
    }
  };
  return <>
            <div id="wrapper" className="menuitem-active">
                <Suspense fallback={loading()}>
                    <LeftSidebar />
                </Suspense>

                <div className="content-page">
                    <Suspense fallback={loading()}>
                        <Topbar openLeftMenuCallBack={openMenu} topbarDark={true} />
                    </Suspense>

                    <div className="content">
                        <Container fluid>
                            <Suspense fallback={loading()}>{children}</Suspense>
                        </Container>
                    </div>

                    <Suspense fallback={loading()}>
                        <Footer />
                    </Suspense>
                </div>
            </div>
            {themeCustomizer.open && <Suspense fallback={loading()}>
                    <RightSidebar />
                </Suspense>}
        </>;
};
export default TwoColumnLayout;