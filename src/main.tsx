import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Admin from './Admin';
import './styles.css';

function Root() {
  const [path, setPath] = React.useState(window.location.pathname);
  React.useEffect(() => { const onPop = () => setPath(window.location.pathname); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  if (path === '/admin') return <Admin onBack={() => { window.history.pushState({}, '', '/'); setPath('/'); }} />;
  return <App />;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><Root /></React.StrictMode>);
