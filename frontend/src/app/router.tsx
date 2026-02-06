import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AreasPage } from "../pages/AreasPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <AreasPage />,
      },
      {
        path: "/areas",
        element: <AreasPage />,
      },
      // depois:
      // { path: "/areas/:id/processos", element: <ProcessTreePage /> },
    ],
  },
]);