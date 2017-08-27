// @flow

import React from 'react';
import { Effects } from 'redux-elmish';
import type { Effect, Dispatch } from 'redux-elmish';
import { Tabs, Tab } from 'material-ui/Tabs';
import Loader from 'react-loader';

import * as List from '../list';
import * as Grid from '../grid';
import * as Map from '../map';
import * as Fetch from '../common/fetch';

type PageTab = '1' | '2' | '3';
/* eslint-disable quote-props */
const tabName = {
  '1': 'List',
  '2': 'Grid',
  '3': 'Map',
};
/* eslint-enable quote-props */

type Model = {
  data: ?Fetch.Result,
  loading: boolean,
  selectedTab: PageTab,
};

type Action =
  | { type: 'ReceiveData', data: Fetch.Result }
  | { type: 'FailData', error: any }
  | { type: 'ChangeTab', tab: PageTab }
;

const init = (): [Model, Effect<Action>] => ([
  { data: null, loading: true, selectedTab: '1' },
  Effects.promise(
    () => Fetch.getData(),
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

type Props = {
  model: Model,
  dispatch: Dispatch<Action>,
};

// const testData = [{
//   id: 2,
//   name: 'Paris Office',
//   description: 'Itekako Paris office address is Main street',
//   latitude: '48.856614',
//   longitude: '2.3522219',
//   photo: null,
// }];

const ListView = List.View;
const GridView = Grid.View;
const MapView = Map.View;
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
        {model.data != null && <ListView data={model.data} />}
      </Tab>
      <Tab label={tabName[2]}>
        {model.data != null && <GridView data={model.data} />}
      </Tab>
      <Tab label={tabName[3]}>
        {model.data != null && <MapView data={model.data} />}
      </Tab>
    </Tabs>
  </div>
);

export default { init, update, View };
