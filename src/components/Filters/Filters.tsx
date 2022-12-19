import { useState, FC } from 'react';
import Checkbox from '@mui/material/Checkbox';

import styles from './Filters.module.scss';

interface FiltersProps {
  store?: {};
  updateStore?: (val) => void;
}

// OR

//interface FiltersProps {
//  selected?: {};
//  updateSelected?: (val) => void;
//}

// OR store can be global

const OPTIONS = [
  {
    title: 'Without posts',
  },
  {
    title: 'More than 100 posts',
  },
];

export const Filters: FC<FiltersProps> = props => {
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);

  const onChange = ({ title }) => {

    let updatedFilters;
    const { updateStore } = props;

    if (selectedFilter.find(filter => filter === title)) {
      updatedFilters = selectedFilter.filter(filter => filter !== title);
    } else {
      updatedFilters = [...selectedFilter, title];
    }

    const filters = {
      'Without posts': item => item.posts == 0,
      'More than 100 posts': item => item.posts >= 100,
    }
    const selected = updatedFilters.map(filter => {return filters[filter]});
    setSelectedFilter(updatedFilters);
    updateStore(selected);
    
  };

  return (
    <div className={styles.group}>
      <div className={styles.title}>Filter by posts</div>
      <ul className={styles.list}>
        {OPTIONS.map(option => (
          <li
            value={option.title}
            key={option.title}
            onClick={() => onChange(option)}
          >
            <Checkbox
              checked={!!selectedFilter.find(filter => filter === option.title)}
              value={option.title}
              size="small"
              color="primary"
              onChange={() => onChange(option)}
            />{' '}
            {option.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
