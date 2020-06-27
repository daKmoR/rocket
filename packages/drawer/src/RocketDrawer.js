import { html, LitElement } from 'lit-element';
import { OverlayMixin, withModalDialogConfig } from '@lion/overlays';

function transitionend(el) {
  return new Promise(resolve => {
    el.addEventListener('transitionend', resolve, { once: true });
  });
}

export class RocketDrawer extends OverlayMixin(LitElement) {
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      ...withModalDialogConfig(),
      hidesOnOutsideClick: true,
      viewportConfig: {
        placement: 'slide',
      },
    };
  }

  _setupOverlayCtrl() {
    super._setupOverlayCtrl();

    /* eslint-disable no-param-reassign */
    this._overlayCtrl.transitionHide = async ({ _contentWrapperNode }) => {
      _contentWrapperNode.style.transition = 'transform 0.20s cubic-bezier(0.4, 0.0, 0.2, 1)';
      _contentWrapperNode.style.transform = 'translateX(-100%)';
      await transitionend(_contentWrapperNode);
      _contentWrapperNode.style.display = 'none';
    };
    this._overlayCtrl.transitionShow = async ({ _contentWrapperNode }) => {
      _contentWrapperNode.style.display = 'block';
      _contentWrapperNode.style.transform = 'translateX(-100%)';
      _contentWrapperNode.style.transition = 'transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)';
      // wait for block to be "active" and then translate otherwise there will be no animation
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));
      _contentWrapperNode.style.transform = 'translateX(0)';
      await transitionend(_contentWrapperNode);
    };
    /* eslint-enable no-param-reassign */

    this._overlayCtrl._contentWrapperNode.style.transform = 'translateX(-100%)';
    this._overlayCtrl._contentWrapperNode.style.willChange = 'transform';

    // gesture
    this.containerEl = this._overlayCtrl._contentWrapperNode;
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('opened')) {
      if (this.opened) {
        document.body.addEventListener('touchstart', this.onGestureStart, { passive: true });
      } else {
        document.body.removeEventListener('touchstart', this.onGestureStart);
      }
    }
  }

  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this.__toggle = () => {
      this.opened = !this.opened;
    };

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.addEventListener('click', this.__toggle);
    }
  }

  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();
    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.removeEventListener('click', this.__toggle);
    }
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="_overlay-shadow-outlet"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
    `;
  }

  // ********************* GESTURE ***********************

  constructor() {
    super();

    this.onGestureStart = this.onGestureStart.bind(this);
    this.onGestureMove = this.onGestureMove.bind(this);
    this.onGestureEnd = this.onGestureEnd.bind(this);
    this.updateFromTouch = this.updateFromTouch.bind(this);

    this._startX = 0;
    this._currentX = 0;
    this.__touching = false;
  }

  // eslint-disable-next-line class-methods-use-this
  onGestureStart(ev) {
    this.__touching = true;
    this._left = this.containerEl.getBoundingClientRect().left;
    this._startX = ev.targetTouches[0].clientX;
    this._currentX = this._startX;
    this._timestamp = new Date().getTime();
    this._velocity = 0;

    this._overlayCtrl._contentWrapperNode.style.transition = '';

    document.body.addEventListener('touchmove', this.onGestureMove, { passive: true });
    document.body.addEventListener('touchend', this.onGestureEnd, { passive: true });
    document.body.addEventListener('touchcancel', this.onGestureEnd, { passive: true });
    requestAnimationFrame(this.updateFromTouch);
  }

  addVelocitySample(dDist, dTime) {
    if (dTime === 0) return;

    const velocitySample = dDist / dTime;

    // Low pass filter.
    const alpha = 0.75;
    this._velocity *= alpha;
    this._velocity += (1 - alpha) * velocitySample;
  }

  onGestureMove(ev) {
    if (!this.__touching) {
      return;
    }
    // console.log('move', ev);
    const lastTimestamp = this._timestamp;
    this._timestamp = new Date().getTime();
    const dTime = this._timestamp - lastTimestamp;
    const lastX = this._currentX;
    this._currentX = ev.targetTouches[0].clientX;
    const dX = this._currentX - lastX;
    this.addVelocitySample(dX, dTime);
  }

  onGestureEnd() {
    if (!this.__touching) {
      this.opened = false;
      return;
    }

    this.__touching = false;
    let endOpenedState;

    // Check for fling.
    if (Math.abs(this._velocity) > 1) {
      endOpenedState = this._velocity > 0;
    } else {
      // Check depending on percentage visible.
      const { left } = this.containerEl.getBoundingClientRect();
      const width = this.containerEl.clientWidth;
      const percentageVisible = (left + width) / width;
      endOpenedState = percentageVisible >= 0.5;
    }

    this._overlayCtrl._contentWrapperNode.style.transition =
      'transform 0.20s cubic-bezier(0.4, 0.0, 0.2, 1)';

    this.containerEl.style.transform = '';
    this.opened = endOpenedState;

    document.body.removeEventListener('touchmove', this.onGestureMove);
    document.body.removeEventListener('touchend', this.onGestureEnd);
    document.body.removeEventListener('touchcancel', this.onGestureEnd);
  }

  updateFromTouch() {
    if (!this.__touching) return;
    requestAnimationFrame(this.updateFromTouch);

    const translateX = Math.min(0, this._currentX - this._startX + this._left);
    this.containerEl.style.transform = `translateX(${translateX}px)`;
  }
}
