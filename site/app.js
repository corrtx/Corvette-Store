const topbar = document.getElementById("topbar");
const revealBlocks = document.querySelectorAll(".reveal-on-scroll");
const catalogSections = document.querySelectorAll("[data-catalog-section]");
const modal = document.getElementById("product-modal");
const modalImage = document.getElementById("modal-image");
const modalBrand = document.getElementById("modal-brand");
const modalTitle = document.getElementById("product-modal-title");
const modalDescription = document.getElementById("modal-description");
const modalSpecs = document.getElementById("modal-specs");
const modalMeasurements = document.getElementById("modal-measurements");
const modalConditionNotes = document.getElementById("modal-condition-notes");
const modalAuthenticity = document.getElementById("modal-authenticity");
const modalThumbs = document.getElementById("modal-thumbs");
const modalCta = document.getElementById("modal-cta");

const telegramUrl = "https://t.me/+LMHLw-S4AzA1Y2Ji";

const products = {
  "cp-company-nylon-jacket": {
    brand: "C.P COMPANY",
    title: "C.P COMPANY NYLON JACKET",
    image: "/cp-company-nylon-jacket.png?v=3",
    gallery: [
      "/cp-company-nylon-jacket.png?v=3",
      "/cp-jacket-back.png?v=1",
    ],
    description:
      "Архівна нейлонова куртка з фірмовою лінзою на рукаві, чистою формою й технічною подачею.",
    specs: [
      ["Розмір", "M"],
      ["Стан", "10/10"],
      ["Ціна", "7990 грн"],
      ["Наявність", "В наявності"],
    ],
    measurements: "Плечі 47 см / груди 56 см / довжина 67 см / рукав 65 см.",
    conditionNotes:
      "Тканина в чистому стані, фурнітура без втрат, помітних слідів носіння немає. Сильний архівний екземпляр.",
    authenticity:
      "Перевірено за брендингом, лінзою, фурнітурою та загальною відповідністю моделі.",
  },
  "guess-places-faces-tee": {
    brand: "GUESS X PLACES+FACES",
    title: "GUESS X PLACES+FACES REFLECTIVE T-SHIRT",
    image: "/guess-jeans-striped-tee.png?v=3",
    gallery: [
      "/guess-jeans-striped-tee.png?v=3",
      "/guess-tee-back.png?v=1",
      "/guess-tee-label.png?v=1",
    ],
    description:
      "Архівна reflective футболка з чітким ритмом смуги, чистим фронтальним графічним акцентом і рідкісною колаборацією.",
    specs: [
      ["Розмір", "M"],
      ["Стан", "10/10"],
      ["Ціна", "3190 грн"],
      ["Наявність", "В наявності"],
    ],
    measurements: "Плечі 46 см / груди 54 см / довжина 70 см / рукав 22 см.",
    conditionNotes:
      "Принт чистий, форма рівна, слідів вицвітання або розтягнення не видно.",
    authenticity:
      "Перевірено за бірками, логотипом, reflective print і деталями спільного релізу.",
  },
  "gucci-distressed-cat-hoodie": {
    brand: "GUCCI",
    title: "GUCCI DISTRESSED CAT HOODIE",
    image: "/gucci-hoodie-front.png?v=1",
    gallery: [
      "/gucci-hoodie-front.png?v=1",
      "/gucci-hoodie-back.png?v=1",
      "/gucci-hoodie-embroidery.jpg?v=1",
      "/gucci-hoodie-label.jpg?v=1",
    ],
    description:
      "Архівне худі Gucci з великою cat-графікою спереду, контрастним написом на спині й насиченою distressed-подачею.",
    specs: [
      ["Розмір", "L"],
      ["Стан", "9/10"],
      ["Ціна", "8990 грн"],
      ["Наявність", "В наявності"],
    ],
    measurements: "Плечі 50 см / груди 61 см / довжина 70 см / рукав 67 см.",
    conditionNotes:
      "Худі в дуже хорошому стані. Є легке природне носіння по тканині, без критичних дефектів або втрати графіки.",
    authenticity:
      "Перевірено за біркою, якістю вишивки, внутрішніми деталями та загальним виконанням моделі Gucci.",
  },
};

function updateTopbarState() {
  if (!topbar) {
    return;
  }

  if (window.scrollY > 140) {
    topbar.classList.add("is-car");
  } else {
    topbar.classList.remove("is-car");
  }
}

function revealPage() {
  document.body.classList.add("page-enter");

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    });
  });
}

function setupScrollReveal() {
  const shouldDisableReveal =
    !("IntersectionObserver" in window) ||
    window.matchMedia("(max-width: 820px)").matches ||
    window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (shouldDisableReveal) {
    revealBlocks.forEach((block) => block.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealBlocks.forEach((block) => observer.observe(block));
}

function setupCatalogStates() {
  catalogSections.forEach((section) => {
    const grid = section.querySelector("[data-catalog-grid]");
    const emptyState = section.querySelector("[data-empty-state]");
    const hasItems = grid && grid.querySelectorAll(".product-card").length > 0;

    section.classList.add("is-loading");

    window.setTimeout(() => {
      section.classList.remove("is-loading");

      if (emptyState) {
        emptyState.hidden = hasItems;
      }
    }, 520);
  });
}

function buildModalSpecs(specs) {
  if (!modalSpecs) {
    return;
  }

  modalSpecs.replaceChildren();

  specs.forEach(([label, value]) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");

    term.textContent = label;
    description.textContent = value;

    row.append(term, description);
    modalSpecs.append(row);
  });
}

function buildModalThumbs(product) {
  if (!modalThumbs) {
    return;
  }

  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image];

  modalThumbs.replaceChildren();

  gallery.forEach((image, index) => {
    const button = document.createElement("button");
    const preview = document.createElement("img");

    button.type = "button";
    button.className = `product-thumb${index === 0 ? " is-active" : ""}`;
    button.dataset.modalImage = image;

    preview.src = image;
    preview.alt = `${product.title} view ${index + 1}`;
    preview.loading = "lazy";
    preview.decoding = "async";

    button.append(preview);
    modalThumbs.append(button);
  });

  modalThumbs.querySelectorAll("[data-modal-image]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!modalImage) {
        return;
      }

      modalImage.src = button.dataset.modalImage;
      modalThumbs.querySelectorAll(".product-thumb").forEach((thumb) => thumb.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });
}

function openProductModal(productKey) {
  const product = products[productKey];

  if (
    !product ||
    !modal ||
    !modalImage ||
    !modalBrand ||
    !modalTitle ||
    !modalDescription ||
    !modalMeasurements ||
    !modalConditionNotes ||
    !modalAuthenticity ||
    !modalCta
  ) {
    return;
  }

  modalImage.src = product.image;
  modalImage.alt = product.title;
  modalBrand.textContent = product.brand;
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalMeasurements.textContent = product.measurements;
  modalConditionNotes.textContent = product.conditionNotes;
  modalAuthenticity.textContent = product.authenticity;
  modalCta.href = telegramUrl;

  buildModalSpecs(product.specs);
  buildModalThumbs(product);

  modal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeProductModal() {
  if (!modal) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function setupProductModal() {
  document.querySelectorAll("[data-open-product]").forEach((button) => {
    button.addEventListener("click", () => {
      openProductModal(button.dataset.openProduct);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeProductModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProductModal();
    }
  });
}

function setupTelegramLinks() {
  document.querySelectorAll(".product-request").forEach((link) => {
    link.href = telegramUrl;
  });
}

revealPage();
updateTopbarState();
setupScrollReveal();
setupCatalogStates();
setupProductModal();
setupTelegramLinks();

window.addEventListener("scroll", updateTopbarState, { passive: true });
