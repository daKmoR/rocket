import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import '../rocket-navigation.js';

describe('rocket-navigation', () => {
  it('fires a "close-overlay" event if you click on an anchor', async () => {
    const spy = sinon.spy();
    const el = await fixture(html`
      <rocket-navigation @close-overlay=${spy}>
        <ul>
          <li class="menu-item">
            <a href="">Getting Started</a>
            <ul>
              <li class="menu-item anchor">
                <a href="#setup-sections" class="anchor">Setup sections</a>
              </li>
            </ul>
          </li>
        </ul>
      </rocket-navigation>
    `);
    const anchor = el.querySelector('.anchor');
    anchor.click();
    expect(spy).to.have.been.calledOnce;
  });

  it('will navigate to the first sub page if there is one that is not an anchor', async () => {
    const pageSpy = sinon.spy();
    const anchorSpy = sinon.spy();

    const el = await fixture(html`
      <rocket-navigation>
        <ul>
          <li class="menu-item">
            <a>With SubPages</a>
            <ul>
              <li class="menu-item anchor">
                <a @click=${pageSpy}>SubPage</a>
              </li>
            </ul>
          </li>
          <li class="menu-item">
            <a>Without SubPages</a>
            <ul>
              <li class="menu-item anchor">
                <a class="anchor" @click=${anchorSpy}>Anchor of Without SubPages</a>
              </li>
            </ul>
          </li>
        </ul>
      </rocket-navigation>
    `);
    const links = el.querySelectorAll('rocket-navigation > ul > li > a');
    links[0].click();
    expect(pageSpy).to.be.calledOnce;

    links[1].click();
    expect(anchorSpy).to.not.be.called;
  });
});
