const typedEl = document.getElementById("typed");
const words = ["Kennan"];
let w = 0, c = 0, deleting = false;
 
function type() {
  const word = words[w];
  typedEl.textContent = word.slice(0, deleting ? --c : ++c);
  let delay = deleting ? 50 : 100;
  if (!deleting && c === word.length) { deleting = true; delay = 1500; }
  else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
  setTimeout(type, delay);
}
if (typedEl) type();
 

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
 
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
 
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);
 

const sections = document.querySelectorAll("main section[id]");
const links = navLinks.querySelectorAll("a");
 
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => spy.observe(s));
 

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
 

const MY_EMAIL = "elarmokennan713@gmail.com"; 
 
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
 
form.addEventListener("submit", (e) => {
  e.preventDefault();
 
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 
  form.querySelectorAll("input, textarea").forEach((f) => f.classList.remove("invalid"));
  statusEl.className = "form-status";
 
  if (!name || !emailOk || !message) {
    if (!name) form.elements.name.classList.add("invalid");
    if (!emailOk) form.elements.email.classList.add("invalid");
    if (!message) form.elements.message.classList.add("invalid");
    statusEl.textContent = "Please enter your name, a valid email and a message.";
    statusEl.classList.add("error");
    return;
  }
 
  const subject = encodeURIComponent("Message from " + name);
  const body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");
  window.location.href = "mailto:" + MY_EMAIL + "?subject=" + subject + "&body=" + body;
 
  statusEl.textContent = "Opening your email app to send the message.";
  statusEl.classList.add("ok");
  form.reset();
});
 

document.getElementById("year").textContent = new Date().getFullYear();
 

(function () {
  const frame  = document.getElementById("glitchPhoto");
  const canvas = document.getElementById("glitchCanvas");
  if (!frame || !canvas) return;
  const ctx = canvas.getContext("2d");
 
  
  const PHOTO_A = "kasueeeeee.jpg";   
  const A_STYLE = "none";
  const PHOTO_B = "kinnan.jpg";       
  const B_STYLE = "none";
  const DURATION = 900;               
  const W = 480, H = 704;             
  const COLS = 12, ROWS = 17;         
  canvas.width = W;
  canvas.height = H;
 
  const load = (src) => new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });
 
  function makeLayer(img, filter) {
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    g.filter = filter;
    g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    return c;
  }
 
  const pa = document.createElement("canvas");
  const pb = document.createElement("canvas");
  pa.width = pb.width = W;
  pa.height = pb.height = H;
  const small = document.createElement("canvas");
 
  function pixelate(src, px, out) {
    const sw = Math.max(1, Math.round(W / px));
    const sh = Math.max(1, Math.round(H / px));
    small.width = sw; small.height = sh;
    small.getContext("2d").drawImage(src, 0, 0, sw, sh);
    const g = out.getContext("2d");
    g.imageSmoothingEnabled = false;
    g.clearRect(0, 0, W, H);
    g.drawImage(small, 0, 0, sw, sh, 0, 0, W, H);
  }
 
  Promise.all([load(PHOTO_A), load(PHOTO_B)]).then(([imgA, imgB]) => {
    const A = makeLayer(imgA, A_STYLE);
    const B = makeLayer(imgB, B_STYLE);
    const order = Array.from({ length: COLS * ROWS }, Math.random);
    const bw = W / COLS, bh = H / ROWS;
 
    ctx.drawImage(A, 0, 0);
    frame.classList.add("ready");
 
    function animate(from, to, done) {
      const start = performance.now();
      (function step(now) {
        const t = Math.min(1, (now - start) / DURATION);
        if (t >= 1) { ctx.drawImage(to, 0, 0); return done(); }
 
        const px = 1 + Math.sin(t * Math.PI) * 46;   
        pixelate(from, px, pa);
        pixelate(to, px, pb);
 
        for (let i = 0; i < order.length; i++) {
          const src = order[i] < t ? pb : pa;
          const x = (i % COLS) * bw, y = Math.floor(i / COLS) * bh;
          ctx.drawImage(src, x, y, bw, bh, x, y, bw, bh);
        }
 
      
        if (t > 0.15 && t < 0.85) {
          for (let k = 0; k < 4; k++) {
            const y = Math.random() * H, h = 10 + Math.random() * 30;
            const dx = (Math.random() - 0.5) * 40;
            ctx.drawImage(canvas, 0, y, W, h, dx, y, W, h);
          }
        }
        requestAnimationFrame(step);
      })(performance.now());
    }
 
    let current = "A", wanted = "A", busy = false;
    function sync() {
      if (busy || current === wanted) return;
      busy = true;
      const target = wanted;
      animate(current === "A" ? A : B, target === "A" ? A : B, () => {
        current = target;
        busy = false;
        sync();
      });
    }
 
  
    frame.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { wanted = "B"; sync(); } });
    frame.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { wanted = "A"; sync(); } });
 
    
    frame.addEventListener("click", (e) => {
      if (!e.pointerType || e.pointerType !== "mouse") {
        wanted = wanted === "A" ? "B" : "A";
        sync();
      }
    });
  }).catch(() => {  });
})();