// @flow

import React from 'react';
import * as GoogleMap from '../common/google-map';
import * as Fetch from '../common/fetch';

type Props = {
  data: Fetch.Result,
};

const GoogleMapView = GoogleMap.View;
export const View = ({ data }: Props) => {
  const center = { lat: 44.78, lng: 20.44 };
  return (
    <div>
      <GoogleMapView
        defaultCenter={center}
        defaultZoom={1}
        markers={data.map(el => ({
          id: el.id,
          position: { lat: parseFloat(el.latitude), lng: parseFloat(el.longitude) },
          info: { title: el.name, description: el.description },
          popUpInfo: false,
        }))}
      />
    </div>
  );
};
