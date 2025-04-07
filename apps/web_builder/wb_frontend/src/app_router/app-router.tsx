import {
  createBrowserRouter,
  RouterProvider
}
  from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider
}
  from '@tanstack/react-query';
import {
  AuthLayout,
  DefaultLayout,
  DefaultLayoutAdmin
}
  from '../layouts';
import {
  HomePage,
  DashboardPage,
  ListProjectsPage,
  NewAppPage,
  DetailProjectsPage,
  PageNotFound,
  LoginPage,
  RegisterPage,
  CreateProjectPage,
  UserProfilePage,
  ViewProjectPage,
  EditPage,
  CreateNewPage,
  UserListPage,
  PageDetail,
  PageShare,
} from '../pages';
import { ViewForUser } from '../components';

const queryClient = new QueryClient();
const router = createBrowserRouter([

  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/:projectAlias/pages/:pageAlias/edit-content',
    element: <PageDetail />,
  },
  {
    path: '/:projectAlias/view/:pageAlias/edit-content',
    element: <PageShare />,
  },
  {
    path:'view-content',
    element: <ViewForUser/>
  },
  {
    path: '*',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'projects',
        element: <ListProjectsPage />,
      },

      {
        path: 'create-new-project',
        element: <CreateProjectPage />,
      },
      {
        path: 'create-new-app',
        element: <NewAppPage />,
      },
      {
        path: 'project_detail/:projectId/:action',
        element: <DetailProjectsPage />,
      },
      {
        path: 'profile/:userId',
        element: <UserProfilePage />
      },
      {
        path: 'projects/view/:alias',
        element: <ViewProjectPage />
      },
      {
        path: 'create-page/:alias',
        element: <CreateNewPage />,
      },

      {
        path: 'edit/:alias/:url_alias',
        element: <EditPage />
      },

      {
        path: 'managerment/:users',
        element: <UserListPage />
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};