import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routes as ExampleRoutes } from "./domain/example";

function App() {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <Routes>
                <Route path="/*" element={<ExampleRoutes />} />
            </Routes>
        </Suspense>
    );
}

export default App;
