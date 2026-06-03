/* NEVER ENDING A&R — interactions: staggered reveal, count-up stats, track bars */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Hero staggered reveal on load ---- */
  window.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".reveal").forEach(function (el) {
      var d = parseInt(el.getAttribute("data-d") || "0", 10);
      setTimeout(function () { el.classList.add("in"); }, 120 + d * 130);
    });
  });

  /* ---- Number formatting ---- */
  function fmt(n) { return n.toLocaleString("en-US"); }

  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce || target === 0) { el.textContent = prefix + fmt(target) + suffix; return; }
    var dur = 1500, start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- IntersectionObserver: reveal sections, fire counters + bars ---- */
  var groups = ".section-head,.card,.bigstat,.receipt,.member,.player,.case-story,.case-portrait,.gallery figure";
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in-view");
      io.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(groups).forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 70 + "ms";
    io.observe(el);
  });

  /* ---- Counters (hero + bigstats) ---- */
  var counterIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      countUp(e.target);
      counterIO.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(function (el) { counterIO.observe(el); });

  /* ---- Track bars fill when in view ---- */
  var list = document.getElementById("trackList");
  if (list) {
    var barIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        list.querySelectorAll("li").forEach(function (li) {
          var val = parseFloat(li.getAttribute("data-val"));
          var max = parseFloat(li.style.getPropertyValue("--max"));
          var bar = li.querySelector(".t-bar i");
          if (bar) bar.style.width = (val / max * 100) + "%";
        });
        barIO.disconnect();
      });
    }, { threshold: 0.3 });
    barIO.observe(list);
  }

  /* ---- Subtle nav background shift on scroll ---- */
  var nav = document.querySelector(".nav");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 40) nav.style.background = "rgba(10,9,8,.82)";
    else nav.style.background = "rgba(10,9,8,.55)";
  }, { passive: true });
})();
