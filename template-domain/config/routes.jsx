import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const __PASCAL_REPLACE__ = lazy(() => import("../pages/__PASCAL_REPLACE__"));

const __PASCAL_REPLACE__Routes = () => {
    return (
        <Routes>
            <Route path="">
                <Route index element={<__PASCAL_REPLACE__ />} />
            </Route>
        </Routes>
    );
};

export default __PASCAL_REPLACE__Routes;
