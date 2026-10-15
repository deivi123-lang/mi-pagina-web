
// CHURRASQUERÍA PIO
// Cambia el número, la dirección, el horario y los precios por los datos reales.
const CONFIG = {
  whatsapp: "59163893075", // Código de Bolivia + número, sin espacios ni el signo +
  direccion: "Añade aquí tu dirección real",
  horario: "Lunes a domingo: añade tu horario",
  mapsUrl: "https://maps.google.com"
};

const products = [
  {id:1,name:"Churrasco clásico",category:"churrasco",price:35,image:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85",tag:"Favorito",description:"Carne a la parrilla con arroz, papa y ensalada."},
  {id:2,name:"Churrasco especial",category:"especial",price:45,image:"https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=85",tag:"Especial",description:"Una porción especial de carne con sus acompañamientos."},
  {id:3,name:"Churrasco PIO",category:"especial",price:55,image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=85",tag:"De la casa",description:"La recomendación de la casa para disfrutar a lo grande."},
  {id:4,name:"Bife a la parrilla",category:"churrasco",price:40,image:"https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=85",tag:"A la parrilla",description:"Carne a la parrilla con guarnición y ensalada fresca."},
  {id:5,name:"Porción de papas fritas",category:"acompanamiento",price:12,image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85",tag:"Acompañamiento",description:"Papas doraditas para compartir o acompañar tu plato."},
  {id:6,name:"Ensalada fresca",category:"acompanamiento",price:10,image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=85",tag:"Fresco",description:"Una combinación fresca para acompañar tu churrasco."},
  {id:7,name:"Gaseosa personal",category:"bebida",price:7,image:"https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=85",tag:"Bebida",description:"Bebida personal bien fría."},
  {id:8,name:"Gaseosa 2 litros",category:"bebida",price:18,image:"https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=800&q=85",tag:"Para compartir",description:"Una botella grande para acompañar la comida."},
  {id:9,name:"Chorizo a la parrilla",category:"acompanamiento",price:15,image:"https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=85",tag:"A la parrilla",description:"Chorizo asado, ideal para completar tu pedido."}
];

const cart = new Map();
const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const toast = document.getElementById("toast");
let toastTimer;

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("addressText").textContent = CONFIG.direccion;
document.getElementById("hoursText").textContent = CONFIG.horario;
document.getElementById("mapsLink").href = CONFIG.mapsUrl;

function money(amount) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 0
  }).format(amount).replace("BOB", "Bs");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function renderProducts(category = "todos") {
  const visible = category === "todos"
    ? products
    : products.filter(p => p.category === category);

  productGrid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="product-tag">${p.tag}</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add-btn" data-add="${p.id}" type="button">+ Agregar</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const current = cart.get(id);
  cart.set(id, {
    product,
    quantity: current ? current.quantity + 1 : 1
  });

  renderCart();
  showToast(`${product.name} agregado al pedido`);
}

function changeQuantity(id, delta) {
  const item = cart.get(id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart.delete(id);
  }

  renderCart();
}

function renderCart() {
  const items = [...cart.values()];
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("clearCartBtn").disabled = items.length === 0;

  const container = document.getElementById("cartItems");

  if (!items.length) {
    container.innerHTML =
      '<p class="empty-cart">Tu carrito está vacío. ¡Elige algo rico!</p>';
    return;
  }

  container.innerHTML = items.map(({product, quantity}) => `
    <div class="cart-item">
      <div>
        <h4>${product.name}</h4>
        <span class="item-price">${money(product.price * quantity)}</span>
        <div class="quantity-controls">
          <button type="button" data-minus="${product.id}" aria-label="Quitar una unidad">−</button>
          <strong>${quantity}</strong>
          <button type="button" data-plus="${product.id}" aria-label="Agregar una unidad">+</button>
        </div>
      </div>
      <button type="button" class="remove-item" data-remove="${product.id}">Quitar</button>
    </div>
  `).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function validWhatsAppNumber() {
  return /^\d{8,15}$/.test(CONFIG.whatsapp) &&
    !CONFIG.whatsapp.includes("X");
}

function sendWhatsApp(message) {
  if (!validWhatsAppNumber()) {
    showToast("Configura tu número real de WhatsApp en script.js antes de enviar.");
    return;
  }

  window.open(
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

// Agregar productos al carrito
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

// Filtrar categorías del menú
document.getElementById("categoryFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  document.querySelectorAll(".filter").forEach(b => {
    b.classList.toggle("active", b === button);
  });

  renderProducts(button.dataset.category);
});

// Aumentar, disminuir o quitar un producto del carrito
document.getElementById("cartItems").addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");

  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);

  if (remove) {
    cart.delete(Number(remove.dataset.remove));
    renderCart();
    showToast("Producto quitado del carrito");
  }
});

// Vaciar todo el carrito
document.getElementById("clearCartBtn").addEventListener("click", () => {
  if (cart.size === 0) {
    showToast("El carrito ya está vacío.");
    return;
  }

  cart.clear();
  renderCart();
  document.getElementById("orderNotes").value = "";
  showToast("Carrito vaciado correctamente.");
});

// Abrir y cerrar el carrito
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

// Enviar el pedido por WhatsApp
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const items = [...cart.values()];

  if (!items.length) {
    showToast("Agrega al menos un plato a tu pedido.");
    return;
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );

  const lines = items.map(({product, quantity}) =>
    `• ${product.name} x${quantity} — ${money(product.price * quantity)}`
  );

  const notes = document.getElementById("orderNotes").value.trim();

  const message =
    `¡Hola, Churrasquería PIO! Quiero realizar este pedido:\n\n` +
    `${lines.join("\n")}\n\n` +
    `*Total estimado: ${money(total)}*` +
    `${notes ? `\n\nNotas: ${notes}` : ""}\n\n` +
    `Por favor, confirmen disponibilidad y total final.`;

  sendWhatsApp(message);
});

// Formulario de consultas por WhatsApp
document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("contactName").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !message) return;

  sendWhatsApp(`¡Hola, Churrasquería PIO! Soy ${name}.\n\n${message}`);
});

// Menú adaptable para celular
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Cargar menú y carrito al abrir la página
renderProducts();
renderCart();
