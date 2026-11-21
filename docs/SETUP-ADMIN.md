# ATELIER BEAUTY — Configuración del admin (Fase 1)

Tienda: `atelier-beauty-demo.myshopify.com`
Tema base: Dawn 16.2.0 personalizado (prefijo `ab-` en archivos propios).

Haz los pasos **en este orden**. Los metafields deben existir **antes** de importar el CSV.

---

## 1. Nombre de la tienda
**Settings → General → Store name:** `Atelier Beauty`
(El header usa este nombre como logotipo tipográfico.)

## 2. Definiciones de metafields
**Settings → Custom data → Products → Add definition**

| Name | Namespace and key | Type |
|---|---|---|
| Ingredients | `custom.ingredients` | Multi-line text |
| How to use | `custom.how_to_use` | Multi-line text |
| Shipping note *(opcional)* | `custom.shipping_note` | Rich text |

Opcional, para tonos exactos por variante: **Settings → Custom data → Variants → Add definition**
`Shade hex` · `custom.shade_hex` · Color.
Si no lo creas, los tonos salen de la paleta en *Theme settings → Atelier Beauty*.

## 3. Importar productos
**Products → Import →** sube `docs/atelier-products.csv`.
- 12 productos, 32 variantes, precios en USD, inventario real.
- El tono *6W Espresso* de la base tiene stock 0 a propósito, para probar el estado agotado.
- Las fotos se cargan en un paso aparte (ver punto 9).

## 4. Colecciones automatizadas
**Products → Collections → Create collection → Automated**

| Título | Condición |
|---|---|
| Makeup | Product tag is equal to `makeup` |
| Skincare | Product tag is equal to `skincare` |
| Lip | Product type is equal to `Lip` |
| Face | Product type is equal to `Face` |
| Eyes | Product type is equal to `Eyes` |
| Skin | Product type is equal to `Skin` |
| Best Sellers | Product tag is equal to `best-seller` |

Los handles deben quedar: `makeup`, `skincare`, `lip`, `face`, `eyes`, `skin`, `best-sellers`.
La homepage ya apunta a esos handles.

## 5. Menús
**Online Store → Navigation**

**Main menu** (`main-menu`):
- Makeup → submenú: Lip, Face, Eyes
- Skincare → submenú: Skin
- Shop all → `/collections/all`

**Nuevo menú "Shop categories"** (el handle debe ser `shop-categories`):
All (`/collections/all`), Makeup, Skincare, Lip, Face, Eyes, Skin.
Lo usan la barra de categorías de las colecciones y el footer.

## 6. Filtros
Instala la app gratuita **Search & Discovery** (de Shopify) → *Filters* → agrega:
Availability, Price, Product type, Product option **Shade**, Product option **Size**.
Sin la app, Dawn muestra solo los filtros por defecto.

## 7. Políticas
**Settings → Policies →** crea desde plantilla: Refund, Privacy, Terms of service, Shipping.
Añade al inicio: *"Demo store for portfolio purposes. No orders are fulfilled."*

## 8. Descuento demo (opcional)
**Discounts → Create discount → Amount off order** · código `ATELIER15` · 15 %.

## 9. Fotografía
Pendiente: cargar imágenes con licencia compatible (Unsplash/Pexels con licencia de uso comercial, o fotos propias).
Hasta entonces el tema muestra placeholders y monogramas en vez de imágenes rotas.

---

## Vista previa y desarrollo

```powershell
cd C:\Users\frank\Documents\atelier-beauty
shopify theme check
shopify theme dev --store atelier-beauty-demo.myshopify.com
```

- `theme dev` abre `http://127.0.0.1:9292` con recarga en vivo.
- Las tiendas de desarrollo tienen contraseña: **Online Store → Preferences → Password protection**.
- Para un enlace compartible y el Theme Editor:
  `shopify theme push --unpublished --store atelier-beauty-demo.myshopify.com`
  Luego **Online Store → Themes → Atelier (…) → Customize**.

## Archivos personalizados

| Archivo | Qué hace |
|---|---|
| `assets/atelier.css`, `assets/atelier.js` | Capa visual y microinteracciones |
| `sections/ab-hero-editorial.liquid` | Hero editorial asimétrico |
| `sections/ab-marquee.liquid` | Cinta en movimiento con pausa accesible |
| `sections/ab-collection-index.liquid` | Índice tipográfico de colecciones con vista previa |
| `sections/ab-the-edit.liquid` | Producto destacado + carrusel numerado con add to cart nativo |
| `sections/ab-launch-promo.liquid` | Novedades y promociones (bloques) |
| `sections/ab-brand-story.liquid` | Storytelling con principios numerados |
| `sections/ab-collection-nav.liquid` | Barra de categorías en colecciones |
| `sections/ab-footer.liquid` | Footer con newsletter nativa y aviso demo |
| `snippets/ab-*.liquid` | Tile de producto, quick add, puntos de tono |
| Cambios mínimos en Dawn | `theme.liquid`, `main-product` (bloque *Atelier accordion*), selector de variantes y swatches, `card-product` |

---

# Fase 2 — Configuración comercial

## 10. Pagos de prueba (Bogus Gateway)
**Settings → Payments.** En una tienda de desarrollo aparece **"(for testing) Bogus Gateway"** como proveedor de pago.
Actívalo. Con él, en el checkout se usa:
- Nombre en la tarjeta: **Bogus Gateway**
- Número: **1** (pago aprobado) · **2** (pago rechazado, para probar errores)
- Fecha: cualquiera futura · CVV: cualquiera de 3 dígitos

Nunca uses una tarjeta real.

## 11. Código de descuento
**Discounts → Create discount → Amount off order** · código `ATELIER15` · 15 % · sin fecha de fin.
El campo de descuento del carrito lo valida con Shopify.

## 12. Envío gratis (opcional)
1. **Settings → Shipping and delivery → General shipping rates →** en la zona de Estados Unidos agrega una tarifa *Free shipping* con condición **"Based on order price", mínimo $50**.
2. Solo entonces: **Theme settings → Atelier Beauty → Cart →** activa *Show free-shipping progress* con el mismo umbral (50).

## 13. Menú de la cuenta de cliente
Elimina los errores de consola: **Content → Menus → Add menu** con título `Customer account main menu`
(handle `customer-account-main-menu`) y un enlace *Orders* → `/account`.

## 14. Productos complementarios y filtros
App gratuita **Search & Discovery**:
- *Filters*: Availability, Price, Product type, opción **Shade**, opción **Size**.
- *Product recommendations → Complementary products*: por ejemplo, la base con el rubor y el iluminador.

## 15. SEO básico
**Online Store → Preferences →** *Homepage title*: `Atelier Beauty — Modern Beauty, Everyday Luxury`
y una *meta description* breve. Revisa también el texto alternativo de cada imagen de producto (**Products → imagen → Add alt text**).

## 16. Metafields adicionales (opcional)
- `custom.benefits` (Multi-line text) → acordeón *Why you'll love it*.
- Si *How to use* no aparece en los productos, revisa que la clave sea exactamente `custom.how_to_use`.
