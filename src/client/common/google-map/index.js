// @flow

import React from 'react';
import { withGoogleMap, GoogleMap, Marker as MarkerRgm, InfoWindow } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import Loader from 'react-loader';

type Position = {
  lat: number,
  lng: number,
};

type Info = {
  title: string,
  description: string,
};

export type Marker = {
  id: number,
  position: Position,
  info: Info,
  popUpInfo: boolean,
};

type Props = {
  defaultCenter: Position,
  defaultZoom: number,
  markers: Array<Marker>,
};

type State = {
  markers: Array<Marker>,
};

const Map = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={props.zoom}
      defaultCenter={props.center}
    >
      {props.markers.map(el => (
        <MarkerRgm
          key={el.id}
          position={el.position}
          defaultAnimation={2}
          onClick={() => props.onMarkerClick(el.id)}
        >
          {el.popUpInfo &&
            <InfoWindow
              onCloseClick={() => props.onMarkerInfoClose(el.id)}
            >
              <div>
                <h4>{el.info.title}</h4>
                <p>{el.info.description}</p>
              </div>
            </InfoWindow>
          }
        </MarkerRgm>
      ))}
    </GoogleMap>
    ),
  ),
);

// Class<React$Component<Props, State>

export class View extends React.Component<Props, State> {
  handleMarkerClick: (clickedMarkerID: number) => void;
  handleMarkerInfoClose: (closedMarkerID: number) => void;

  constructor(props: Props) {
    super(props);
    this.state = { markers: this.props.markers };
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerInfoClose = this.handleMarkerInfoClose.bind(this);
  }

  handleMarkerClick(clickedMarkerID: number) {
    this.setState({
      markers: this.state.markers.map(el => (el.id === clickedMarkerID ? { ...el, popUpInfo: true } : el)),
    });
  }

  handleMarkerInfoClose(closedMarkerID: number) {
    this.setState({
      markers: this.state.markers.map(el => (el.id === closedMarkerID ? { ...el, popUpInfo: false } : el)),
    });
  }

  render() {
    return (
      <Map
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.28&libraries=places,geometry&key=AIzaSyDXLuhce5ma7ZUe3JSLe2Gg059v_J7C4Io"
        loadingElement={
          <div className="loaderWithMask">
            <Loader loaded={false} />
          </div>
        }
        containerElement={
          <div style={{ zIndex: 1000000, height: '500px', width: '100%' }} />
        }
        mapElement={
          <div style={{ zIndex: 1000000, height: '500px', width: '100%' }} />
        }
        center={this.props.defaultCenter}
        zoom={this.props.defaultZoom}
        markers={this.state.markers}
        onMarkerClick={this.handleMarkerClick}
        onMarkerInfoClose={this.handleMarkerInfoClose}
      />
    );
  }
}
