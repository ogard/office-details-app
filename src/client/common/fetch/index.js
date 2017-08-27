// @flow

import type { $Reify } from 'tcomb';
import * as CommonApi from '../api';

export type Preview = {
  id: number,
  name: string,
  description: string,
  latitude: string,
  longitude: string,
  photo: ?string,
};

export type Result = Array<Preview>;
const tResult = (({}: any): $Reify<Result>);

export const getData = (): Promise<Result> =>
  fetch('https://itk-exam-api.herokuapp.com/api/offices')
    .then(CommonApi.checkedFromJSON(tResult))
  ;

