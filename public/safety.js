(function () {
  var root = document.documentElement;
  var lastEscape = 0;

  function leave(fallback) {
    var url = root.getAttribute("data-exit-url") || fallback;
    if (!url) return;
    window.location.replace(url);
  }

  function elementFrom(target) {
    if (!target) return null;
    if (target.nodeType === 1) return target;
    return target.parentElement || null;
  }

  var button = document.querySelector("[data-menu-button]");
  var menu = document.querySelector("[data-menu]");

  function setMenu(open) {
    if (!button || !menu) return;
    button.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) menu.classList.add("is-open");
    else menu.classList.remove("is-open");
    var label = open ? button.getAttribute("data-label-close") : button.getAttribute("data-label-open");
    if (label) button.textContent = label;
  }

  document.addEventListener("click", function (event) {
    var el = elementFrom(event.target);
    if (!el || !el.closest) return;

    var exit = el.closest("[data-quick-exit]");
    if (exit) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      leave(exit.getAttribute("href"));
      return;
    }

    if (!button || !menu) return;
    if (button.getAttribute("aria-expanded") !== "true") return;
    if (menu.contains(el) || button.contains(el)) return;
    setMenu(false);
  });

  document.addEventListener("keydown", function (event) {
    var key = event.key || event.keyCode;
    var isEscape = key === "Escape" || key === "Esc" || key === 27;
    if (!isEscape) {
      lastEscape = 0;
      return;
    }
    var now = new Date().getTime();
    if (lastEscape && now - lastEscape < 2000) {
      event.preventDefault();
      leave(null);
      return;
    }
    lastEscape = now;
  });

  if (button && menu) {
    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") === "true";
      setMenu(!open);
    });
  }
})();
