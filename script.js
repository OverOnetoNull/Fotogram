/**
 * Einfache, barrierearme Bildgalerie mit Lightbox (Dialog).
 * - Verzichtet vollständig auf appendChild / DocumentFragment.
 * - Baut die Galerie in einem Rutsch per innerHTML.
 * - Unterstützt Tastatursteuerung (← → ESC) und Dialog-Schließen per Hintergrundklick.
 * - Nutzt Event-Delegation für Kacheln.
 */

/* =========================
   Konfiguration
   ========================= */

/** Basisordner für die Bilder (ohne führenden / am Ende ok) */
const BASE_PATH = "img/pictures";
/** Dateiendung der Bilder: "jpg" | "png" | "webp" */
const EXT = "jpg";

/** Bild-Dateinamen ohne Endung */
const images = [
  "ai-generated-8756365_1280",
  "boat-4868355_640",
  "boat-7497807_640",
  "boat-7497809_640",
  "coast-6917777_640",
  "dominicana-4620393_640",
  "sea-4994010_640",
  "sun-4475490_640",
  "sun-5039871_640",
  // "sun-5223711_1280",
  "sunset-5429861_640",
  "water-4873775_1280"
];

/* =========================
   DOM-Referenzen
   ========================= */

const gallery  = document.getElementById("gallery");
const dialog   = document.getElementById("lightbox");
const imgEl    = document.getElementById("lightboxImg");
const prevBtn  = document.getElementById("prevBtn");
const nextBtn  = document.getElementById("nextBtn");
const closeBtn = document.getElementById("closeBtn");

/** Index des aktuell im Lightbox-Dialog gezeigten Bildes */
let current = 0;

/* =========================
   Galerie erzeugen (ohne appendChild)
   ========================= */

/**
 * Baut die Galerie-Kacheln in einem Rutsch.
 * Verwendet Buttons (statt a/div), um Fokus & Tastaturbedienung zu verbessern.
 * Jeder Button trägt data-index, um das Bild wiederzufinden.
 */
function createGallery() {
  gallery.innerHTML = images
    .map((name, i) => {
      const src = `${BASE_PATH}/${name}.${EXT}`;
      // type="button", damit innerhalb eines <form> nichts versehentlich submitted
      return `
        <button class="tile" type="button" data-index="${i}" aria-label="Bild ${i + 1} öffnen">
          <img src="${src}" alt="Bild ${i + 1}" loading="lazy">
        </button>
      `;
    })
    .join("");
}

/* =========================
   Bildanzeige / Navigation
   ========================= */

/**
 * Zeigt das Bild an einem gegebenen Index in der Lightbox.
 * @param {number} index - Gewünschter Index; wird zirkulär normalisiert.
 */
function showAt(index) {
  current = (index + images.length) % images.length;
  const name = images[current];
  imgEl.src = `${BASE_PATH}/${name}.${EXT}`;
  imgEl.alt = `Bild ${current + 1} von ${images.length}`;
}

/* =========================
   Init
   ========================= */

createGallery();

/* =========================
   Events
   ========================= */

// Delegation: Klick in der Galerie öffnet Lightbox für die angeklickte Kachel
gallery.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (!tile) return;
  const index = Number(tile.dataset.index);
  showAt(index);
  dialog.showModal();
});

// Pfeilnavigation
prevBtn.addEventListener("click", () => showAt(current - 1));
nextBtn.addEventListener("click", () => showAt(current + 1));

// Schließen über X
closeBtn.addEventListener("click", () => dialog.close());

// Klick außerhalb des Bildes/der Controls schließt den Dialog
dialog.addEventListener("click", (e) => {
  const rect = imgEl.getBoundingClientRect();
  const clickedInsideImage =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top  && e.clientY <= rect.bottom;

  const clickedOnControls =
    !!e.target.closest(".nav") || !!e.target.closest(".close");

  if (!clickedInsideImage && !clickedOnControls) {
    dialog.close();
  }
});

// Tastatursteuerung: ← → ESC (wenn Dialog offen)
dialog.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight")      showAt(current + 1);
  else if (e.key === "ArrowLeft")  showAt(current - 1);
  else if (e.key === "Escape")     dialog.close();
});
