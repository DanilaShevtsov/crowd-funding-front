import {
  AUTH_SUCCESS,
  REMOVE_TOKEN,
  LOAD_AUTH,
} from '../types';

const STATE = {
  token: null,
  address: null,
  userId: null,
};

const auth = (state = STATE, { type, payload }: { type: string, payload: any }) => {
  switch (type) {
    case AUTH_SUCCESS: {
      const {
        token,
        address,
        userId,
      } = payload;

      localStorage.setItem('token', token);
      localStorage.setItem('address', address);
      localStorage.setItem('userId', userId);

      state.token = token;
      state.address = address;
      state.userId = userId;

      return {
        ...state,
        token: token,
        address: address,
        userId: userId,
      };
    }

    case REMOVE_TOKEN: {
      localStorage.removeItem('token');
      localStorage.removeItem('address');
      localStorage.removeItem('userId');

      return {
        ...STATE,
      };
    }

    case LOAD_AUTH: {
      const token = localStorage.getItem('token');
      const address = localStorage.getItem('address');
      const userId = localStorage.getItem('userId');
      return {
        ...state,
        token: token,
        address: address,
        userId: userId,
      }
    }

    default:
      return state;
  }
};

export default auth;
