(function () {
  "use strict";

  function init() {
    var match = window.location.pathname.match(/\/(\d+(?:\.\d+)*)\/(en|zh)\/(.*)$/);
    if (!match) return;

    var version = match[1];
    var language = match[2];
    var page = match[3] || "index.html";
    var labels = { zh: "简体中文", en: "English" };

    function makeUrl(targetLanguage, targetPage) {
      return window.location.href.replace(
        "/" + version + "/" + language + "/" + page,
        "/" + version + "/" + targetLanguage + "/" + targetPage
      );
    }

    function go(target, fallback) {
      if (window.location.protocol === "file:") {
        window.location.href = target;
        return;
      }
      fetch(target, { method: "HEAD", cache: "no-store" })
        .then(function (response) {
          window.location.href = response.ok ? target : fallback;
        })
        .catch(function () {
          window.location.href = fallback;
        });
    }

    function createLanguageSwitch(className) {
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
        var target = makeUrl(select.value, page);
        go(target, makeUrl(select.value, "index.html"));
      });
      wrapper.appendChild(select);
      return wrapper;
    }

    // Put the switch directly inside the visible breadcrumb/title bar.
    var breadcrumbs = document.querySelector(".wy-breadcrumbs");
    if (breadcrumbs && !breadcrumbs.querySelector(".sdk-language-switch-content")) {
      var item = document.createElement("li");
      item.className = "sdk-language-switch-item";
      item.appendChild(createLanguageSwitch("sdk-language-switch-content"));
      breadcrumbs.appendChild(item);
    }

    var mobile = document.querySelector(".wy-nav-top");
    if (mobile && !mobile.querySelector(".sdk-language-switch-mobile")) {
      mobile.appendChild(createLanguageSwitch("sdk-language-switch-mobile"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
