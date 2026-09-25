import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppLayout } from './components/layout/AppLayout'
import { ToastProvider } from './components/ui/toast/ToastProvider'
import { IconDetailsPage } from './pages/IconDetailsPage'
import { LibraryPage } from './pages/LibraryPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { UploadPage } from './pages/UploadPage'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <LibraryPage /> },
      { path: 'icons/:id', element: <IconDetailsPage /> },
      { path: 'upload', element: <UploadPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  )
}
