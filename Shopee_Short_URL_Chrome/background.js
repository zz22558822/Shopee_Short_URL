const browserAction = chrome.action || chrome.browserAction;
browserAction.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL("history.html") });
});