/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html } from '@open-wc/testing';
import '../rocket-navigation.js';

const exampleContent = html`
  <div id="contentOutline">
    <h1>Introduction</h1>
    <h2 id="about-us">About Us</h2>
    <p>...</p>
    <h2 id="find-us-on-github">Find us on Github</h2>
    <p>...</p>
  </div>
`;

describe('outline', () => {
  it('finds current page', async () => {
    const el = await fixture(html`
      <rocket-navigation>
        <ul>
          <li class="current"><a href="#">Introduction</a></li>
        </ul>
      </rocket-navigation>
    `);
    expect(el.currentNode.textContent).to.equal('Introduction');
  });

  it('marks it and all parent menu-items as active', async () => {
    const el = await fixture(html`
      <rocket-navigation>
        <ul>
          <li class="menu-item">
            <a href="#">Introduction</a>
            <ul>
              <li class="current menu-item"><a href="#">Details about</a></li>
            </ul>
          </li>
        </ul>
      </rocket-navigation>
    `);
    const items = [...el.querySelectorAll('li')];
    expect(items[0]).to.have.class('active');
    expect(items[1]).to.have.class('active');
  });
});

describe('outline', () => {
  it('adds page outline as sub pages', async () => {
    const el = await fixture(html`
      <rocket-navigation content-node-selector="#contentOutline">
        <ul>
          <li class="current"><a href="#">Introduction</a></li>
        </ul>
      </rocket-navigation>
      ${exampleContent}
    `);
    expect(el.contentNodeSelector).to.equal('#contentOutline');
    expect(el.contentNode.id).to.equal('contentOutline');
    expect(el.querySelector('.current').children.length).to.equal(2);
    expect(el.querySelector('.current > ul')).lightDom.to.equal(`
      <li class="outline">
        <a href="#about-us">About Us</a>
      </li>
      <li class="outline">
        <a href="#find-us-on-github">Find us on Github</a>
      </li>
    `);
  });

  it('does not add an empty page outline', async () => {
    const el = await fixture(html`
      <rocket-navigation content-node-selector="#contentOutlineEmpty">
        <ul>
          <li class="current"><a href="#">Introduction</a></li>
        </ul>
      </rocket-navigation>
      <div id="contentOutlineEmpty"></div>
    `);
    expect(el.querySelector('.current').children.length).to.equal(1);
  });

  it('adds page outline as sub pages before real sub pages', async () => {
    const el = await fixture(html`
      <rocket-navigation content-node-selector="#contentOutline">
        <ul>
          <li class="current">
            <a href="#">Introduction</a>
            <ul>
              <li><a href="#">Details about</a></li>
            </ul>
          </li>
        </ul>
      </rocket-navigation>
      ${exampleContent}
    `);
    expect(el.contentNodeSelector).to.equal('#contentOutline');
    expect(el.contentNode.id).to.equal('contentOutline');
    expect(el.querySelector('.current').children.length).to.equal(3);
    expect(el.querySelector('.current > ul')).lightDom.to.equal(`
      <li class="outline">
        <a href="#about-us">About Us</a>
      </li>
      <li class="outline">
        <a href="#find-us-on-github">Find us on Github</a>
      </li>
    `);
  });
});
