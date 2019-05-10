/* globals gauge*/
"use strict";
const {
  openBrowser,
  write,
  closeBrowser,
  goto,
  press,
  click,
  text,
  textBox,
  focus,
  inputField,
  toRightOf
} = require("taiko");
const assert = require("assert");
const headless = process.env.headless_chrome.toLowerCase() === "true";

beforeSuite(async () => {
  await openBrowser({
    headless,
    args: ["--lang=en-US"]
  });
});

afterSuite(async () => {
  // await closeBrowser();
});

step("Goto <page> page", async page => {
  await goto(`http://www.google.com/search?q=${encodeURI(page)}&btnI`);
});

step("Search for <query>", async (query) => {
  await focus(textBox("pesquise"));
  await write(query);
  await press("Enter");
});

step("Page contains <content>", async content => {
  assert.ok(await text(content).exists());
});

step("Click on <target>", async target => {
  await text(target).exists();
  await click(target);
});
