import {HashRouter, Route, Routes } from 'react-router-dom'
import About from './components/About';
import EventDetails from './components/EventDetails';
import HomePage from './components/HomePage';
import { BreadcrumbsProvider } from './components/breadcrumbs/BreadcrumbsContext';
import Header from './components/global/Header';
import { Breadcrumbs } from './components/breadcrumbs/BreadcrumbsContext';
import { Provider } from 'react-redux';
import store from './redux/store'; // Ваш Redux store
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <Provider store={store}>
      <BreadcrumbsProvider initialBreadcrumbs={[{ name: '', path: '/' }]}>
        <HashRouter>
        <Header/>
        <Breadcrumbs/>
          <Routes>
            <Route path="/" element={<div style={{ width: '100vw' }}><HomePage /></div>} />
            <Route path="/about" element={<div style={{ width: '100vw' }}><About /></div>} />
            <Route path="/event/:id" element={<div style={{ width: '100vw' }}><EventDetails /></div>} />
          </Routes>
          <ToastContainer style={{ zIndex: 9999 }} />
        </HashRouter>
      </BreadcrumbsProvider>
    </Provider>
  );
}

export default App
