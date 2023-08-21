import React, {useState} from 'react';
import {TypeListItem} from './TypeListItem';
import {FlatList} from 'react-native';
import {ListItemView} from './ListItemView';

export const ListView: React.FC = () => {
  const [list] = useState<TypeListItem[]>([
    {
      title: 'TITLE_01',
      thumbnail:
        'https://docs.expo.dev/static/images/tutorial/background-image.png',
      publishedAt: '2023-08-22',
      viewCount: 100,
      channelTitle: 'CHANNEL TITLE 01',
    },
    {
      title: 'TITLE_02',
      thumbnail:
        'https://docs.expo.dev/static/images/tutorial/background-image.png',
      publishedAt: '2023-08-22',
      viewCount: 200,
      channelTitle: 'CHANNEL TITLE 02',
    },
    {
      title: 'TITLE_03',
      thumbnail:
        'https://docs.expo.dev/static/images/tutorial/background-image.png',
      publishedAt: '2023-08-22',
      viewCount: 300,
      channelTitle: 'CHANNEL TITLE 03',
    },
  ]);

  return (
    <FlatList
      data={list}
      renderItem={({item}) => <ListItemView item={item} />}
    />
  );
};
