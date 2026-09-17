(function () {
  "use strict";
  function init() {
    var match = window.location.pathname.match(/\/(\d+(?:\.\d+)*)\/(en|zh)\/(.*)$/); if (!match) return;
    var version = match[1], current = match[2], page = match[3] || "index.html";
    var labels = { en: "English", zh: "简体中文" }, versions = ["2.0", "1.0"];
    function url(v, l, p) { return window.location.href.replace("/" + version + "/" + current + "/" + page, "/" + v + "/" + l + "/" + p); }
    function go(target, fallback) { if (location.protocol === "file:") { location.href = target; return; } fetch(target, { method: "HEAD", cache: "no-store" }).then(function (r) { location.href = r.ok ? target : fallback; }).catch(function () { location.href = fallback; }); }
    function control(cls, label, items, value, change) { var wrap = document.createElement("label"), select = document.createElement("select"); wrap.className = cls; wrap.setAttribute("aria-label", label); select.title = label; items.forEach(function (item) { var o = document.createElement("option"); o.value = item.value; o.textContent = item.label; o.selected = item.value === value; select.appendChild(o); }); select.onchange = function () { change(select.value); }; wrap.appendChild(select); return wrap; }
    var side = document.querySelector(".wy-side-nav-search"), form = side && side.querySelector("form");
    if (side && form && !side.querySelector(".sdk-doc-title")) { side.querySelectorAll(".sdk-language-switch").forEach(function (n) { n.remove(); }); var title = document.createElement("div"); title.className = "sdk-doc-title"; title.textContent = "Het-X1 SDK 开发手册"; side.insertBefore(title, side.firstChild); side.insertBefore(control("sdk-version-switch", current === "zh" ? "选择文档版本" : "Select documentation version", versions.map(function (v) { return { value: v, label: "版本 " + v }; }), version, function (v) { go(url(v, current, page), url(v, current, "index.html")); }), form); }
    function language(cls) { return control("sdk-language-switch " + cls, current === "zh" ? "切换语言" : "Switch language", ["zh", "en"].map(function (l) { return { value: l, label: labels[l] }; }), current, function (l) { go(url(version, l, page), url(version, l, "index.html")); }); }
    var navContainer = document.querySelector(".rst-content > div[role='navigation']");
    if (navContainer && !navContainer.querySelector(".sdk-language-switch-content")) {
      var actions = document.createElement("div");
      actions.className = "sdk-top-actions";
      actions.appendChild(language("sdk-language-switch-content"));
      navContainer.appendChild(actions);
    }
    var mobile = document.querySelector(".wy-nav-top"); if (mobile && !mobile.querySelector(".sdk-language-switch-mobile")) mobile.appendChild(language("sdk-language-switch-mobile"));
    var style = document.createElement("style"); style.textContent = ".wy-side-nav-search{padding:1.25rem 1rem 1rem}.sdk-doc-title{margin:0 0 1rem;color:#fff;font-size:1.05rem;font-weight:700;line-height:1.35;text-align:left}.wy-side-nav-search>a{display:block;margin-bottom:1rem}.wy-side-nav-search>a img.logo{margin:0 auto}.sdk-version-switch{display:flex;width:100%;height:2.35rem;margin:0 0 .85rem;border:1px solid #ccd6dc;border-radius:4px;background:#fff}.sdk-version-switch select,.sdk-language-switch select{width:100%;height:100%;padding:0 .7rem;border:0;outline:0;background:transparent;color:#23689b;cursor:pointer;font-size:.9rem}.sdk-top-actions{display:flex;justify-content:flex-end;margin:-0.75rem 0 1rem;padding-left:1rem}.sdk-language-switch-content{display:flex;width:9.2rem;height:2.35rem;border:1px solid #ccd6dc;border-radius:4px;background:#fff}.sdk-language-switch-mobile{display:none}.rst-content>div[role='navigation']{display:flex;align-items:center;justify-content:space-between;gap:1rem}.wy-breadcrumbs{flex:1}.wy-breadcrumbs-aside{display:none}@media screen and (max-width:768px){.sdk-language-switch-content{display:none}.sdk-language-switch-mobile{display:flex;min-width:8.5rem;height:2.25rem;margin-left:auto;border:1px solid rgba(255,255,255,.6);border-radius:4px;background:#fff}.sdk-doc-title{text-align:center}.sdk-top-actions{display:none}}"; document.head.appendChild(style);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
