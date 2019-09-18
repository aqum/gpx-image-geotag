import React, { Component } from 'react';
import './message-box.component.scss';

export interface MessageBoxProps {
  text: string;
}

export class MessageBox extends Component<MessageBoxProps> {
  render() {
    return <div className="message-box">{this.props.text}</div>;
  }
}
