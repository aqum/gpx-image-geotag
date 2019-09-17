import React, { Component, ChangeEvent } from 'react';
import './offset-control.component.scss';

export interface OffsetControlProps {
  onChange(offsetSecs: number): void;
}

interface OffsetControlState {
  offset: number;
}

export class OffsetControl extends Component<
  OffsetControlProps,
  OffsetControlState
> {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0
    };

    this.handleOffsetChange = this.handleOffsetChange.bind(this);
    this.handleOffsetDiff = this.handleOffsetDiff.bind(this);
  }

  handleOffsetChange(event: ChangeEvent<HTMLInputElement>) {
    this.props.onChange(parseInt(event.target.value));
  }

  handleOffsetDiff(offsetDiff: number): () => void {
    return () => {
      this.setState({
        offset: this.state.offset + offsetDiff
      });
    };
  }

  render() {
    return (
      <div className="offset-control">
        <div className="offset-control__label">offset in seconds</div>
        <div className="offset-control__inputs">
          <button
            className="offset-control__button"
            onClick={this.handleOffsetDiff(-60)}
          >
            -60
          </button>
          <button
            className="offset-control__button"
            onClick={this.handleOffsetDiff(-1)}
          >
            -1
          </button>
          <input
            className="offset-control__input"
            type="number"
            value={this.state.offset}
            onChange={this.handleOffsetChange}
          />
          <button
            className="offset-control__button"
            onClick={this.handleOffsetDiff(1)}
          >
            +1
          </button>
          <button
            className="offset-control__button"
            onClick={this.handleOffsetDiff(60)}
          >
            +60
          </button>
        </div>
      </div>
    );
  }
}
