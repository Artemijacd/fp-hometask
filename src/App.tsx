import { FC } from 'react';
import { useState, useEffect } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

import { Image, User, Account } from '../types';
import { Table, Filters, Sort, Search, Row } from './components';
import { getImages, getUsers, getAccounts } from './mocks/api';
import rows from './mocks/rows.json';

import styles from './App.module.scss';

// mockedData has to be replaced with parsed Promises’ data
const mockedData: Row[] = rows.data;

export const App: FC = () => {
  const [data, setData] = useState<Row[]>(undefined);
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

        const rows: Row[] = [];

        const fs = images.map((image) => {
          return {
            avatar: image.url,
          }
        })

        const fs1 = users.map((user) => {
            return {
              username: user.username,
              country: user.country,
              name: user.name,
            }
        })
      
        const fs2 = accounts.map((account) => {
          return {
            lastPayments: account.payments.length, 
            posts: account.posts,
          }
        })

        fs.map((item, i) => {
            return rows.push({...item, ...fs1[i], ...fs2[i] });
        })
        return rows;
      };
      setData(dataConverter(users, accounts, images));
    });
  }, []);

  const filterData = (data: Row[]) => {
    if (data) {
      const modifiedData = data
      .filter(item => (search.length > 0 && item.country.toLowerCase().includes(search.toLowerCase())) || filters.some(f => f(item)));
      [].concat(data.sort((a, b) => (a.username > b.username ? -1*(sort) : 1*(sort) )));

      if (modifiedData.length > 0) {
        return modifiedData;
      }
    }
  }

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
        <Table rows={filterData(data) || mockedData} />
      </div>
    </StyledEngineProvider>
  );
};
