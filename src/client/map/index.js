// @flow

import React from 'react';
import { Effects, assertNever } from 'redux-elmish';
import type { Effect, Dispatch } from 'redux-elmish';
import Loader from 'react-loader';
import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import * as GoogleMap from '../common/google-map';
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

const GoogleMapView = GoogleMap.View;
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
    case 'Active': {
      const center = { lat: 44.78, lng: 20.44 };
      return (
        <div>
          <GoogleMapView
            defaultCenter={center}
            defaultZoom={1}
            markers={model.data.map(el => ({
              id: el.id,
              position: { lat: parseFloat(el.latitude), lng: parseFloat(el.longitude) },
              info: { title: el.name, description: el.description },
              popUpInfo: false,
            }))}
          />
        </div>
      );
    }
    default: return assertNever(model.type);
  }
};
