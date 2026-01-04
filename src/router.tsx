import { createBrowserRouter } from "react-router-dom";
import Signin from "./components/Signin";
import Dashboard from "./routes/Dashboard";
import Header from "./components/Header";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Signin />,
    },
    {
        path: "/dashboard",
        element: (
            <>
                <Header />
                <Dashboard />
            </>
        ),
    },
])