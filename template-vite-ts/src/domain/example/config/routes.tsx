import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "react-query";

const Example = lazy(() => import("../pages/Example"));

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: twentyFourHoursInMs,
        },
    },
});

const ExampleRoutes = () => {
    return (
        <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="">
                        <Route index element={<Example />} />
                    </Route>
                </Routes>
            </QueryClientProvider>
        </ReduxProvider>
    );
};

export default ExampleRoutes;
