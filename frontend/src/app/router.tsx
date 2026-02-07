import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AreasPage } from "../pages/AreasPage";
import { ProcessTreePage } from "../pages/ProcessTreePage";

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
      { path: "/areas/:areaId/processos", element: <ProcessTreePage /> },
    ],
  },
]);