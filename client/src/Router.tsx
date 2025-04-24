import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import TracksPage from './pages/TracksPage';
import HomePage from './pages/HomePage';
import { ROOT, TRACKS } from './constants/route.constant';

export const router = createBrowserRouter(
  [
    {
      path: ROOT,
      element: <App />,
      children: [
        { index: true, element: <HomePage /> },
        { path: `${ROOT}${TRACKS}`, element: <TracksPage /> },
        {
          path: '*',
          element: (
            <Navigate
              to='/'
              replace
            />
          ),
        },
      ],
    },
  ],
  {
    basename: '/tracker',
  }
);
