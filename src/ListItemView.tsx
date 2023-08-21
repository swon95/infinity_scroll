import React from 'react';
import {TypeListItem} from './TypeListItem';
import {Image, Text, View} from 'react-native';

export const ListItemView: React.FC<{item: TypeListItem}> = props => {
  return (
    <View>
      <Image style={{height: 200}} source={{uri: props.item.thumbnail}} />
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 12,
          flexDirection: 'column',
        }}>
        <Text style={{fontSize: 16}}>{props.item.title}</Text>
        <Text style={{fontSize: 12}}>
          {props.item.channelTitle} · 조회수 {props.item.viewCount} /{' · '}
          {props.item.publishedAt}
        </Text>
      </View>
    </View>
  );
};
