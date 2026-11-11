import { Component, type ReactNode } from 'react';

/** Renders nothing and reports once if a lazy scene fails to load or its WebGL context cannot
 * start, so the caller can fall back to its static state. */
export class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
