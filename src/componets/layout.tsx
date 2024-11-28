import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";

const Layout: React.FC = () => {
    return (
        <>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-6">
                        <h5>User Management</h5>
                    </div>
                    <Header />
                    <Outlet />
                </div>
            </div>
        </>
    )
}
export default Layout