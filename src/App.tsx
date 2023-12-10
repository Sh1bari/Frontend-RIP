import {HashRouter, Route, Routes } from 'react-router-dom'
import About from './components/About';
import EventDetails from './components/EventDetails';
import HomePage from './components/HomePage';
import { BreadcrumbsProvider } from './components/breadcrumbs/BreadcrumbsContext';
import Header from './components/global/Header';
import { Breadcrumbs } from './components/breadcrumbs/BreadcrumbsContext';

function App() {

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
      </HashRouter>
    </BreadcrumbsProvider>
  );
}

export default App
