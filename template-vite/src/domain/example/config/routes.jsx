import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Example = lazy(() => import("../pages/Example"));

const ExampleRoutes = () => {
    return (
        <Routes>
            <Route path="">
                <Route index element={<Example />} />
            </Route>
        </Routes>
    );
};

export default ExampleRoutes;
