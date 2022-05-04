import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "react-query";

const __PASCAL_REPLACE__ = lazy(() => import("../pages/__PASCAL_REPLACE__"));

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

const __PASCAL_REPLACE__Routes = () => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="">
            <Route index element={<__PASCAL_REPLACE__ />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default __PASCAL_REPLACE__Routes;
