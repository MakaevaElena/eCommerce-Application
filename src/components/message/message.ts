import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export enum MessageType {
  Info,
  Warning,
  Error,
}

enum MessageBackground {
  Info = 'linear-gradient(to right, rgb(0,176,155), rgb(150,201,61))',
  Warning = 'linear-gradient(90deg, #eeee00, #dddd00)',
  Error = 'linear-gradient(to right, rgb(255,95,109), rgb(255,195,113))',
}

export default class Message {
  private messageType: MessageType;

  constructor(messageType: MessageType = MessageType.Error) {
    this.messageType = messageType;
  }

  public showMessage(text: string) {
    const params = {
      text,
      style: {
        background: this.getBackgroundColor(),
      },
    };

    Toastify(params).showToast();
  }

  private getBackgroundColor(): MessageBackground {
    let color: MessageBackground;
    switch (this.messageType) {
      case MessageType.Info:
        color = MessageBackground.Info;
        break;
      case MessageType.Error:
        color = MessageBackground.Error;
        break;
      default:
        color = MessageBackground.Warning;
        break;
    }
    return color;
  }
}
