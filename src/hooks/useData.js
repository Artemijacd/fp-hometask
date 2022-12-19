import { useMemo } from 'react';


export const useData = (data, sort, filters, search) => {
    const sortedData = useMemo(() => {
        if (sort) {
            return [...data].sort((a, b) => (a.username > b.username ? -1*(sort) : 1*(sort) ));
        }
        return data;
    }, [sort, data]);
      
    const searchedData = useMemo(() => {
        if (search.length) {
            return sortedData.filter(item => item.country.toLowerCase().includes(search.toLowerCase()));
        } 
        return [];
    }, [search, sortedData])
    
    const filteredData = useMemo(() => {
        if (filters.length) {
            return sortedData.filter(item => filters.some(f => f(item)));
        }
        return [];
    }, [filters, sortedData])

    const resultData = useMemo(() => {
        return [...new Set([...searchedData, ...filteredData])];
    }, [searchedData, filteredData])

    return resultData.length == 0 ? sortedData : resultData;
}