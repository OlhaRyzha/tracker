import { ACTIONS } from '../constants/actions.constants';

export type ActionType = Exclude<(typeof ACTIONS)[keyof typeof ACTIONS], 'get'>;
