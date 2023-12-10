// BreadcrumbsContext.tsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

interface Breadcrumb {
  name: string;
  path: string;
}

const BreadcrumbsContext = React.createContext<Breadcrumb[]>([]);
const BreadcrumbsUpdaterContext = React.createContext<React.Dispatch<React.SetStateAction<Breadcrumb[]>> | undefined>(undefined);

interface BreadcrumbsProviderProps {
  initialBreadcrumbs: Breadcrumb[];
  children: React.ReactNode;
}

export const BreadcrumbsProvider: React.FC<BreadcrumbsProviderProps> = ({ initialBreadcrumbs, children }) => {
  const [internalBreadcrumbs, setInternalBreadcrumbs] = useState(initialBreadcrumbs);

  const updateBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>> = (newBreadcrumbs) => {
    setInternalBreadcrumbs((prevState) => {
      const nextState = typeof newBreadcrumbs === 'function' ? newBreadcrumbs(prevState) : newBreadcrumbs;
      return nextState;
    });
  };

  return (
    <BreadcrumbsContext.Provider value={internalBreadcrumbs}>
      <BreadcrumbsUpdaterContext.Provider value={updateBreadcrumbs}>
        {children}
      </BreadcrumbsUpdaterContext.Provider>
    </BreadcrumbsContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  return useContext(BreadcrumbsContext);
};

export const useBreadcrumbsUpdater = () => {
  const updater = useContext(BreadcrumbsUpdaterContext);
  if (!updater) {
    throw new Error('useBreadcrumbsUpdater must be used within a BreadcrumbsProvider');
  }
  return updater;
};

export const Breadcrumbs: React.FC = () => {
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div style={ {marginLeft: '20px', marginTop: '20px' }}>
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={index}>
          <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
          {index < breadcrumbs.length - 1 && ' / '}
        </span>
      ))}
    </div>
  );
};
