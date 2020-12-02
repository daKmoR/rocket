import { LitElement } from 'lit-element';
import { OverlayMixin, withModalDialogConfig } from '@lion/overlays';

function transitionend(el) {
  return new Promise(resolve => {
    el.addEventListener('transitionend', resolve, { once: true });
  });
}

export class RocketDrawer extends OverlayMixin(LitElement) {
  static get properties() {
    return {
      useOverlay: { type: Boolean, reflect: true },
      useOverlayMediaQuery: { type: String },
    };
  }

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
    if (this.useOverlay) {
      super._setupOverlayCtrl();

      /* eslint-disable no-param-reassign */
      this._overlayCtrl.transitionHide = async ({ contentNode }) => {
        contentNode.style.transition = 'transform 0.20s cubic-bezier(0.4, 0.0, 0.2, 1)';
        contentNode.style.transform = 'translateX(-100%)';
        await transitionend(contentNode);
        // contentNode.style.display = 'none';
      };
      this._overlayCtrl.transitionShow = async ({ contentNode }) => {
        contentNode.style.display = 'block';
        contentNode.style.transform = 'translateX(-100%)';
        contentNode.style.transition = 'transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)';
        // wait for display block to be "updated in the dom" and then translate otherwise there will be no animation
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));
        contentNode.style.transform = 'translateX(0)';
        await transitionend(contentNode);
      };
      /* eslint-enable no-param-reassign */

      this._overlayCtrl.contentNode.style.transform = 'translateX(-100%)';
      this._overlayCtrl.contentNode.style.willChange = 'transform';

      // gesture
      this.containerEl = this._overlayCtrl.contentNode;
    }
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

    if (changedProps.has('useOverlay')) {
      if (this.useOverlay) {
        this._setupOverlayCtrl();
      } else {
        if (this._overlayCtrl) {
          this._teardownOverlayCtrl();
        }
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

  // ********************* GESTURE ***********************

  constructor() {
    super();
    this.useOverlay = false;
    this.useOverlayMediaQuery = '(max-width: 1024px)';

    this.onGestureStart = this.onGestureStart.bind(this);
    this.onGestureMove = this.onGestureMove.bind(this);
    this.onGestureEnd = this.onGestureEnd.bind(this);
    this.updateFromTouch = this.updateFromTouch.bind(this);

    this._startX = 0;
    this._currentX = 0;
    this.__touching = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.useOverlay = !!window.matchMedia(this.useOverlayMediaQuery).matches;
    window.matchMedia(this.useOverlayMediaQuery).addListener(query => {
      this.useOverlay = !!query.matches;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onGestureStart(ev) {
    this.__touching = true;
    this._left = this.containerEl.getBoundingClientRect().left;
    this._startX = ev.targetTouches[0].clientX;
    this._currentX = this._startX;
    this._timestamp = new Date().getTime();
    this._velocity = 0;

    this._overlayCtrl.contentNode.style.transition = '';

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

    this._overlayCtrl.contentNode.style.transition =
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
