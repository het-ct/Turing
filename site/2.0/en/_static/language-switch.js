(function () {
  "use strict";

  function init() {

  var match = window.location.pathname.match(/\/(\d+(?:\.\d+)*)\/(en|zh)\/(.*)$/);
  if (!match) return;

  var version = match[1];
  var current = match[2];
  var relativePage = match[3] || "index.html";
  var labels = { en: "English", zh: "\u7b80\u4f53\u4e2d\u6587" };

  function languageUrl(language, page) {
    return window.location.href.replace(
      "/" + version + "/" + current + "/" + relativePage,
      "/" + version + "/" + language + "/" + page
    );
  }

  function navigate(language) {
    if (language === current) return;
    var target = languageUrl(language, relativePage);
    var fallback = languageUrl(language, "index.html");

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

  function createSwitcher(extraClass) {
    var wrapper = document.createElement("label");
    wrapper.className = "sdk-language-switch " + (extraClass || "");
    wrapper.setAttribute("aria-label", current === "zh" ? "\u5207\u6362\u8bed\u8a00" : "Switch language");

    var icon = document.createElement("i");
    icon.className = "fa fa-globe";
    icon.setAttribute("aria-hidden", "true");

    var select = document.createElement("select");
    select.setAttribute("title", current === "zh" ? "\u5207\u6362\u8bed\u8a00" : "Switch language");
    ["zh", "en"].forEach(function (language) {
      var option = document.createElement("option");
      option.value = language;
      option.textContent = labels[language];
      option.selected = language === current;
      select.appendChild(option);
    });
    select.addEventListener("change", function () {
      navigate(select.value);
    });

    wrapper.appendChild(icon);
    wrapper.appendChild(select);
    return wrapper;
  }

    var sidebarHost = document.querySelector(".wy-side-nav-search");
    if (sidebarHost && !sidebarHost.querySelector(".sdk-language-switch")) {
      sidebarHost.insertBefore(createSwitcher("sdk-language-switch-sidebar"), sidebarHost.querySelector("form"));
    }

    var mobileHost = document.querySelector(".wy-nav-top");
    if (mobileHost && !mobileHost.querySelector(".sdk-language-switch")) {
      mobileHost.appendChild(createSwitcher("sdk-language-switch-mobile"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
