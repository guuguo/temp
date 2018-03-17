import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import shrineData from './network';

export default combineReducers({
  shrineData,
  // user,
  // runtime,
});
