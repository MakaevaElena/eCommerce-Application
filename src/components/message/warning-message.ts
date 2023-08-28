import Message, { MessageType } from './message';

export default class WarningMessage extends Message {
  constructor() {
    super(MessageType.Warning);
  }
}
