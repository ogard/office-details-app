/* eslint-disable flowtype/require-valid-file-annotation */

import fromJSON from 'tcomb/lib/fromJSON';

const checkStatus = response => {
  const { status } = response;

  if (status === 400) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json()
        .then(errorBody => {
          let error;
          if (errorBody.IsValid === false) {
            error = new Error('Грешка у подацима');
          } else {
            error = new Error('Сервер је неочекивано одбио захтев. Обратите се администратору.');
          }
          throw error;
        });
    }

    throw new Error('Сервер је неочекивано одбио захтев. Обратите се администратору.');
  }

  if (status === 404) {
    throw new Error('Сервер нема тражени ресурс. Обратите се администратору.');
  }

  if (!response.ok) {
    const error = new Error(`Дошло је до неочекиване грешке на серверу.
      Покушајте поново касније или се обратите администратору.`);
    error.response = response;
    throw error;
  }

  return response;
};

export const checkedJson = response => Promise.resolve(checkStatus(response)).then(r => r.json());
export const checkedFromJSON = type => response => Promise.resolve(checkedJson(response).then(json => fromJSON(json, type)));
