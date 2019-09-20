import React, { Component } from 'react';
import { ReactComponent as Icon } from './assets/icon.svg';
import './message-box.component.scss';

export interface MessageBoxProps {
  text: string;
}

export class MessageBox extends Component<MessageBoxProps> {
  render() {
    return (
      <div className="message-box">
        <div className="message-box__icon">
          <Icon />
        </div>
        <div className="message-box__text">{this.props.text}</div>
      </div>
    );
  }
}
