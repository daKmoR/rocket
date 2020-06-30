export class RocketNavigation extends HTMLElement {
  // static get observedAttributes() {
  //   return ['content-node-selector'];
  // }
  // constructor() {
  //   super();
  //   this.currentNode = null;
  //   this.currentNodeSelector = '.current';
  //   this.contentNodeSelector = 'main';
  // }
  // attributeChangedCallback(name, oldValue, newValue) {
  //   if (name === 'content-node-selector') {
  //     this.contentNodeSelector = newValue;
  //     this.updateContentNode();
  //   }
  // }
  // updateCurrentNode() {
  //   this.currentNode = this.querySelector(this.currentNodeSelector);
  //   let el = this.currentNode;
  //   if (el) {
  //     do {
  //       if (el.classList.contains('menu-item')) {
  //         el.classList.add('active');
  //       }
  //       el = el.parentElement;
  //     } while (el !== this);
  //   }
  // }
  // updateContentNode() {
  //   if (this.isConnected) {
  //     this.contentNode = document.querySelector(this.contentNodeSelector);
  //     if (this.contentNode) {
  //       this.updateOutline();
  //     }
  //   }
  // }
  // updateOutline() {
  //   if (!this.currentNode) {
  //     return;
  //   }
  //   const outlineEls = this.contentNode.querySelectorAll('h2');
  //   if (outlineEls.length > 0) {
  //     const outline = document.createElement('ul');
  //     outline.classList.add('outline-wrapper');
  //     for (const outlineEl of outlineEls) {
  //       const item = document.createElement('li');
  //       item.classList.add('outline');
  //       const link = document.createElement('a');
  //       link.href = `#${outlineEl.id}`;
  //       link.innerText = outlineEl.innerText;
  //       item.appendChild(link);
  //       outline.appendChild(item);
  //     }
  //     if (this.currentNode.children.length > 1) {
  //       this.currentNode.firstElementChild.insertAdjacentElement('afterend', outline);
  //     } else {
  //       this.currentNode.appendChild(outline);
  //     }
  //   }
  // }
  // connectedCallback() {
  //   // this.updateCurrentNode();
  //   this.updateContentNode();
  // }
}
