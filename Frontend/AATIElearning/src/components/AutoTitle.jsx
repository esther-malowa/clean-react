import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';

const AutoTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    const raw = parts[parts.length - 1] || 'Landing';
    const pretty = raw
      .replace(/-/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
      .replace(/\b\w/g, (l) => l.toUpperCase());

    document.title = `AATI | ${pretty}`;
  }, [location.pathname]);

  return <Outlet />;
};

export default AutoTitle;
