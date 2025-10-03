import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Navbar from "../components/nav/Navbar";
import SidebarDonate from "../components/nav/SidebarDonate";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/scss/components/route-transitions.scss";

interface LayoutProps {
    children: React.ReactNode;
}

const LayoutDonate: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const nodeRef = useMemo(() => React.createRef<HTMLDivElement>(), [location.pathname]);

    return (
        <div className="container-fluid">
            <div className="row">
                <aside className="col-2 p-0">
                    <SidebarDonate />
                </aside>
                <div className="col-10 p-0 ps-5">
                    <Navbar />
                    <TransitionGroup component={null}>
                        <CSSTransition
                            key={location.pathname}
                            nodeRef={nodeRef}
                            classNames="fade-route"
                            timeout={{ enter: 300, exit: 200 }}
                            appear
                        >
                            <main ref={nodeRef} className="p-4 route-anim-container">
                                {children}
                            </main>
                        </CSSTransition>
                    </TransitionGroup>
                </div>
            </div>
        </div>
    );
};

export default LayoutDonate;
