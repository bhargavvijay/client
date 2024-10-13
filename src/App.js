import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';
import Pin from './components/Pin';
import Orders from './components/Orders';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
          <Pin></Pin>
      ),
    },
    {
      path: '/orders',
      element:(
        <Orders></Orders>
      )
    }
  ]
);

function App() {
  return (
<>
<RouterProvider router={router} />
</>
  )
}

export default App;
