(function () {
  "use strict";

  var match = window.location.pathname.match(/\/(\d+(?:\.\d+)*)\/(en|zh)\//);
  var host = document.querySelector(".wy-side-nav-search");
  if (!match || !host) return;

  var current = match[2];
  var labels = { en: "English", zh: "中文" };
  var switcher = document.createElement("nav");
  switcher.className = "sdk-language-switch";
  switcher.setAttribute("aria-label", current === "zh" ? "语言切换" : "Language switcher");

  ["zh", "en"].forEach(function (language) {
    var link = document.createElement("a");
    link.textContent = labels[language];
    link.href = window.location.href.replace(
      "/" + match[1] + "/" + current + "/",
      "/" + match[1] + "/" + language + "/"
    );
    link.lang = language === "zh" ? "zh-CN" : "en";
    if (language === current) {
      link.className = "is-active";
      link.setAttribute("aria-current", "page");
    }
    switcher.appendChild(link);
  });

  var search = host.querySelector("form");
  host.insertBefore(switcher, search || null);
})();
