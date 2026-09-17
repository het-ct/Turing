(function () {
  "use strict";

  function init() {
    var match = window.location.pathname.match(/\/(\d+(?:\.\d+)*)\/(en|zh)(\/.*)?$/);
    if (!match) return;

    var version = match[1];
    var language = match[2];
    var remainder = match[3] || "/";
    var page = remainder.replace(/^\//, "") || "index.html";
    if (page.charAt(page.length - 1) === "/") page += "index.html";
    var labels = { zh: "简体中文", en: "English" };

    function makeUrl(targetLanguage, targetPage) {
      var base = window.location.pathname.replace(
        "/" + version + "/" + language + remainder,
        "/" + version + "/" + targetLanguage + "/"
      );
      var targetPath = base + (targetPage === "index.html" ? "" : targetPage);
      return window.location.origin + targetPath + window.location.search + window.location.hash;
    }

    function go(target, fallback) {
      if (window.location.protocol === "file:") {
        window.location.href = target;
        return;
      }
      fetch(target, { method: "HEAD", cache: "no-store" })
        .then(function (response) { window.location.href = response.ok ? target : fallback; })
        .catch(function () { window.location.href = fallback; });
    }

    function createSwitch(className) {
      var wrapper = document.createElement("label");
      wrapper.className = "sdk-language-switch " + className;
      wrapper.setAttribute("aria-label", language === "zh" ? "切换语言" : "Switch language");
      var select = document.createElement("select");
      select.title = language === "zh" ? "切换语言" : "Switch language";
      ["zh", "en"].forEach(function (item) {
        var option = document.createElement("option");
        option.value = item;
        option.textContent = labels[item];
        option.selected = item === language;
        select.appendChild(option);
      });
      select.addEventListener("change", function () {
        go(makeUrl(select.value, page), makeUrl(select.value, "index.html"));
      });
      wrapper.appendChild(select);
      return wrapper;
    }

    // Remove the generated/static sidebar language control and show the document name there.
    var sidebar = document.querySelector(".wy-side-nav-search");
    if (sidebar) {
      sidebar.querySelectorAll(".sdk-language-switch").forEach(function (node) { node.remove(); });
      if (!sidebar.querySelector(".sdk-doc-title")) {
        var title = document.createElement("div");
        title.className = "sdk-doc-title";
        title.textContent = language === "zh" ? "Het-X1 SDK 开发手册" : "Het-X1 SDK Development Manual";
        sidebar.insertBefore(title, sidebar.firstChild);
      }
    }

    var breadcrumbs = document.querySelector(".wy-breadcrumbs");
    if (breadcrumbs && !breadcrumbs.querySelector(".sdk-language-switch-content")) {
      var item = document.createElement("li");
      item.className = "sdk-language-switch-item";
      item.appendChild(createSwitch("sdk-language-switch-content"));
      breadcrumbs.appendChild(item);
    }

    var mobile = document.querySelector(".wy-nav-top");
    if (mobile && !mobile.querySelector(".sdk-language-switch-mobile")) {
      mobile.appendChild(createSwitch("sdk-language-switch-mobile"));
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
