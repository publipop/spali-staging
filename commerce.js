/**
 * Catálogo y compra de demostración de SPALI.
 * Las prendas, precios, medidas y condiciones son ilustrativos: este módulo
 * no envía datos, no reserva existencias y no realiza cobros.
 */

const euroFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

const freeze = (value) => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

const black = { name: 'Negro', hex: '#171818' };
const red = { name: 'Rojo', hex: '#d8322e' };
const cream = { name: 'Crema', hex: '#e7e2d6' };
const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const care = 'Propuesta de cuidado: lavar del revés a 30 °C con colores similares. La etiqueta definitiva dependerá del tejido elegido.';

export const PRODUCTS = freeze([
  {
    id: 'camiseta-equipo-01', name: 'Camiseta Equipo 01', line: 'equipo',
    gender: 'unisex', category: 'camisetas', price: 24.9,
    image: 'assets/camiseta-negra.jpg', colors: [black, red, cream], sizes: allSizes,
    description: 'Una camiseta de líneas limpias para construir la identidad de tu equipo. Diseño conceptual pendiente de selección de tejido y fabricación.',
    details: ['Cuello redondo propuesto', 'Marca SPALI en el pecho', 'Nombre opcional en la espalda'],
    fit: 'Corte recto propuesto, con espacio para moverse.', care,
  },
  {
    id: 'short-equipo-01', name: 'Short Equipo 01', line: 'equipo',
    gender: 'unisex', category: 'shorts', price: 22.9,
    image: 'assets/short-negro.jpg', colors: [black, red], sizes: allSizes,
    description: 'El short de la propuesta Equipo, pensado para combinar con la camiseta de la misma línea. Las características finales se definirán al producirlo.',
    details: ['Cintura elástica propuesta', 'Diseño sencillo sin estampado integral', 'Marca SPALI en una pernera'],
    fit: 'Corte recto propuesto a medio muslo.', care,
  },
  {
    id: 'chaqueta-equipo-01', name: 'Chaqueta Equipo 01', line: 'equipo',
    gender: 'unisex', category: 'chaquetas', price: 64.9,
    image: 'assets/chaqueta-crema.jpg', colors: [cream, black], sizes: allSizes,
    description: 'Una chaqueta para dar continuidad al conjunto de equipo fuera de la pista. Imagen y acabados de muestra, sin prestaciones técnicas verificadas.',
    details: ['Cierre frontal propuesto', 'Dos bolsillos laterales en el concepto', 'Marca discreta en el pecho'],
    fit: 'Corte recto propuesto para llevar sobre una camiseta.', care,
  },
  {
    id: 'sudadera-equipo-01', name: 'Sudadera Equipo 01', line: 'equipo',
    gender: 'unisex', category: 'sudaderas', price: 49.9,
    image: 'assets/sudadera-negra.jpg', colors: [black, cream], sizes: allSizes,
    description: 'Una sudadera sobria para completar la propuesta de equipo. La composición y el gramaje todavía no están definidos.',
    details: ['Cuello redondo propuesto', 'Puños y bajo de canalé en el concepto', 'Nombre opcional en la espalda'],
    fit: 'Corte relajado propuesto.', care,
  },
  {
    id: 'camiseta-pista-01', name: 'Camiseta Pista 01', line: 'padel',
    gender: 'hombre', category: 'camisetas', price: 29.9,
    image: 'assets/camiseta-negra.jpg', colors: [black, red, cream], sizes: allSizes,
    description: 'La camiseta de nuestra propuesta Pareja: una silueta sencilla y la marca como protagonista. Tejido y prestaciones pendientes de desarrollo.',
    details: ['Cuello redondo propuesto', 'Manga corta', 'Marca SPALI en el pecho'],
    fit: 'Corte recto propuesto.', care,
  },
  {
    id: 'short-pista-01', name: 'Short Pista 01', line: 'padel',
    gender: 'hombre', category: 'shorts', price: 27.9,
    image: 'assets/short-negro.jpg', colors: [black, red], sizes: allSizes,
    description: 'Un short para completar el conjunto Pista. Es una referencia conceptual; bolsillos, materiales y medidas se confirmarán en la ficha de producción.',
    details: ['Cintura ajustable propuesta', 'Bolsillos laterales en el concepto', 'Marca en una pernera'],
    fit: 'Corte recto propuesto a medio muslo.', care,
  },
  {
    id: 'top-pista-01', name: 'Top Pista 01', line: 'padel',
    gender: 'mujer', category: 'tops', price: 28.9,
    image: 'assets/top-rojo.jpg', colors: [red, black], sizes: allSizes,
    description: 'Una propuesta de top para el conjunto Pista. El nivel de sujeción y el tejido no se han determinado; la imagen sirve para explorar el diseño.',
    details: ['Tirantes anchos propuestos', 'Espalda de líneas sencillas', 'Marca SPALI en el frontal'],
    fit: 'Corte ajustado propuesto; sujeción pendiente de definir.', care,
  },
  {
    id: 'malla-pista-01', name: 'Malla Pista 01', line: 'padel',
    gender: 'mujer', category: 'mallas', price: 39.9,
    image: 'assets/malla-negra.jpg', colors: [black], sizes: allSizes,
    description: 'Una malla de diseño limpio que combina con el top Pista. No se han verificado propiedades de compresión ni de opacidad.',
    details: ['Cintura alta propuesta', 'Largo al tobillo en el concepto', 'Marca discreta en la pierna'],
    fit: 'Corte ajustado propuesto.', care,
  },
  {
    id: 'camiseta-entreno-01', name: 'Camiseta Entreno 01', line: 'entrenamiento',
    gender: 'unisex', category: 'camisetas', price: 19.9,
    image: 'assets/camiseta-negra.jpg', colors: [black, red, cream], sizes: allSizes,
    description: 'La camiseta esencial de la propuesta Entreno. Una base visual para desarrollar la colección, con tejido y acabados todavía por seleccionar.',
    details: ['Cuello redondo propuesto', 'Manga corta', 'Marca SPALI en el pecho'],
    fit: 'Corte recto propuesto.', care,
  },
  {
    id: 'short-entreno-01', name: 'Short Entreno 01', line: 'entrenamiento',
    gender: 'hombre', category: 'shorts', price: 18.9,
    image: 'assets/short-negro.jpg', colors: [black, red], sizes: allSizes,
    description: 'Un short sin adornos para completar la línea Entreno. El diseño es ilustrativo y todavía no corresponde a una prenda disponible para la venta.',
    details: ['Cintura elástica propuesta', 'Largo a medio muslo', 'Marca en una pernera'],
    fit: 'Corte recto propuesto.', care,
  },
  {
    id: 'top-entreno-01', name: 'Top Entreno 01', line: 'entrenamiento',
    gender: 'mujer', category: 'tops', price: 26.9,
    image: 'assets/top-rojo.jpg', colors: [red, black], sizes: allSizes,
    description: 'El top de la propuesta Entreno, con una presencia gráfica sencilla. Ajuste, sujeción y composición pendientes de validación sobre una muestra real.',
    details: ['Tirantes anchos propuestos', 'Frontal de líneas sencillas', 'Marca SPALI en el pecho'],
    fit: 'Corte ajustado propuesto; sujeción pendiente de definir.', care,
  },
  {
    id: 'malla-entreno-01', name: 'Malla Entreno 01', line: 'entrenamiento',
    gender: 'mujer', category: 'mallas', price: 34.9,
    image: 'assets/malla-negra.jpg', colors: [black, { name: 'Gris', hex: '#777a7c' }], sizes: allSizes,
    description: 'Una malla para acompañar el conjunto Entreno. Imagen conceptual: las medidas y las prestaciones se comprobarán antes de fabricar.',
    details: ['Cintura alta propuesta', 'Largo al tobillo en el concepto', 'Marca discreta en la pierna'],
    fit: 'Corte ajustado propuesto.', care,
  },
]);

/** Medidas corporales de ejemplo, en cm. No son una tabla de fabricante. */
export const SIZE_GUIDE = freeze([
  { size: 'XS', chest: '80–86', waist: '64–70', hips: '86–92' },
  { size: 'S', chest: '87–93', waist: '71–77', hips: '93–99' },
  { size: 'M', chest: '94–100', waist: '78–84', hips: '100–106' },
  { size: 'L', chest: '101–107', waist: '85–91', hips: '107–113' },
  { size: 'XL', chest: '108–114', waist: '92–98', hips: '114–120' },
  { size: 'XXL', chest: '115–121', waist: '99–105', hips: '121–127' },
]);

const productById = new Map(PRODUCTS.map((product) => [product.id, product]));
const SHIPPING_OPTIONS = new Set(['standard', 'express', 'pickup']);
const cents = (amount) => Math.round(amount * 100);
const euros = (amount) => Math.round(amount) / 100;
const text = (value) => typeof value === 'string' ? value.normalize('NFC').replace(/\s+/gu, ' ').trim() : '';
const codeValue = (value) => text(value).toUpperCase();

export function fmtPrice(amount) {
  return euroFormatter.format(typeof amount === 'number' && Number.isFinite(amount) ? amount : 0);
}

function customName(value) {
  const clean = text(value).replace(/[^\p{L}\p{N} ]/gu, '').replace(/ +/g, ' ').trim();
  return Array.from(clean).slice(0, 15).join('').trim();
}

function quantity(value, fallback = 1) {
  if (typeof value !== 'number' && typeof value !== 'string') return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(10, Math.max(1, Math.floor(number))) : fallback;
}

function normalizedLine(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const id = text(input.id);
  const product = productById.get(id);
  if (!product) return null;
  const size = text(input.size).toUpperCase();
  const color = text(input.color);
  if (!product.sizes.includes(size) || !product.colors.some((option) => option.name === color)) return null;
  const name = customName(input.customName);
  return {
    key: JSON.stringify([id, size, color, name]),
    id,
    size,
    color,
    customName: name,
    qty: quantity(input.qty),
  };
}

/** Accepts either a cart array or its localStorage JSON representation. */
export function normalizeCart(input) {
  let lines = input;
  if (typeof lines === 'string') {
    if (lines.length > 100000) return [];
    try { lines = JSON.parse(lines); } catch { return []; }
  }
  if (!Array.isArray(lines)) return [];
  const result = new Map();
  for (const rawLine of lines.slice(0, 200)) {
    const line = normalizedLine(rawLine);
    if (!line) continue;
    const existing = result.get(line.key);
    if (existing) existing.qty = Math.min(10, existing.qty + line.qty);
    else result.set(line.key, line);
  }
  return [...result.values()];
}

export function addItem(cart, item, qty = 1) {
  const current = normalizeCart(cart);
  if (!item || typeof item !== 'object' || Array.isArray(item)) return current;
  const line = normalizedLine({ id: item.id, size: item.size, color: item.color, customName: item.customName, qty });
  return line ? normalizeCart([...current, line]) : current;
}

export function updateQuantity(cart, key, qty) {
  const current = normalizeCart(cart);
  const amount = typeof qty === 'number' || typeof qty === 'string' ? Number(qty) : NaN;
  if (typeof key !== 'string' || !Number.isFinite(amount)) return current;
  if (amount <= 0) return current.filter((line) => line.key !== key);
  return current.map((line) => line.key === key ? { ...line, qty: quantity(amount) } : line);
}

export function removeItem(cart, key) {
  return normalizeCart(cart).filter((line) => line.key !== key);
}

export function cartSummary(cart, options = {}) {
  const settings = options && typeof options === 'object' ? options : {};
  const shippingMethod = SHIPPING_OPTIONS.has(settings.shipping) ? settings.shipping : 'standard';
  const lines = normalizeCart(cart);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = lines.reduce((sum, line) => sum + cents(productById.get(line.id).price) * line.qty, 0);
  const personalization = lines.reduce((sum, line) => sum + (line.customName ? 400 * line.qty : 0), 0);
  const discount = codeValue(settings.code) === 'SPALI10' ? Math.round(subtotal * 0.1) : 0;
  const delivery = !count || shippingMethod === 'pickup' || subtotal - discount >= 7500
    ? 0 : shippingMethod === 'express' ? 790 : 490;
  const total = subtotal + personalization - discount + delivery;
  return {
    count,
    totalCount: count,
    subtotal: euros(subtotal),
    personalization: euros(personalization),
    discount: euros(discount),
    shipping: euros(delivery),
    total: euros(total),
    // IVA orientativo incluido en los importes de esta demostración.
    taxIncluded: euros(Math.round(total - total / 1.21)),
  };
}

function validEmail(email) {
  if (email.length > 254) return false;
  const [local, domain, extra] = email.split('@');
  if (!local || !domain || extra !== undefined || local.length > 64) return false;
  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local) || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  const labels = domain.split('.');
  return labels.length >= 2 && /^[A-Za-z]{2,63}$/.test(labels.at(-1))
    && labels.every((label) => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label));
}

/**
 * Builds an in-memory demo order only. No network, persistence or payment call.
 * Only explicit customer fields are copied; payment credentials are never read.
 */
export function prepareOrder(cart, form = {}) {
  const fields = form && typeof form === 'object' && !Array.isArray(form) ? form : {};
  const items = normalizeCart(cart);
  const shipping = fields.shipping === undefined ? 'standard' : fields.shipping;
  const name = text(fields.name);
  const email = text(fields.email).toLowerCase();
  const phone = text(fields.phone);
  const postalCode = text(fields.postalCode);
  const address = text(fields.address);
  const city = text(fields.city);
  const code = codeValue(fields.code);
  const errors = {};

  if (!items.length) errors.cart = 'Añade una prenda al carrito antes de preparar el pedido de prueba.';
  if (name.length < 2 || name.length > 100 || !/^[\p{L}\p{M} '\u2019-]+$/u.test(name)) errors.name = 'Escribe un nombre válido, de entre 2 y 100 caracteres.';
  if (!validEmail(email)) errors.email = 'Escribe un correo electrónico válido.';
  const digits = phone.replace(/[ ()-]/g, '');
  if (!/^(?:(?:\+34|0034))?[6789]\d{8}$/.test(digits)) errors.phone = 'Escribe un teléfono español válido de 9 cifras, con +34 si lo necesitas.';
  if (!SHIPPING_OPTIONS.has(shipping)) errors.shipping = 'Selecciona una de las opciones de entrega.';
  if (shipping !== 'pickup') {
    if (address.length < 5 || address.length > 150 || !/\d/.test(address) || /[<>]/.test(address)) errors.address = 'Escribe la calle y el número de la dirección.';
    if (!/^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(postalCode)) errors.postalCode = 'Escribe un código postal español válido de 5 cifras.';
    if (city.length < 2 || city.length > 100 || !/\p{L}/u.test(city) || /[<>]/.test(city)) errors.city = 'Escribe la localidad de entrega.';
  }
  if (code && code !== 'SPALI10') errors.code = 'El código no es válido en esta demostración.';
  if (fields.consent !== true && fields.consent !== 'on') errors.consent = 'Acepta las condiciones del pedido de prueba para continuar.';
  if (Object.keys(errors).length) return { valid: false, errors };

  const createdAt = new Date().toISOString();
  const customer = { name, email, phone };
  if (shipping !== 'pickup') Object.assign(customer, { address, postalCode, city });
  return {
    valid: true,
    errors: {},
    order: {
      id: `PRUEBA-${createdAt.replace(/\D/g, '')}`,
      simulation: true,
      status: 'simulated',
      notice: 'Pedido de prueba. No se ha realizado ninguna compra, cobro, reserva ni envío de datos.',
      createdAt,
      customer,
      shipping,
      code,
      items,
      summary: cartSummary(items, { shipping, code }),
    },
  };
}
