/* globals gauge*/
"use strict";
const {
  openBrowser,
  closeBrowser,
  client,
  switchTo,
  intercept,
  setViewPort,
  openTab,
  closeTab,
  goto,
  reload,
  title,
  click,
  doubleClick,
  rightClick,
  dragAndDrop,
  hover,
  focus,
  write,
  clear,
  attach,
  press,
  highlight,
  scrollTo,
  scrollRight,
  scrollLeft,
  scrollUp,
  scrollDown,
  screenshot,
  image,
  link,
  listItem,
  button,
  inputField,
  fileField,
  textField,
  comboBox,
  checkBox,
  radioButton,
  text,
  contains,
  toLeftOf,
  toRightOf,
  above,
  below,
  near,
  alert,
  prompt,
  confirm,
  beforeunload,
  evaluate,
  intervalSecs,
  timeoutSecs,
  to,
  into,
  waitFor,
  accept,
  dismiss
} = require("taiko");
const assert = require("assert");
const headless = process.env.headless_chrome.toLowerCase() === "true";

beforeSuite(async () => {
  await openBrowser({
    headless,
    args: ["--lang=en-US"]
  });
});

// afterSuite(async () => {
//  await closeBrowser();
// });
  
step("goto <x1>", async (x1) => {
  await goto(x1);
});

step("write <x1> in <x2>", async (x1, x2) => {
  await click(x2);
  await write(x1);
});

step("press <x1>", async (x1) => {
  await press(x1);
});

step('page contains <content>', async content => {
  assert.ok(await text(content).exists());
});
