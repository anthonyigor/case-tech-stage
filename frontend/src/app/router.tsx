import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AreasPage } from "../pages/AreasPage";
import { ProcessTreePage } from "../pages/ProcessTreePage";
import { PeoplePage } from "../pages/PeoplePage";
import { TeamPage } from "../pages/TeamPage";

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
      { 
        path: "/areas/:areaId/processos", 
        element: <ProcessTreePage /> 
      },
      {
        path: "/people",
        element: <PeoplePage />
      },
      {
        path: "/teams",
        element: <TeamPage />
      }
    ],
  },
]);