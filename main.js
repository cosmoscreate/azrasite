/* AZRA BOSTANCI — shared interactions: navigation, scroll reveal, poem overlay,
   custom audio player, paintings lightbox, contact form. Dependency-free. */

(function () {
  "use strict";

  /* ---------------- navigation ---------------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var root = document.documentElement;

  function closeNav() {
    root.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
  function openNav() {
    root.classList.add("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      if (root.classList.contains("nav-open")) closeNav();
      else openNav();
    });
  }
  document.querySelectorAll(".site-nav-list a, .site-nav-foot a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".site-nav-list a[href]").forEach(function (a) {
    var target = a.getAttribute("href").toLowerCase();
    if (target === here || (here === "" && target === "index.html")) {
      a.classList.add("is-active");
    }
  });

  /* ---------------- scroll reveal ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- back to top ---------------- */
  document.querySelectorAll("[data-back-top]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ---------------- poem overlay (Şiirler) ---------------- */
  var poemTiles = document.querySelectorAll("[data-poem-open]");
  var poemOverlay = document.querySelector("[data-poem-overlay]");
  if (poemOverlay && poemTiles.length) {
    var oNo = poemOverlay.querySelector("[data-poem-no]");
    var oTitle = poemOverlay.querySelector("[data-poem-title]");
    var oBody = poemOverlay.querySelector("[data-poem-body]");
    var poemCloseBtn = poemOverlay.querySelector("[data-poem-close]");

    function openPoem(tile) {
      oNo.textContent = tile.getAttribute("data-no");
      oTitle.textContent = tile.getAttribute("data-title");
      oBody.textContent = tile.getAttribute("data-body");
      poemOverlay.classList.add("is-open");
      document.body.classList.add("no-scroll");
    }
    function closePoem() {
      poemOverlay.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
    poemTiles.forEach(function (tile) {
      tile.addEventListener("click", function () { openPoem(tile); });
    });
    if (poemCloseBtn) poemCloseBtn.addEventListener("click", closePoem);
    poemOverlay.addEventListener("click", function (e) {
      if (e.target === poemOverlay) closePoem();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePoem();
    });
  }

  /* ---------------- paintings lightbox (Resimler) ---------------- */
  var galleryItems = document.querySelectorAll("[data-gallery-open]");
  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox && galleryItems.length) {
    var lbImg = lightbox.querySelector("[data-lightbox-img]");
    var lbTitle = lightbox.querySelector("[data-lightbox-title]");
    var lbMeta = lightbox.querySelector("[data-lightbox-meta]");
    var lbCloseBtn = lightbox.querySelector("[data-lightbox-close]");

    function openLightbox(item) {
      var img = item.querySelector("img");
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.getAttribute("alt") || "";
      lbTitle.textContent = item.getAttribute("data-title") || "";
      lbMeta.textContent = item.getAttribute("data-meta") || "";
      lightbox.classList.add("is-open");
      document.body.classList.add("no-scroll");
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () { openLightbox(item); });
    });
    if (lbCloseBtn) lbCloseBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------------- custom podcast player ---------------- */
  function formatTime(sec) {
    if (!isFinite(sec)) return "0:00";
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  document.querySelectorAll("[data-episode]").forEach(function (ep) {
    var audio = ep.querySelector("audio");
    var playBtn = ep.querySelector("[data-play]");
    var bar = ep.querySelector("[data-bar]");
    var fill = ep.querySelector("[data-bar-fill]");
    var curEl = ep.querySelector("[data-time-current]");
    var durEl = ep.querySelector("[data-time-duration]");
    var transcriptToggle = ep.querySelector("[data-transcript-toggle]");
    var transcript = ep.querySelector("[data-transcript]");

    if (!audio || !playBtn) return;

    playBtn.addEventListener("click", function () {
      document.querySelectorAll("audio").forEach(function (other) {
        if (other !== audio) other.pause();
      });
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", function () {
      playBtn.setAttribute("data-state", "playing");
      playBtn.textContent = "❚❚";
    });
    audio.addEventListener("pause", function () {
      playBtn.setAttribute("data-state", "paused");
      playBtn.textContent = "▶";
    });
    audio.addEventListener("loadedmetadata", function () {
      if (durEl) durEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener("timeupdate", function () {
      var pct = (audio.currentTime / audio.duration) * 100 || 0;
      if (fill) fill.style.width = pct + "%";
      if (curEl) curEl.textContent = formatTime(audio.currentTime);
    });
    audio.addEventListener("ended", function () {
      if (fill) fill.style.width = "0%";
    });

    if (bar) {
      bar.addEventListener("click", function (e) {
        var rect = bar.getBoundingClientRect();
        var pct = (e.clientX - rect.left) / rect.width;
        if (isFinite(audio.duration)) audio.currentTime = pct * audio.duration;
      });
    }

    if (transcriptToggle && transcript) {
      transcriptToggle.addEventListener("click", function () {
        var open = transcript.classList.toggle("is-open");
        transcriptToggle.textContent = open ? "Metni gizle" : "Metni oku";
      });
    }
  });

  /* ---------------- contact form → mailto ---------------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");
      var to = form.getAttribute("data-to") || "";
      var subject = encodeURIComponent("İletişim — " + (name ? name.value : ""));
      var body = encodeURIComponent(
        (message ? message.value : "") +
          "\n\n—\n" +
          (name ? name.value : "") +
          (email ? "\n" + email.value : "")
      );
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });
  }
})();
