import { EventEmitter } from 'events';

class AppEventEmitter extends EventEmitter {}

export const appEvents = new AppEventEmitter();

export const EVENTS = {
  CARD_CREATED: 'CARD_CREATED',
  CARD_MOVED: 'CARD_MOVED',
  COMMENT_ADDED: 'COMMENT_ADDED',
};

export type appEventsType = typeof appEvents;