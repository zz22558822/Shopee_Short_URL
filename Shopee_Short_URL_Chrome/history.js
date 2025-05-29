function getBrowserType() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Chrome")) {
    return "Chrome";
  } else if (userAgent.includes("Firefox")) {
    return "Firefox";
  } else if (userAgent.includes("Safari")) {
    return "Safari";
  } else if (userAgent.includes("Edge")) {
    return "Edge";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    return "Opera";
  } else if (userAgent.includes("IE") || userAgent.includes("Trident")) {
    return "Internet Explorer";
  } else {
    return "Other";
  }
}
const browserType = getBrowserType();
console.log("使用者瀏覽器:", browserType);
const browserApi = typeof browser !== "undefined" ? browser : chrome;
document.addEventListener("DOMContentLoaded", () => {
  let currentTheme = localStorage.getItem("theme");
  if (currentTheme === null) {
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      currentTheme = prefersDarkScheme ? "dark" : "light";
      localStorage.setItem("theme", currentTheme);
  }
  document.documentElement.setAttribute("data-bs-theme", currentTheme);
  const themeToggleButton = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  themeIcon.classList.toggle("fa-sun", currentTheme !== "dark");
  themeIcon.classList.toggle("fa-moon", currentTheme === "dark");
  themeToggleButton.addEventListener("click", () => {
      const newTheme = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-bs-theme", newTheme);
      themeIcon.classList.toggle("fa-sun", newTheme !== "dark");
      themeIcon.classList.toggle("fa-moon", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
  });
});
$(document).ready(function () {
  browserApi.storage.local.get(["shareHistory"], (result) => {
    const history = result.shareHistory || [];
    const tbody = $("#historyTable tbody");
    history.forEach(record => {
      const tr = $("<tr></tr>");
      const date = new Date(record.time).toLocaleString();
      const title = record.title || "（無標題）";
      const url = record.url;
      tr.append(`<td>${date}</td>`);
      tr.append(`<td>${title}</td>`);
      tr.append(`<td><a href="${url}" target="_blank">${url}</a></td>`);
      tr.append(`
        <td class="text-center">
          <button class="btn btn-sm btn-primary me-1 copy-btn" data-url="${url}">
            <i class="fa-regular fa-copy"></i>
          </button>
          <button class="btn btn-sm btn-success open-url-btn" data-url="${url}">
            <i class="fa-solid fa-up-right-from-square"></i>
          </button>
        </td>
      `);
      tbody.append(tr);
    });
    $('#historyTable').DataTable({
      paging: false,
      searching: true,
      info: false,
      fixedHeader: true,
          language: {
            search: "搜尋：",
            zeroRecords: "找不到符合的資料",
            infoEmpty: "沒有相符的數據",
            emptyTable: "目前無數據，請檢查伺服器連線。"
          },
      order: [[0, 'desc']]
    });
    $(".copy-btn").click(function () {
      const url = $(this).data("url");
      navigator.clipboard.writeText(url).then(() => {
        $(this)
          .removeClass("btn-primary")
          .addClass("btn-warning")
          .html('<i class="fa-solid fa-check"></i>');
        setTimeout(() => {
          $(this)
            .removeClass("btn-warning")
            .addClass("btn-primary")
            .html('<i class="fa-regular fa-copy"></i>');
        }, 1000);
      });
    });
    $(".open-url-btn").click(function () {
      const url = $(this).data("url");
      window.open(url, "_blank");
    });
  });
});
$(window).scroll(function () {
  if ($(this).scrollTop() > 50) {
    $('#topBtn').fadeIn();
  } else {
    $('#topBtn').fadeOut();
  }
});
$('#topBtn').click(function () {
  $('html, body').animate({ scrollTop: 0 }, 500);
  return false;
});
$(window).scroll(function () {
  if ($(this).scrollTop() > 30) {
    $('#themeToggle').fadeOut();
  } else {
    $('#themeToggle').fadeIn();
  }
});