// @ts-check

/**
 * Is the Node an Element?
 * @param  {Node}  node
 * @return {node is Element}
 */
function isElement(node) {
  return node.nodeType === 1;
}

export class RocketNavigation extends HTMLElement {
  // static get observedAttributes() {
  //   return ['content-node-selector'];
  // }

  constructor() {
    super();
    // this.currentNode = null;
    // this.currentNodeSelector = '.current';
    // this.contentNodeSelector = 'main';
    this.closeOverlay = this.closeOverlay.bind(this);
    this.addClickListener = this.addClickListener.bind(this);
    this.__mo = new MutationObserver(records => {
      records.forEach(({ addedNodes, removedNodes }) => {
        addedNodes.forEach(this.addClickListener);
        removedNodes.forEach(this.removeClickListener);
      })
    })
  }

  connectedCallback() {
    this.setAttribute('role', 'navigation');
    for (const link of Array.from(this.querySelectorAll('.anchor')))
      this.addClickListener(link);
  }

  /**
   * Adds Click listener to anchor links
   * @param {Node} node
   * @private
   */
  addClickListener(node) {
    if (isElement(node) && node.classList.contains('anchor')) {
      node.addEventListener('click', this.closeOverlay);
    }
  }

  /**
   * Removes Click listener from anchor links
   * @param {Node} node
   * @private
   */
  removeClickListener(node) {
    node.removeEventListener('click', this.closeOverlay);
  }

  /**
   * Dispatches a `close-overlay` event
   * @private
   */
  closeOverlay() {
    this.dispatchEvent(new CustomEvent('close-overlay', { bubbles: true }));
  }

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
