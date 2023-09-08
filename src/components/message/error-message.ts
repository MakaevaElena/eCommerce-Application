import Message, { MessageType } from './message';

export default class ErrorMessage extends Message {
  constructor() {
    super(MessageType.Error);
  }
}
