// @flow

import React from 'react';
import Avatar from 'material-ui/Avatar';
import { GridList, GridTile } from 'material-ui/GridList';

import * as Fetch from '../common/fetch';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 10,
  },
  gridList: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'auto',
    overflowY: 'auto',
    backgroundColor: '#FFFFFF',
  },
  gridTile: {
    backgroundColor: '#00BCD4',
  },
  gridTileTitle: {
    background: 'none',
  },
  avatar: {
    position: 'absolute',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, 0%)',
  },
};

type Props = {
  data: Fetch.Result,
};
export const View = ({ data }: Props) => (
  <div style={styles.root}>
    <GridList
      cellHeight={180}
      cols={4}
      style={styles.gridList}
    >
      {data.map((el, index) => (
        <GridTile
          key={el.id}
          title={`Office #${index + 1}`}
          subtitle={el.description}
          style={styles.gridTile}
          titleStyle={styles.gridTileTitle}
        >
          <div style={styles.avatar}>
            {el.photo != null ? <Avatar src={el.photo} /> : <Avatar>{el.description[0]}</Avatar>}
          </div>
        </GridTile>
      ))}
    </GridList>
  </div>
);
