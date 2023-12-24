import {HashRouter, Route, Routes } from 'react-router-dom'
import About from './components/About';
import EventDetails from './components/EventDetails';
import HomePage from './components/HomePage';
import { BreadcrumbsProvider } from './components/breadcrumbs/BreadcrumbsContext';
import Header from './components/global/Header';
import { Breadcrumbs } from './components/breadcrumbs/BreadcrumbsContext';
import { ToastContainer } from 'react-toastify';
import { setupInterceptors, resetToken } from '../src/API/api';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // При монтировании компонента
    setupInterceptors(dispatch);
    resetToken(dispatch);
  }, [dispatch]);
  
  return (
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
  );
}

export default App
