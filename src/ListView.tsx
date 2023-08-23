import React, {useEffect} from 'react';
import {TypeListItem} from './TypeListItem';
import {FlatList} from 'react-native';
import {ListItemView} from './ListItemView';
import {useData} from './useData';

export const ListView: React.FC = () => {
  const {data, loadData, loadMoreData} = useData();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <FlatList
      data={data}
      renderItem={({item}) => <ListItemView item={item} />}
      onEndReached={loadMoreData}
      // 마지막에 가까운 지점
      onEndReachedThreshold={0.1}
    />
  );
};
