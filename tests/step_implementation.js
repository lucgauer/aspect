/* globals gauge*/
'use strict';
const {
  openBrowser,
  write,
  closeBrowser,
  goto,
  press,
  text,
  focus,
  inputField,
  toRightOf,
} = require('taiko');
const assert = require('assert');
const headless = process.env.headless_chrome.toLowerCase() === 'true';

beforeSuite(async () => {
  await openBrowser({headless});
});

afterSuite(async () => {
  await closeBrowser();
});

step('Goto getgauge github page', async () => {
  await goto('https://github.com/getgauge');
});

step('Search for <query>', async (query) => {
  await focus(inputField(toRightOf('Pricing')));
  await write(query);
  await press('Enter');
});

step('Page contains <content>', async (content) => {
  assert.ok(await text(content).exists());
});
