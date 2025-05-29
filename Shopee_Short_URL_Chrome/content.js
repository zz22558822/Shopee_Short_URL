let MAX_HISTORY = 50;
let lastUrl = location.href;
let browserApi = (typeof browser !== "undefined" && browser.storage) ? browser : chrome;
let isLogEnabled = true
function generateShortURL() {
  const match = location.href.match(/-i\.(\d+)\.(\d+)/);
  if (match) {
    logSwitch('log', "✅ 符合網址:", match[1], match[2]);
    return `https://shopee.tw/0-i.${match[1]}.${match[2]}`;
  }
  logSwitch('warn', "沒有找到匹配的網址。");
  return location.href;
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
      showToast("✅ 已複製連結！");
  }).catch(err => {
      logSwitch('error', "❌ 無法複製連結:", err);
      showToast("❌ 複製失敗");
  });
}
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "shopee-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}
function createButton() {
  const container = document.querySelector(".page-product .container");
  if (!container) {
      logSwitch('warn', "⚠️ 找不到 .container 元素");
      return;
  }
  if (document.getElementById("shopee-copy-btn")) {
      logSwitch('log', "✅ 按鈕已存在");
      return;
  }
  const button = document.createElement("button");
  button.id = "shopee-copy-btn";
  button.textContent = "分享";
  button.onclick = () => {
      const shortURL = generateShortURL();
      copyToClipboard(shortURL);
      const titleElement = document.querySelector(".page-product .container h1");
      const title = titleElement ? titleElement.textContent.trim() : "（無標題）";
      const record = {
        time: new Date().toISOString(),
        title: title,
        url: shortURL
      };
      browserApi.storage.local.get(["shareHistory"], (result) => {
        let history = result.shareHistory || [];
        history.unshift(record);
        if (history.length > MAX_HISTORY) {
            history = history.slice(0, MAX_HISTORY);
        }
        browserApi.storage.local.set({ shareHistory: history }, () => {
            logSwitch('log', "📦 已儲存新紀錄", record);
        });
      });
  };
  const targetDiv = Array.from(document.querySelectorAll('.page-product .container .idmlsn'))
  .find(div => div.textContent.includes("分享"));
  if (targetDiv) {
    const button = document.createElement("button");
    button.textContent = "🔗";
    button.onclick = () => {
      const shortURL = generateShortURL();
      copyToClipboard(shortURL);
      const titleElement = document.querySelector(".page-product .container h1");
      const title = titleElement ? titleElement.textContent.trim() : "（無標題）";
      const record = {
        time: new Date().toLocaleString(),
        title: title,
        url: shortURL
      };
      browserApi.storage.local.get(["shareHistory"], (result) => {
        let history = result.shareHistory || [];
        history.unshift(record);
        if (history.length > MAX_HISTORY) {
          history = history.slice(0, MAX_HISTORY);
        }
        browserApi.storage.local.set({ shareHistory: history }, () => {
          logSwitch('log', "📦 已儲存新紀錄", record);
        });
      });
    };
    button.style.border = "0";
    button.style.height = "25px";
    button.style.marginLeft = "5px";
    button.style.outline = "0";
    button.style.overflow = "visible";
    button.style.padding = "0";
    button.style.position = "relative";
    button.style.width = "25px";
    button.style.borderRadius = "50%";
    targetDiv.appendChild(button);
    logSwitch('log', "✅ 分享按鈕已加入");
  } else {
    logSwitch('warn', "⚠️ 找不到包含「分享」文字的區域");
  }
  container.style.position = "relative";
  container.appendChild(button);
  logSwitch('log', "✅ 分享按鈕已渲染");
}
function logSwitch(type = 'log', ...info) {
  if (isLogEnabled && console[type]) {
    console[type](...info);
  }
}
function waitForContainerThenCreateButton() {
  const checkExist = setInterval(() => {
    const container = document.querySelector(".page-product .container");
    if (container) {
      createButton();
      clearInterval(checkExist);
    }
  }, 500);
}
setInterval(() => {
  if (location.href !== lastUrl) {
    logSwitch('log', "🔄 網址已變更");
    lastUrl = location.href;
    waitForContainerThenCreateButton();
  }
}, 1000);
const observer = new MutationObserver(() => {
  const container = document.querySelector(".page-product .container");
  if (container && !document.getElementById("shopee-copy-btn")) {
    logSwitch('log', "📦 重新渲染按鈕");
    createButton();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
waitForContainerThenCreateButton();