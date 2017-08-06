// @flow

import React from 'react';
import { Effects } from 'redux-elmish';
import type { Effect, Dispatch } from 'redux-elmish';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import { Tabs, Tab } from 'material-ui/Tabs';
import Loader from 'react-loader';
import * as Api from './api';

type PageTab = '1' | '2' | '3';
/* eslint-disable quote-props */
const tabName = {
  '1': 'List',
  '2': 'Grid',
  '3': 'Map',
};
/* eslint-enable quote-props */

type Model = {
  data: ?Api.Result,
  loading: boolean,
  selectedTab: PageTab,
};

type Action =
  | { type: 'ReceiveData', data: Api.Result }
  | { type: 'FailData', error: any }
  | { type: 'ChangeTab', tab: PageTab }
;

const init = (): [Model, Effect<Action>] => ([
  { data: null, loading: true, selectedTab: '1' },
  Effects.promise(
    () => Api.getData(),
    result => ({ type: 'ReceiveData', data: result }),
    error => ({ type: 'FailData', error }),
  ),
]);

const update = (model: Model, action: Action) => {
  switch (action.type) {
    case 'ReceiveData': return [
      { ...model, data: action.data, loading: false },
      Effects.none(),
    ];
    // TODO: notifikacija za gresku na serveru
    case 'FailData': return console.error(action.error) || [
      { ...model, data: null, loading: false },
      Effects.none(),
    ];
    case 'ChangeTab': return [
      { ...model, selectedTab: action.tab },
      Effects.none(),
    ];
    default: return [model, Effects.none()];
  }
};

const renderListData = (data: Api.Result): React$Element<any> => (
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

type Props = {
  model: Model,
  dispatch: Dispatch<Action>,
};
const View = ({ model, dispatch }: Props) => (
  <div>
    {model.loading &&
      <div className="loaderWithMask">
        <Loader loaded={!model.loading} />
      </div>
    }
    <Tabs
      id="tabContainer"
      onSelect={tab => dispatch({ type: 'ChangeTab', tab })}
    >
      <Tab label={tabName[1]}>
        {model.data != null && renderListData(model.data)}
      </Tab>
      <Tab label={tabName[2]} />
      <Tab label={tabName[3]} disabled={true} />
    </Tabs>
  </div>
);

export default { init, update, View };
