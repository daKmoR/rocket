/* eslint-disable @typescript-eslint/ban-ts-comment */
import { css, html, unsafeHTML } from '@lion/core';
import { LionOption } from '@lion/listbox';
import { LinkMixin } from './LinkMixin.js';

function textToColor(text) {
  var hash = 0;
  if (text.length == 0) return hash;
  for (var i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  var shortened = hash % 360;
  return 'hsl(' + shortened + ',100%,80%)';
}

// @ts-expect-error https://github.com/microsoft/TypeScript/issues/40110
export class RocketSearchOption extends LinkMixin(LionOption) {
  static get properties() {
    return {
      title: {
        type: String,
      },
      text: {
        type: String,
      },
      section: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.title = '';
    this.text = '';
    this.section = '';
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: relative;
          padding: 12px 10px;
          display: flex;
          align-items: center;
          background: none;
          font-weight: normal;
        }

        :host:hover,
        :host([active]) {
          background: #eee !important;
        }

        .circle {
          background: #ccc;
          padding: 10px;
          border-radius: 25px;
          width: 20px;
          line-height: 20px;
          text-align: center;
          margin-right: 14px;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .circle.docs {
          background: orange;
        }

        .title {
          margin-bottom: 4px;
          color: #000;
        }

        .text {
          font-size: 14px;
        }

        @media screen and (min-width: 1024px) {
          :host {
            max-width: 600px;
          }
        }
      `,
    ];
  }

  // /**
  //  * @configure LionCombobox
  //  * @param {string} matchingString
  //  */
  // onFilterMatch(matchingString) {
  //   this.__originalTitle = this.title;
  //   this.__originalText = this.text;

  //   this.title = processResultText(matchingString, this.__originalTitle);
  //   this.text = processResultText(matchingString, this.__originalText);
  // }

  // /**
  //  * @configure LionCombobox
  //  */
  // // eslint-disable-next-line no-unused-vars
  // onFilterUnmatch() {
  //   if (this.__originalTitle) {
  //     this.title = this.__originalTitle;
  //   }
  //   if (this.__originalText) {
  //     this.text = this.__originalText;
  //   }
  // }

  render() {
    return html`
      <div class="circle ${this.section}" style="background-color: ${textToColor(this.section)};">
        ${this.section[0]}
      </div>
      <div class="choice-field__label">
        <div class="title">${unsafeHTML(this.title)}</div>
        <div class="text">${unsafeHTML(this.text)}</div>
      </div>
    `;
  }
}
