import React, { Component, ChangeEvent } from 'react';
import './offset-control.component.scss';

export interface OffsetControlProps {
  onChange(offsetSecs: number): void;
}

export class OffsetControl extends Component<OffsetControlProps> {
  constructor(props) {
    super(props);

    this.handleOffsetChange = this.handleOffsetChange.bind(this);
  }

  handleOffsetChange(event: ChangeEvent<HTMLInputElement>) {
    this.props.onChange(parseInt(event.target.value));
  }

  render() {
    return (
      <input
        className="offset-control__input"
        type="range"
        min="-1000"
        max="1000"
        step="5"
        defaultValue="0"
        onChange={this.handleOffsetChange}
      />
    );
  }
}
