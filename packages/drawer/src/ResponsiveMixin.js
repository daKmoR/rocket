import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const ResponsiveMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line
    class ResponsiveMixin extends superclass {
      static get properties() {
        return {
          orientation: {
            type: String,
            reflect: true,
          },

          autoOrientation: {
            type: Boolean,
            reflect: true,
            attribute: 'auto-orientation',
          },
        };
      }

      __setupResizeObserver() {
        if (window.ResizeObserver) {
          const panelsContainer = this.shadowRoot.getElementById('panelsWrapper');
          const resizeObserver = new ResizeObserver(() => {
            if (this.__getMinHorizontalWidth() >= panelsContainer.getBoundingClientRect().width) {
              this.orientation = 'vertical';
            } else {
              this.orientation = 'horizontal';
            }
          });
          this.__activeResizeObserver = resizeObserver.observe(panelsContainer);
        } else {
          throw new Error(
            `ResizeObserver not available on the window. Please add the polyfill, which is explained in the tabs documentation`,
          );
        }
      }

      __cleanupResizeObserver() {
        if (this.__activeResizeObserver) {
          this.__activeResizeObserver.disconnect();
        }
      }

      updated(changeProperties) {
        super.updated(changeProperties);
        if (changeProperties.has('orientation')) {
          this.setAttribute('aria-orientation', this.orientation);
          this.tabs.forEach(tab => {
            tab.setAttribute('orientation', this.orientation);
          });

          this.__allTabsReady().then(() => {
            this.__positionTabBar();
          });
        }

        if (changeProperties.has('selectedIndex')) {
          this.__allTabsReady().then(() => {
            this.__positionTabBar();
          });
        }

        if (changeProperties.has('autoOrientation')) {
          if (this.autoOrientation) {
            this.updateComplete.then(() => {
              this.__setupResizeObserver();
            });
          } else {
            this.__cleanupResizeObserver();
          }
        }
      }
    },
);
