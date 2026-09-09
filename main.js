/* AZRA BOSTANCI — shared interactions: navigation, scroll reveal, poem overlay,
   custom audio player, paintings lightbox, contact form. Dependency-free. */

(function () {
  "use strict";

  /* ---------------- search index ---------------- */
  var SEARCH_INDEX = [
    { title: "Ana Sayfa", url: "index.html", cat: "Arşiv" },
    { title: "Hakkında", url: "hakkinda.html", cat: "Arşiv" },
    { title: "Yazılar", url: "yazilar.html", cat: "Yazılar" },
    { title: "Örnek Deneme 1 (Yer Tutucu)", url: "yazi-murekkebin-sabri.html", cat: "Yazı · Yer Tutucu" },
    { title: "Örnek Deneme 2 (Yer Tutucu)", url: "yazi-boya-ve-kelime.html", cat: "Yazı · Yer Tutucu" },
    { title: "Örnek Deneme 3 (Yer Tutucu)", url: "yazi-kayip-mektup.html", cat: "Yazı · Yer Tutucu" },
    { title: "Örnek Günce (Yer Tutucu)", url: "yazi-atolyede-sabah.html", cat: "Yazı · Yer Tutucu Günce" },
    { title: "Şiirler", url: "siirler.html", cat: "Şiirler" },
    { title: "Podcastler", url: "podcast.html", cat: "Podcast — Mürekkep Saatleri" },
    { title: "Resimler", url: "resimler.html", cat: "Resimler — Sergi Kataloğu" },
    { title: "Kitaplar", url: "kitaplar.html", cat: "Kitaplar — Okuma Notları" },
    { title: "Çalışmalar", url: "calismalarim.html", cat: "Dergiler ve Projeler" },
    { title: "Benimle Çalışın", url: "benimle-calisin.html", cat: "Hizmetler ve İş Birliği" },
    { title: "İletişim", url: "iletisim.html", cat: "İletişim" }
  ];

  /* ---------------- search overlay ---------------- */
  var searchToggle = document.querySelector("[data-search-toggle]");
  var searchOverlay = document.querySelector("[data-search-overlay]");
  if (searchToggle && searchOverlay) {
    var searchInput = searchOverlay.querySelector("[data-search-input]");
    var searchResults = searchOverlay.querySelector("[data-search-results]");
    var searchCloseBtn = searchOverlay.querySelector("[data-search-close]");
    var docRoot = document.documentElement;

    function renderResults(query) {
      var q = query.trim().toLocaleLowerCase("tr");
      searchResults.innerHTML = "";
      if (!q) return;
      var matches = SEARCH_INDEX.filter(function (item) {
        return item.title.toLocaleLowerCase("tr").indexOf(q) !== -1 ||
          item.cat.toLocaleLowerCase("tr").indexOf(q) !== -1;
      });
      if (!matches.length) {
        var empty = document.createElement("li");
        empty.className = "search-empty";
        empty.textContent = "Sonuç bulunamadı.";
        searchResults.appendChild(empty);
        return;
      }
      matches.forEach(function (item) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = item.url;
        var t = document.createElement("span");
        t.className = "t";
        t.textContent = item.title;
        var c = document.createElement("span");
        c.className = "c";
        c.textContent = item.cat;
        a.appendChild(t);
        a.appendChild(c);
        li.appendChild(a);
        searchResults.appendChild(li);
      });
    }

    function openSearch() {
      docRoot.classList.remove("nav-open");
      docRoot.classList.add("search-open");
      searchToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
      if (searchInput) {
        searchInput.value = "";
        searchResults.innerHTML = "";
        setTimeout(function () { searchInput.focus(); }, 50);
      }
    }
    function closeSearch() {
      docRoot.classList.remove("search-open");
      searchToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    }

    searchToggle.addEventListener("click", function () {
      if (docRoot.classList.contains("search-open")) closeSearch();
      else openSearch();
    });
    if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearch);
    searchOverlay.addEventListener("click", function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSearch();
    });
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderResults(searchInput.value);
      });
      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          var first = searchResults.querySelector("a");
          if (first) window.location.href = first.getAttribute("href");
        }
      });
    }
  }

  /* ---------------- navigation ---------------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var root = document.documentElement;

  function closeNav() {
    root.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
  function openNav() {
    root.classList.remove("search-open");
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

  /* ---------------- magazine reader (Çalışmalar) ---------------- */
  var MAGAZINES = {
    "pusula-2": { title: "Pusula", issue: "İkinci Sayı — Nisan 2025", pages: 24, link: "https://online.fliphtml5.com/ngrqj/vgvv/#p=1" },
    "pusula-3": { title: "Pusula", issue: "Üçüncü Sayı — Mayıs 2025", pages: 24, link: "https://online.fliphtml5.com/ngrqj/xjef/#p=1" },
    "pusula-4": { title: "Pusula", issue: "Dördüncü Sayı — Kasım 2025", pages: 32, link: "https://online.fliphtml5.com/ngrqj/phie/" },
    "maypa-1": { title: "Maypa", issue: "1. Sayı — Ağustos 2026", pages: 34, link: "https://online.fliphtml5.com/maypascam/fbcf/#p=1" },
    "dusart-7": { title: "DüşArt", issue: "7. Sayı — Aralık 2024", pages: 64, link: "https://xn--dsart-kva.com/themes/ripple/sayi7.pdf" },
    "dusart-9": { title: "DüşArt", issue: "9. Sayı — Şubat 2025", pages: 58, link: "https://xn--dsart-kva.com/themes/ripple/sayi9.pdf" }
  };

  var readerTriggers = document.querySelectorAll("[data-reader-open]");
  var reader = document.querySelector("[data-reader-overlay]");
  if (reader && readerTriggers.length) {
    var rImg = reader.querySelector("[data-reader-img]");
    var rMag = reader.querySelector("[data-reader-mag]");
    var rIssue = reader.querySelector("[data-reader-issue]");
    var rCurrent = reader.querySelector("[data-reader-current]");
    var rTotal = reader.querySelector("[data-reader-total]");
    var rPrev = reader.querySelector("[data-reader-prev]");
    var rNext = reader.querySelector("[data-reader-next]");
    var rClose = reader.querySelector("[data-reader-close]");
    var rSource = reader.querySelector("[data-reader-source]");

    var currentSlug = null;
    var currentPage = 1;
    var totalPages = 1;

    function pagePath(slug, n) {
      var nn = n < 10 ? "0" + n : "" + n;
      return "images/dergiler/" + slug + "/page-" + nn + ".jpg";
    }

    function renderReaderPage() {
      rImg.classList.add("is-turning");
      setTimeout(function () {
        rImg.src = pagePath(currentSlug, currentPage);
        rImg.alt = rMag.textContent + " — sayfa " + currentPage;
        rImg.classList.remove("is-turning");
      }, 140);
      rCurrent.textContent = currentPage;
      rPrev.disabled = currentPage <= 1;
      rNext.disabled = currentPage >= totalPages;
      if (currentPage < totalPages) { var nextImg = new Image(); nextImg.src = pagePath(currentSlug, currentPage + 1); }
      if (currentPage > 1) { var prevImg = new Image(); prevImg.src = pagePath(currentSlug, currentPage - 1); }
    }

    function openReader(slug) {
      var mag = MAGAZINES[slug];
      if (!mag) return;
      currentSlug = slug;
      currentPage = 1;
      totalPages = mag.pages;
      rMag.textContent = mag.title;
      rIssue.textContent = mag.issue;
      rTotal.textContent = totalPages;
      if (rSource) rSource.href = mag.link || "#";
      renderReaderPage();
      reader.classList.add("is-open");
      document.body.classList.add("no-scroll");
    }
    function closeReader() {
      reader.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
    function readerGoPrev() { if (currentPage > 1) { currentPage--; renderReaderPage(); } }
    function readerGoNext() { if (currentPage < totalPages) { currentPage++; renderReaderPage(); } }

    readerTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openReader(trigger.getAttribute("data-magazine"));
      });
    });
    if (rClose) rClose.addEventListener("click", closeReader);
    if (rPrev) rPrev.addEventListener("click", readerGoPrev);
    if (rNext) rNext.addEventListener("click", readerGoNext);
    reader.addEventListener("click", function (e) {
      if (e.target === reader) closeReader();
    });
    document.addEventListener("keydown", function (e) {
      if (!reader.classList.contains("is-open")) return;
      if (e.key === "Escape") closeReader();
      if (e.key === "ArrowLeft") readerGoPrev();
      if (e.key === "ArrowRight") readerGoNext();
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

  /* ---------------- copy email button ---------------- */
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
  }
  document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var email = btn.getAttribute("data-copy-email");
      var markCopied = function () {
        btn.classList.add("is-copied");
        btn.setAttribute("aria-label", "Kopyalandı");
        clearTimeout(btn._copyTimeout);
        btn._copyTimeout = setTimeout(function () {
          btn.classList.remove("is-copied");
          btn.setAttribute("aria-label", "E-posta adresini kopyala");
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(markCopied, function () {
          fallbackCopy(email);
          markCopied();
        });
      } else {
        fallbackCopy(email);
        markCopied();
      }
    });
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
