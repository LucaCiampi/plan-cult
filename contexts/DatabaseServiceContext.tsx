import SQLiteService from '@/services/SqliteService';
import StrapiService from '@/services/StrapiService';
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Platform } from 'react-native';

let databaseService: IDatabaseService;

if (Platform.OS !== 'web') {
  databaseService = new SQLiteService();
} else {
  databaseService = new StrapiService();
}

const DatabaseServiceContext = createContext<IDatabaseService>(databaseService);
const SyncCompleteContext = createContext<boolean>(false);

export const useDatabaseService = () => useContext(DatabaseServiceContext);
export const useSyncComplete = () => useContext(SyncCompleteContext);

interface DatabaseServiceProviderProps {
  children: ReactNode;
}

export const DatabaseServiceProvider: React.FC<
  DatabaseServiceProviderProps
> = ({ children }) => {
  const [isSyncComplete, setIsSyncComplete] = useState<boolean>(false);

  useEffect(() => {
    if (databaseService instanceof SQLiteService) {
      databaseService.onSyncComplete(() => {
        setIsSyncComplete(true);
      });
    } else {
      setIsSyncComplete(true);
    }
  }, []);

  return (
    <DatabaseServiceContext.Provider value={databaseService}>
      <SyncCompleteContext.Provider value={isSyncComplete}>
        {children}
      </SyncCompleteContext.Provider>
    </DatabaseServiceContext.Provider>
  );
};
