/* =========================================================================
   Prishth — shared student navigation
   Loaded on every public page. Does three things:
     1. Detects whether a student is logged in (Supabase session)
     2. Swaps "Log In / Sign Up Free" for a "Log out" button
     3. Adds a left slide-out drawer (hamburger) with the student's areas
   Adding a new drawer item later = one line in DRAWER_ITEMS below.
   ========================================================================= */
(function () {
  "use strict";

  var SB_URL = "https://aqrxmcmmdazyslznilbl.supabase.co";
  var SB_KEY = "sb_publishable_wRKj-veZ1_Ro-HSH8kXCFg_ifvjUD8L";

  /* ---- drawer contents. Add new rows here as the site grows. ---------- */
  var DRAWER_ITEMS = [
    { icon: "&#128221;", label: "Free Tests",       href: "/dashboard?view=free",      note: "Full mocks, no payment" },
    { icon: "&#128196;", label: "PYQs",             href: "/pyqs",                     note: "Previous year papers" },
    { icon: "&#128274;", label: "My Purchases",     href: "/dashboard?view=purchased", note: "Paid tests and material" }
  ];

  /* ---- styles ---------------------------------------------------------- */
  var CSS = [
    ".psn-burger{display:inline-flex;align-items:center;justify-content:center;",
    "width:40px;height:38px;border:1px solid #DDE6F0;background:#fff;border-radius:9px;",
    "cursor:pointer;padding:0;flex-shrink:0;margin-right:2px}",
    ".psn-burger:hover{border-color:#2E6DA4}",
    ".psn-burger span{display:block;width:17px;height:2px;background:#1B3A5C;border-radius:2px;position:relative}",
    ".psn-burger span::before,.psn-burger span::after{content:'';position:absolute;left:0;",
    "width:17px;height:2px;background:#1B3A5C;border-radius:2px}",
    ".psn-burger span::before{top:-6px}.psn-burger span::after{top:6px}",

    ".psn-scrim{position:fixed;inset:0;background:rgba(22,40,60,.45);z-index:998;",
    "opacity:0;pointer-events:none;transition:opacity .2s}",
    ".psn-scrim.open{opacity:1;pointer-events:auto}",

    ".psn-drawer{position:fixed;top:0;left:0;bottom:0;width:290px;max-width:84vw;",
    "background:#fff;z-index:999;box-shadow:4px 0 26px rgba(27,58,92,.18);",
    "transform:translateX(-100%);transition:transform .24s ease;display:flex;flex-direction:column;",
    "font-family:'DM Sans',system-ui,sans-serif}",
    ".psn-drawer.open{transform:translateX(0)}",

    ".psn-dhead{background:linear-gradient(150deg,#1B3A5C,#2E6DA4);color:#fff;padding:20px 20px 18px;flex-shrink:0}",
    ".psn-dhead .psn-t{font-family:'Sora',sans-serif;font-weight:700;font-size:17px;margin-bottom:3px}",
    ".psn-dhead .psn-e{font-size:12.5px;color:#CFE0F0;word-break:break-all;line-height:1.45}",
    ".psn-close{position:absolute;top:14px;right:14px;background:rgba(255,255,255,.16);",
    "border:0;color:#fff;width:30px;height:30px;border-radius:8px;font-size:17px;cursor:pointer;line-height:1}",

    ".psn-dbody{padding:14px;overflow-y:auto;flex:1}",
    ".psn-lab{font-family:'Sora',sans-serif;font-size:10.5px;font-weight:700;letter-spacing:.09em;",
    "text-transform:uppercase;color:#5C6F84;margin:4px 0 9px 4px}",
    ".psn-item{display:flex;gap:12px;align-items:flex-start;padding:12px 13px;border-radius:10px;",
    "text-decoration:none;color:#16283C;border:1px solid transparent;margin-bottom:5px}",
    ".psn-item:hover{background:#F4F7FB;border-color:#DDE6F0}",
    ".psn-item .psn-i{font-size:17px;line-height:1.3;flex-shrink:0}",
    ".psn-item b{display:block;font-family:'Sora',sans-serif;font-size:14.5px;font-weight:600;color:#1B3A5C}",
    ".psn-item small{display:block;font-size:12.5px;color:#5C6F84;margin-top:1px}",

    ".psn-dfoot{border-top:1px solid #DDE6F0;padding:14px;flex-shrink:0}",
    ".psn-out{display:block;width:100%;background:#fff;border:1.5px solid #DDE6F0;color:#1B3A5C;",
    "padding:11px;border-radius:9px;font-family:'Sora',sans-serif;font-weight:600;font-size:14px;cursor:pointer}",
    ".psn-out:hover{border-color:#C0392B;color:#C0392B}",

    ".psn-logout-top{background:#fff;border:1.5px solid #DDE6F0;color:#1B3A5C;cursor:pointer;",
    "font-family:'Sora',sans-serif;font-weight:600;font-size:14px;padding:9px 17px;border-radius:9px}",
    ".psn-logout-top:hover{border-color:#C0392B;color:#C0392B}",
    ".psn-hi{font-size:13px;color:#5C6F84;margin-right:2px;white-space:nowrap;",
    "max-width:190px;overflow:hidden;text-overflow:ellipsis}",
    "@media(max-width:820px){.psn-hi{display:none}}"
  ].join("");

  function injectCss() {
    if (document.getElementById("psn-css")) return;
    var s = document.createElement("style");
    s.id = "psn-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---- build the drawer ------------------------------------------------ */
  function buildDrawer(email) {
    if (document.getElementById("psnDrawer")) return;

    var scrim = document.createElement("div");
    scrim.className = "psn-scrim";
    scrim.id = "psnScrim";

    var items = DRAWER_ITEMS.map(function (it) {
      return '<a class="psn-item" href="' + it.href + '">' +
             '<span class="psn-i">' + it.icon + '</span>' +
             '<span><b>' + it.label + '</b><small>' + it.note + '</small></span></a>';
    }).join("");

    var d = document.createElement("aside");
    d.className = "psn-drawer";
    d.id = "psnDrawer";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML =
      '<div class="psn-dhead" style="position:relative">' +
        '<button class="psn-close" id="psnClose" aria-label="Close menu">&#10005;</button>' +
        '<div class="psn-t">My Prishth</div>' +
        '<div class="psn-e">' + (email || "") + '</div>' +
      '</div>' +
      '<div class="psn-dbody">' +
        '<div class="psn-lab">Study</div>' + items +
      '</div>' +
      '<div class="psn-dfoot">' +
        '<button class="psn-out" id="psnOut">Log out</button>' +
      '</div>';

    document.body.appendChild(scrim);
    document.body.appendChild(d);

    scrim.addEventListener("click", closeDrawer);
    document.getElementById("psnClose").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });
  }

  function openDrawer() {
    var d = document.getElementById("psnDrawer");
    var s = document.getElementById("psnScrim");
    if (!d) return;
    d.classList.add("open");
    d.setAttribute("aria-hidden", "false");
    if (s) s.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    var d = document.getElementById("psnDrawer");
    var s = document.getElementById("psnScrim");
    if (!d) return;
    d.classList.remove("open");
    d.setAttribute("aria-hidden", "true");
    if (s) s.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---- find this page's auth area, whichever header style it uses ------ */
  function findAuthArea() {
    return document.querySelector(".auth") || document.querySelector(".nav-cta");
  }

  function isLoginLink(a) {
    var h = (a.getAttribute("href") || "").toLowerCase();
    return /(^|\/)login(\.html)?$/.test(h.split("?")[0].replace(/\/+$/, "")) ||
           h.indexOf("/login") > -1;
  }

  function isSignupLink(a) {
    var h = (a.getAttribute("href") || "").toLowerCase();
    return h.indexOf("signup") > -1;
  }

  /* ---- logged-in header: burger + greeting + log out ------------------- */
  function renderLoggedIn(area, email, signOut) {
    var links = Array.prototype.slice.call(area.querySelectorAll("a"));
    links.forEach(function (a) {
      if (isLoginLink(a) || isSignupLink(a)) a.remove();
    });

    var burger = document.createElement("button");
    burger.className = "psn-burger";
    burger.id = "psnBurger";
    burger.setAttribute("aria-label", "Open my menu");
    burger.innerHTML = "<span></span>";
    burger.addEventListener("click", openDrawer);

    var hi = document.createElement("span");
    hi.className = "psn-hi";
    hi.textContent = email || "";

    var out = document.createElement("button");
    out.className = "psn-logout-top";
    out.textContent = "Log out";
    out.addEventListener("click", signOut);

    area.insertBefore(burger, area.firstChild);
    area.appendChild(hi);
    area.appendChild(out);

    var dOut = document.getElementById("psnOut");
    if (dOut) dOut.addEventListener("click", signOut);
  }

  /* ---- boot ------------------------------------------------------------ */
  function boot() {
    var area = findAuthArea();
    if (!area) return;                       // page has no header to modify

    injectCss();

    if (!window.supabase || !window.supabase.createClient) return;

    var sb;
    try {
      sb = window.supabase.createClient(SB_URL, SB_KEY);
    } catch (e) {
      return;                                // never break the page
    }

    sb.auth.getSession().then(function (res) {
      var session = res && res.data ? res.data.session : null;
      if (!session) return;                  // logged out: header stays as-is

      var email = session.user && session.user.email ? session.user.email : "";

      function signOut() {
        sb.auth.signOut().then(function () {
          window.location.href = "/";
        });
      }

      buildDrawer(email);
      renderLoggedIn(area, email, signOut);
    }).catch(function () { /* stay logged-out looking */ });
  }

  /* Supabase loads with defer/async, so wait for window load as well. */
  function start() {
    if (window.supabase) { boot(); return; }
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (window.supabase) { clearInterval(t); boot(); }
      else if (tries > 40) { clearInterval(t); }   // ~6s then give up quietly
    }, 150);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
