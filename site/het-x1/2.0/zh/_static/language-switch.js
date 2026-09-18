(function () {
  "use strict";

  function fallbackUrl(target) {
    var match = target.pathname.match(/^(.*\/[^/]+\/(?:en|zh)\/)/);
    return match ? new URL(match[1] + "index.html", target.origin) : target;
  }

  function navigate(select) {
    var target = new URL(select.value, window.location.href);
    if (target.href === window.location.href) return;

    if (window.location.protocol === "file:") {
      window.location.href = target.href;
      return;
    }

    fetch(target.href, { method: "HEAD", cache: "no-store" })
      .then(function (response) {
        window.location.href = response.ok ? target.href : fallbackUrl(target).href;
      })
      .catch(function () {
        window.location.href = fallbackUrl(target).href;
      });
  }

  function init() {
    document.querySelectorAll(".sdk-navigation-select select").forEach(function (select) {
      select.addEventListener("change", function () {
        navigate(select);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
