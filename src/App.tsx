import { FC } from 'react';
import { useState, useEffect } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import { useData } from './hooks/useData.js'
import { Image, User, Account } from '../types';
import { Table, Filters, Sort, Search, Row } from './components';
import { getImages, getUsers, getAccounts } from './mocks/api';
import rows from './mocks/rows.json';

import styles from './App.module.scss';

// mockedData has to be replaced with parsed Promises’ data
const mockedData: Row[] = rows.data;

export const App: FC = () => {
  const [data, setData] = useState<Row[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilter] = useState([]);
  const [sort, setSort] = useState(0);

  useEffect(() => {
    // fetching data from API
    Promise.all([
      getImages(),
      getUsers(),
      getAccounts(),
    ]).then(([images, users, accounts]: [Image[], User[], Account[]]) => {
      const dataConverter = (users: User[], accounts: Account[], images: Image[]): Row[] => {

        const avatars = images.map((image) => {
          return {
            Id: image.userID,
            avatar: image.url,
          }
        })

        const usersInfo = users.map((user) => {
            return {
              Id: user.userID,
              username: user.username,
              country: user.country,
              name: user.name,
            }
        })
      
        const accountsInfo = accounts.map((account) => {
          const initialValue = 0;
          return {
            Id: account.userID,
            lastPayments: account.payments.reduce((acc, val) => acc + val.totalSum, initialValue), 
            posts: account.posts,
          }
        })
        
        return usersInfo.map(ui => ({...ui, ...accountsInfo.find(ai => ai.Id === ui.Id), ...avatars.find(avs => avs.Id === ui.Id)}));
      };
      setData(dataConverter(users, accounts, images));
    });
  }, []);

  const modifiedData = useData(data, sort, filters, search);

  return (
    <StyledEngineProvider injectFirst>
      <div className="App">
        <div className={styles.container}>
          <div className={styles.sortFilterContainer}>
            <Filters updateStore={(filters) => setFilter(filters)}/>
            <Sort updateStore={(sort) => setSort(sort)}/>
          </div>
          <Search updateStore={(search) => setSearch(search)}/>
        </div>
        <Table rows={ modifiedData } />
      </div>
    </StyledEngineProvider>
  );
};
