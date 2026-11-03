/* ==========================================================================
   Việt Nam Travel — Interactions
   ========================================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const panels = $$(".panel");
  const navLinks = $$(".main-nav a");
  const dots = $$(".side-dots a");

  /* ------------------------------ Header state ----------------------------- */
  const header = $(".site-header");
  const progress = $(".scroll-progress");
  const toTop = $(".to-top");

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (toTop) toTop.classList.toggle("show", y > window.innerHeight * 0.8);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && max > 0) progress.style.width = (y / max) * 100 + "%";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------- Mobile nav ------------------------------ */
  const navToggle = $(".nav-toggle");

  function lockScroll() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  function closeNav() {
    if (!document.body.classList.contains("nav-open")) return;
    document.body.classList.remove("nav-open");
    unlockScroll();
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
      if (open) lockScroll();
      else unlockScroll();
    });
  }

  navLinks.forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!document.body.classList.contains("nav-open")) return;
      if (e.target.closest(".main-nav")) return;
      e.preventDefault();
    },
    { passive: false }
  );

  /* --------------------------- Active panel tracking ----------------------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        entry.target.classList.add("in-view");

        navLinks.forEach((a) => {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
        dots.forEach((d) => {
          d.classList.toggle("is-active", d.getAttribute("href") === "#" + id);
        });

        const counter = $(".current-index");
        if (counter) {
          const idx = panels.indexOf(entry.target);
          counter.textContent = String(idx + 1).padStart(2, "0");
        }

        if (entry.target.dataset.animateCount === "true") {
          animateCounters(entry.target);
          entry.target.dataset.animateCount = "false";
        }
      });
    },
    { threshold: 0.35 }
  );

  panels.forEach((p) => io.observe(p));

  /* -------------------------------- Counters ------------------------------- */
  function animateCounters(scope) {
    $$("[data-count]", scope).forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const dur = 1400;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals);
      }
      requestAnimationFrame(tick);
    });
  }

  /* --------------------------------- Modal --------------------------------- */
  const modal = $("#detail-modal");
  const modalMedia = $("#modal-media");
  const modalTag = $("#modal-tag");
  const modalTitle = $("#modal-title");
  const modalDesc = $("#modal-desc");
  const modalTags = $("#modal-tags");
  let lastFocus = null;

  function openModal(data) {
    if (!modal) return;
    lastFocus = document.activeElement;

    if (data.video) {
      modalMedia.classList.remove("empty");
      modalMedia.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' +
        data.video +
        '?autoplay=1&rel=0&modestbranding=1" title="' +
        escapeHtml(data.title) +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    } else if (data.image) {
      modalMedia.classList.remove("empty");
      modalMedia.innerHTML =
        '<img src="' + data.image + '" alt="' + escapeHtml(data.title) + '">';
    } else {
      modalMedia.innerHTML = "";
      modalMedia.classList.add("empty");
    }

    if (modalTag) modalTag.textContent = data.tag || "Việt Nam";
    if (modalTitle) modalTitle.textContent = data.title || "";
    if (modalDesc) modalDesc.textContent = data.desc || "";
    if (modalTags) {
      modalTags.innerHTML =
        (data.tags || [])
          .map((t) => "<span>" + escapeHtml(t) + "</span>")
          .join("") +
        (data.video
          ? '<a class="modal-link" href="https://www.youtube.com/watch?v=' +
            encodeURIComponent(data.video) +
            '" target="_blank" rel="noopener">Mở trên YouTube ↗</a>'
          : "");
    }

    modal.classList.add("open");
    document.documentElement.style.overflow = "hidden";
    const closeBtn = $(".modal-close", modal);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.documentElement.style.overflow = "";
    setTimeout(() => {
      if (modalMedia) modalMedia.innerHTML = "";
    }, 300);
    if (lastFocus) lastFocus.focus();
  }

  $$("[data-detail]").forEach((el) => {
    el.addEventListener("click", () => {
      let payload;
      try {
        payload = JSON.parse(el.dataset.detail);
      } catch (e) {
        payload = {
          title: el.dataset.title || "",
          image: el.dataset.image || "",
          video: el.dataset.video || "",
          desc: el.dataset.desc || "",
          tag: el.dataset.tag || "",
          tags: (el.dataset.tags || "").split(",").filter(Boolean),
        };
      }
      openModal(payload);
    });
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    const closeBtn = $(".modal-close", modal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) closeModal();
  });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  /* -------------------------------- To top --------------------------------- */
  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------- Keyboard navigation ------------------------ */
  document.addEventListener("keydown", (e) => {
    if (modal && modal.classList.contains("open")) return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "PageDown" && e.key !== "PageUp") return;
    if (window.innerWidth < 981) return;

    e.preventDefault();
    const current = panels.findIndex((p) => {
      const r = p.getBoundingClientRect();
      return r.top <= 4 && r.bottom > window.innerHeight * 0.5;
    });
    const dir = e.key === "ArrowDown" || e.key === "PageDown" ? 1 : -1;
    const next = Math.max(0, Math.min(panels.length - 1, (current < 0 ? 0 : current) + dir));
    panels[next].scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* --------------------------------- Form ---------------------------------- */
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = $("#form-status");
      const name = $("#name");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (status) status.textContent = "Cảm ơn " + (name ? name.value.trim() : "bạn") + "! Yêu cầu đã được ghi nhận (bản demo).";
      form.reset();
    });
  }

  /* -------------------------- Image error fallback ------------------------- */
  $$("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
      const box = img.closest(".card-media, .strip-card, .gallery-item, .modal-media, .hero-fallback");
      if (box) box.classList.add("img-missing");
    });
    if (img.complete && img.naturalWidth === 0) {
      img.style.display = "none";
      const box = img.closest(".card-media, .strip-card, .gallery-item, .modal-media, .hero-fallback");
      if (box) box.classList.add("img-missing");
    }
  });

  /* --------------------------------- Year ---------------------------------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* --------------------------- Hero video lazy load ------------------------ */
  const heroIframe = $("#hero-video");
  if (heroIframe) {
    const src = heroIframe.dataset.src;
    const load = () => {
      if (src) heroIframe.src = src;
    };
    if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 2500 });
    else setTimeout(load, 1200);
  }
})();
