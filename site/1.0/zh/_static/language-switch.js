(function () {
  "use strict";
  function init() {
    var match = window.location.pathname.match(/\/(\d+(?:\.\d+)*)\/(en|zh)\/(.*)$/); if (!match) return;
    var version = match[1], language = match[2], page = match[3] || "index.html", labels = { zh: "简体中文", en: "English" };
    function makeUrl(targetLanguage, targetPage) { return window.location.href.replace("/" + version + "/" + language + "/" + page, "/" + version + "/" + targetLanguage + "/" + targetPage); }
    function go(target, fallback) { if (location.protocol === "file:") { location.href = target; return; } fetch(target, { method: "HEAD", cache: "no-store" }).then(function (r) { location.href = r.ok ? target : fallback; }).catch(function () { location.href = fallback; }); }
    function createSwitch(className) { var wrapper = document.createElement("label"), select = document.createElement("select"); wrapper.className = "sdk-language-switch " + className; wrapper.setAttribute("aria-label", language === "zh" ? "切换语言" : "Switch language"); select.title = language === "zh" ? "切换语言" : "Switch language"; ["zh", "en"].forEach(function (item) { var option = document.createElement("option"); option.value = item; option.textContent = labels[item]; option.selected = item === language; select.appendChild(option); }); select.addEventListener("change", function () { go(makeUrl(select.value, page), makeUrl(select.value, "index.html")); }); wrapper.appendChild(select); return wrapper; }
    var breadcrumbs = document.querySelector(".wy-breadcrumbs"); if (breadcrumbs && !breadcrumbs.querySelector(".sdk-language-switch-content")) { var item = document.createElement("li"); item.className = "sdk-language-switch-item"; item.appendChild(createSwitch("sdk-language-switch-content")); breadcrumbs.appendChild(item); }
    var mobile = document.querySelector(".wy-nav-top"); if (mobile && !mobile.querySelector(".sdk-language-switch-mobile")) mobile.appendChild(createSwitch("sdk-language-switch-mobile"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
