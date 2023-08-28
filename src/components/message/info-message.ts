import Message, { MessageType } from './message';

export default class InfoMessage extends Message {
  constructor() {
    super(MessageType.Info);
  }
}
