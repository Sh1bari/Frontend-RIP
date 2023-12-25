import {HashRouter, Route, Routes} from 'react-router-dom'
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
import Bag from './components/Bag';
import History from './components/History';
import Application from './components/Application';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // При монтировании компонента
    setupInterceptors(dispatch);
    resetToken(dispatch);
  }, []);
  
  return (
    <BreadcrumbsProvider initialBreadcrumbs={[{ name: '', path: '/' }]}>
        <HashRouter>
        <Header/>
        <Breadcrumbs/>
          <Routes>
            <Route path="/" element={<div style={{ width: '100vw' }}><HomePage /></div>} />
            <Route path="/about" element={<div style={{ width: '100vw' }}><About /></div>} />
            <Route path="/event/:id" element={<div style={{ width: '100vw' }}><EventDetails /></div>} />
            <Route path="/bag" element={<div style={{ width: '100vw' }}><Bag /></div>} />
            <Route path="/history" element={<div style={{ width: '100vw' }}><History /></div>} />
            <Route path="/application/:id" element={<div style={{ width: '100vw' }}><Application /></div>} />
          </Routes>
          <ToastContainer style={{ zIndex: 9999 }} />
        </HashRouter>
    </BreadcrumbsProvider>
  );
}

export default App
