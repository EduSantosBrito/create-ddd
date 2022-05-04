import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routes as ExampleRoutes } from "./domain/example";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "react-query";

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

function App() {
    return (
        <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<div>loading...</div>}>
                    <Routes>
                        <Route path="/*" element={<ExampleRoutes />} />
                    </Routes>
                </Suspense>
            </QueryClientProvider>
        </ReduxProvider>
    );
}

export default App;
