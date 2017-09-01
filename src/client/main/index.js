// @flow

import React from 'react';
import { Effects } from 'redux-elmish';
import type { Effect, Dispatch } from 'redux-elmish';
import { Tabs, Tab } from 'material-ui/Tabs';

import * as List from '../list';
import * as Grid from '../grid';
import * as Map from '../map';

// MODEL
type PageTab = '1' | '2' | '3';
/* eslint-disable quote-props */
const tabName = {
  '1': 'List',
  '2': 'Grid',
  '3': 'Map',
};
/* eslint-enable quote-props */

type Model = {
  selectedTab: PageTab,
  lista: List.Model,
  mreza: Grid.Model,
  mapa: Map.Model,
};

// UPDATE
type Action =
  | { type: 'ChangeTab', tab: PageTab }
  | { type: 'Lista', subAction: List.Action }
  | { type: 'Mreza', subAction: Grid.Action }
  | { type: 'Mapa', subAction: Map.Action }
;

const init = (): [Model, Effect<Action>] => {
  const [lista, listaFx] = List.init();
  const [mreza, mrezaFx] = Grid.init();
  const [mapa, mapaFx] = Map.init();
  return [
    { selectedTab: '1', lista, mreza, mapa },
    Effects.batch([
      Effects.map(listaFx, subAction => ({ type: 'Lista', subAction })),
      Effects.map(mrezaFx, subAction => ({ type: 'Mreza', subAction })),
      Effects.map(mapaFx, subAction => ({ type: 'Mapa', subAction })),
    ]),
  ];
};

const update = (model: Model, action: Action) => {
  switch (action.type) {
    case 'ChangeTab': return [
      { ...model, selectedTab: action.tab },
      Effects.none(),
    ];
    case 'Lista': {
      const [newListaModel, newListaFx] = List.update(model.lista, action.subAction);
      return [
        { ...model, lista: newListaModel },
        Effects.batch([newListaFx]),
      ];
    }
    case 'Mreza': {
      const [newMrezaModel, newMrezaFx] = Grid.update(model.mreza, action.subAction);
      return [
        { ...model, mreza: newMrezaModel },
        Effects.batch([newMrezaFx]),
      ];
    }
    case 'Mapa': {
      const [newMapaModel, newMapaFx] = Map.update(model.mapa, action.subAction);
      return [
        { ...model, mapa: newMapaModel },
        Effects.batch([newMapaFx]),
      ];
    }
    default: return [model, Effects.none()];
  }
};

type Props = {
  model: Model,
  dispatch: Dispatch<Action>,
};

const ListView = List.View;
const GridView = Grid.View;
const MapView = Map.View;
const View = ({ model, dispatch }: Props) => (
  <div>
    <Tabs
      id="tabContainer"
      onSelect={tab => dispatch({ type: 'ChangeTab', tab })}
    >
      <Tab label={tabName[1]}>
        <ListView
          model={model.lista}
          dispatch={subAction => dispatch({ type: 'Lista', subAction })}
        />
      </Tab>
      <Tab label={tabName[2]}>
        <GridView
          model={model.mreza}
          dispatch={subAction => dispatch({ type: 'Mreza', subAction })}
        />
      </Tab>
      <Tab label={tabName[3]}>
        <MapView
          model={model.mapa}
          dispatch={subAction => dispatch({ type: 'Mapa', subAction })}
        />
      </Tab>
    </Tabs>
  </div>
);

export default { init, update, View };
