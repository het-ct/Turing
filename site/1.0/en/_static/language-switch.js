(function () {
  "use strict";

  function init() {
    var match = window.location.pathname.match(/\/(\d+(?:\.\d+)*)\/(en|zh)\/(.*)$/);
    if (!match) return;

    var version = match[1];
    var current = match[2];
    var relativePage = match[3] || "index.html";
    var labels = { en: "English", zh: "简体中文" };
    var versionLabels = { "2.0": "2.0", "1.0": "1.0" };

    function languageUrl(language, page) {
      return window.location.href.replace(
        "/" + version + "/" + current + "/" + relativePage,
        "/" + version + "/" + language + "/" + page
      );
    }

    function versionUrl(targetVersion, language, page) {
      return window.location.href.replace(
        "/" + version + "/" + current + "/" + relativePage,
        "/" + targetVersion + "/" + language + "/" + page
      );
    }

    function navigate(url, fallback) {
      if (window.location.protocol === "file:") {
        window.location.href = url;
        return;
      }
      fetch(url, { method: "HEAD", cache: "no-store" })
        .then(function (response) { window.location.href = response.ok ? url : fallback; })
        .catch(function () { window.location.href = fallback; });
    }

    function createSelect(className, ariaLabel, options, value, onChange) {
      var wrapper = document.createElement("label");
      wrapper.className = className;
      wrapper.setAttribute("aria-label", ariaLabel);
      var select = document.createElement("select");
      select.title = ariaLabel;
      options.forEach(function (item) {
        var option = document.createElement("option");
        option.value = item.value;
        option.textContent = item.label;
        option.selected = item.value === value;
        select.appendChild(option);
      });
      select.addEventListener("change", function () { onChange(select.value); });
      wrapper.appendChild(select);
      return wrapper;
    }

    var sidebar = document.querySelector(".wy-side-nav-search");
    var form = sidebar && sidebar.querySelector("form");
    if (sidebar && form && !sidebar.querySelector(".sdk-doc-title")) {
      sidebar.querySelectorAll(".sdk-language-switch").forEach(function (node) { node.remove(); });
      var title = document.createElement("div");
      title.className = "sdk-doc-title";
      title.textContent = "Het-X1 SDK 开发手册";
      sidebar.insertBefore(title, sidebar.firstChild);

      var versionSelect = createSelect(
        "sdk-version-switch",
        current === "zh" ? "选择文档版本" : "Select documentation version",
        Object.keys(versionLabels).map(function (item) { return { value: item, label: "版本 " + item }; }),
        version,
        function (targetVersion) {
          var target = versionUrl(targetVersion, current, relativePage);
          navigate(target, versionUrl(targetVersion, current, "index.html"));
        }
      );
      sidebar.insertBefore(versionSelect, form);
    }

    function createLanguageSwitch(className) {
      return createSelect(
        "sdk-language-switch " + className,
        current === "zh" ? "切换语言" : "Switch language",
        ["zh", "en"].map(function (item) { return { value: item, label: labels[item]; }; }),
        current,
        function (language) {
          var target = languageUrl(language, relativePage);
          navigate(target, languageUrl(language, "index.html"));
        }
      );
    }

    var aside = document.querySelector(".wy-breadcrumbs-aside");
    if (aside && !aside.querySelector(".sdk-language-switch-content")) {
      aside.appendChild(createLanguageSwitch("sdk-language-switch-content"));
    }

    var mobileHost = document.querySelector(".wy-nav-top");
    if (mobileHost && !mobileHost.querySelector(".sdk-language-switch-mobile")) {
      mobileHost.appendChild(createLanguageSwitch("sdk-language-switch-mobile"));
    }

    var style = document.createElement("style");
    style.textContent = "\n      .wy-side-nav-search { padding: 1.25rem 1rem 1rem; }\n      .sdk-doc-title { margin: 0 0 1rem; color: #fff; font-size: 1.05rem; font-weight: 700; line-height: 1.35; text-align: left; }\n      .wy-side-nav-search > a { display: block; margin-bottom: 1rem; }\n      .wy-side-nav-search > a img.logo { margin: 0 auto; }\n      .sdk-version-switch { display: flex; width: 100%; height: 2.35rem; margin: 0 0 .85rem; border: 1px solid #ccd6dc; border-radius: 4px; background: #fff; }\n      .sdk-version-switch select, .sdk-language-switch select { width: 100%; height: 100%; padding: 0 .7rem; border: 0; outline: 0; background: transparent; color: #23689b; cursor: pointer; font-size: .9rem; }\n      .wy-breadcrumbs { position: relative; }\n      .wy-breadcrumbs-aside { display: flex; align-items: center; gap: .5rem; }\n      .sdk-language-switch-content { display: flex; width: 9.2rem; height: 2.35rem; border: 1px solid #ccd6dc; border-radius: 4px; background: #fff; }\n      .sdk-language-switch-mobile { display: none; }\n      @media screen and (max-width: 768px) { .sdk-language-switch-content { display: none; } .sdk-language-switch-mobile { display: flex; min-width: 8.5rem; height: 2.25rem; margin-left: auto; border: 1px solid rgba(255,255,255,.6); border-radius: 4px; background: #fff; } .sdk-doc-title { text-align: center; } }\n    ";
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
