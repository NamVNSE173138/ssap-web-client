import { RouterProvider } from 'react-router-dom';
import router from './router';
import { Provider } from 'react-redux';
import store from './store';
// import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <>
        <Provider store={store}>
            <RouterProvider router={router} />
            {/* <Toaster /> */}
        </Provider>
    </>
  );
}

export default App;
