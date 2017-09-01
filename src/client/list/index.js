// @flow

import React from 'react';
import Avatar from 'material-ui/Avatar';
import { Effects, assertNever } from 'redux-elmish';
import type { Effect, Dispatch } from 'redux-elmish';
import { List, ListItem } from 'material-ui/List';
import Loader from 'react-loader';
import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import * as Fetch from '../common/fetch';

// MODEL
type ActiveModel = {
  type: 'Active',
  data: Fetch.Result,
};
type InitializingModel = {
  type: 'Initializing',
  error: ?string,
};
export type Model = ActiveModel | InitializingModel;

// UPDATE
export type Action =
  | { type: 'ReceiveData', data: Fetch.Result }
  | { type: 'FailData', error: any }
  | { type: 'RetryInitializing' }
;

export const init = (): [Model, Effect<Action>] => [
  { type: 'Initializing', error: null },
  Effects.promise(
    () => Fetch.getData(),
    result => ({ type: 'ReceiveData', data: result }),
    error => ({ type: 'FailData', error }),
  ),
];

export const update = (model: Model, action: Action): [Model, Effect<Action>] => {
  switch (action.type) {
    case 'ReceiveData': return [
      { type: 'Active', data: action.data },
      Effects.none(),
    ];
    case 'FailData': return [
      { type: 'Initializing', error: action.error },
      Effects.none(),
    ];
    case 'RetryInitializing': return [
      { type: 'Initializing', error: null },
      Effects.promise(
        () => Fetch.getData(),
        result => ({ type: 'ReceiveData', data: result }),
        error => ({ type: 'FailData', error }),
      ),
    ];
    default: return assertNever(action.type);
  }
};

// VIEW
type Props = {
  model: Model,
  dispatch: Dispatch<Action>,
};

export const View = ({ model, dispatch }: Props) => {
  switch (model.type) {
    case 'Initializing': {
      const { error } = model;
      return (
        <div style={{ minHeight: '20em' }}>
          {error != null ? (
            <div>
              <p>Desila se greška na učitavanju</p>
              <p>{`${error}`}</p>
              <IconButton
                title="Učitati ponovo"
                onClick={() => dispatch({ type: 'RetryInitializing' })}
              >
                <RefreshIcon color="#ff0000" />
              </IconButton>
            </div>
          ) : (
            <div className="loaderWithMask">
              <Loader loaded={false} />
            </div>
          )}
        </div>
      );
    }
    case 'Active': return (
      <div>
        <List>
          {model.data.map(el => (
            <ListItem
              key={el.id}
              primaryText={el.name}
              secondaryText={el.description}
              leftAvatar={el.photo != null ? <Avatar src={el.photo} /> : <Avatar>{el.description[0]}</Avatar>}
            />
          ))}
        </List>
      </div>
    );
    default: return assertNever(model.type);
  }
};
