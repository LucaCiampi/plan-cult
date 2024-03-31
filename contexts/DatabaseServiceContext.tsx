import SQLiteService from '@/services/SqliteService';
import StrapiService from '@/services/StrapiService';
import React, { createContext, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';

let databaseService: IDatabaseService;

if (Platform.OS !== 'web') {
  databaseService = new SQLiteService();
} else {
  databaseService = new StrapiService();
}

// const databaseService = new SQLiteService();

const DatabaseServiceContext = createContext<IDatabaseService>(databaseService);

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
