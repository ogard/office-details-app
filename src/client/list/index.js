// @flow

import React from 'react';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';

import * as Fetch from '../common/fetch';

type Props = {
  data: Fetch.Result,
};

export const View = ({ data }: Props) => (
  <List>
    {data.map(el => (
      <ListItem
        key={el.id}
        primaryText={el.name}
        secondaryText={el.description}
        leftAvatar={el.photo != null ? <Avatar src={el.photo} /> : <Avatar>{el.description[0]}</Avatar>}
      />
    ))}
  </List>
);
