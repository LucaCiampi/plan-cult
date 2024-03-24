import DatabaseService from '@/services/databaseService';
import React, { createContext, useContext, ReactNode } from 'react';

const databaseService = new DatabaseService();

const DatabaseServiceContext = createContext<DatabaseService>(databaseService);

export const useDatabaseService = () => useContext(DatabaseServiceContext);

interface DatabaseServiceProviderProps {
  children: ReactNode;
}

export const DatabaseServiceProvider: React.FC<
  DatabaseServiceProviderProps
> = ({ children }) => {
  return (
    <DatabaseServiceContext.Provider value={databaseService}>
      {children}
    </DatabaseServiceContext.Provider>
  );
};
