import { LitElement, css, html } from 'lit-element';

export class InlineNotification extends LitElement {
  static get properties() {
    return {
      type: { type: String, reflect: true },
      title: { type: String },
    };
  }

  constructor() {
    super();
    this.title = '';
    this.type = 'tip';
  }

  static get styles() {
    return css`
      :host {
        padding: 0.1rem 1.5rem;
        border-left-width: 0.5rem;
        border-left-style: solid;
        margin: 1rem 0;
        display: block;
      }

      h3 {
        font-weight: 600;
        margin-bottom: 7px;
        text-transform: uppercase;
      }

      :host([type='tip']) {
        background-color: rgba(221, 221, 221, 0.3);
        border-color: #42b983;
      }

      :host([type='warning']) {
        background-color: rgba(255, 229, 100, 0.2);
        border-color: #e7c000;
      }

      :host([type='warning']) h3 {
        color: #b29400;
      }

      :host([type='danger']) {
        background-color: rgba(192, 0, 0, 0.1);
        border-color: #c00;
      }

      :host([type='danger']) h3 {
        color: #900;
      }

      ::slotted(p) {
        line-height: 1.7;
      }
    `;
  }

  render() {
    return html`
      <h3>${this.title ? this.title : this.type}</h3>
      <slot></slot>
    `;
  }
}
