# ATELIER BEAUTY — Shopify Theme (Portfolio Demo)

> **Fictional brand. Portfolio project.** Atelier Beauty is not a real company. The storefront runs on a Shopify development store; orders are test orders and are never fulfilled.

A luxury makeup and skincare storefront built as a **real Shopify Online Store 2.0 theme** — not a mock-up or a React imitation. It extends Shopify's **Dawn 16.2.0** with an editorial design system, custom sections and commerce features, while products, variants, inventory, cart, discounts and checkout all run on native Shopify.

**Concept:** *Modern Beauty, Everyday Luxury* · Palette: warm ivory, deep burgundy, powder rose, sand, ink · Type: Playfair Display + Work Sans (Shopify font library).

---

## Highlights

| Area | What was built |
|---|---|
| **Homepage** | Editorial asymmetric hero with layered imagery and rotating badge · accessible marquee (pause control) · typographic collection index with hover preview · "The Edit" featured product + numbered rail with native add-to-cart · new arrivals & promotion mosaic with copy-to-clipboard code · brand story with numbered principles · custom footer with native newsletter form |
| **Product page** | Visual shade swatches (colour from native swatches → variant metafield → theme palette) · live price/availability per variant · inventory indicator · lightbox zoom · metafield-driven accordions (benefits, ingredients, how to apply) that hide when empty · complementary products · related products · sticky add-to-bag bar that mirrors the real product form |
| **Cart** | Dawn cart drawer restyled · discount codes via Shopify's Ajax Cart API (invalid codes are rejected and removed) · cross-sell ("Complete the ritual") from a merchant-chosen collection · optional free-shipping progress (off until a matching shipping rate exists) · inventory-capped quantities |
| **Catalog** | Category bar driven by a navigation menu · native filtering & sorting (Storefront Filtering / Search & Discovery) · quick view modal · predictive search · shade dots on product cards |
| **Admin experience** | Every custom section has a schema with blocks and settings; colours use theme colour schemes; nothing product-related is hard-coded |

## Tech stack

Shopify Liquid · Online Store 2.0 JSON templates · sections & blocks · section groups · metafields · HTML5 · modern CSS (no framework) · vanilla JavaScript (custom elements, progressive enhancement) · Shopify CLI · Git.

## Project structure

Custom files use the `ab-` prefix; Dawn files were changed only where an integration point was needed.

```
assets/
  atelier.css            Design layer loaded after Dawn's base.css
  atelier.js             Custom elements: reveal, rail, collection index, copy code,
                         marquee, sticky add-to-bag, cart discount codes
sections/
  ab-hero-editorial      ab-marquee            ab-collection-index
  ab-the-edit            ab-launch-promo       ab-brand-story
  ab-footer              ab-collection-nav     ab-sticky-atc
snippets/
  ab-card-shades         ab-product-tile       ab-quick-add
  ab-free-shipping       ab-cart-discount      ab-cart-upsell
docs/
  SETUP-ADMIN.md         Store configuration steps (Spanish)
  TESTING.md             Test report
  atelier-products.csv   Demo catalog (12 products, 32 variants)
```

**Modified Dawn files** (search for `Atelier` comments): `layout/theme.liquid`, `sections/main-product.liquid` (new *Atelier accordion* block), `sections/main-cart-footer.liquid`, `snippets/cart-drawer.liquid`, `snippets/card-product.liquid`, `snippets/product-variant-picker.liquid`, `snippets/product-variant-options.liquid`, `snippets/swatch.liquid`, `snippets/swatch-input.liquid`, `config/settings_schema.json` (new *Atelier Beauty* settings group).

## Key implementation notes

- **Shade swatches without an app.** Options named like *Shade/Color/Tone* (configurable) render as swatches. Colour resolves from Shopify's native swatch, then the variant metafield `custom.shade_hex`, then a `Name: #hex` palette in theme settings.
- **Sticky add-to-bag never duplicates cart logic.** It reads price/variant from the main product section and clicks Dawn's real submit button, so variant validation, inventory errors and the cart drawer stay native.
- **Discount codes** use `POST /cart/update.js` with the `discount` parameter and re-render the drawer through the Section Rendering API. Shopify decides validity; rejected codes are removed so they never reach checkout.
- **Free-shipping bar is opt-in.** A theme cannot read shipping rules, so the bar stays off until the merchant creates a matching rate and enables it.
- **Motion is progressive.** Reveal animations only run when `prefers-reduced-motion` allows it, with a CSS fail-safe if JavaScript doesn't load; they are disabled in the theme editor.

## Local development

Requirements: Node.js 22.12+, Git 2.28+, Shopify CLI 5.

```bash
shopify theme dev --store atelier-beauty-demo.myshopify.com   # local preview with hot reload
shopify theme check                                           # lint
shopify theme push --unpublished                              # upload as a new theme
```

Store configuration (metafields, collections, menus, payments for testing) is documented in [`docs/SETUP-ADMIN.md`](docs/SETUP-ADMIN.md).

## Content & licensing

- Product names, descriptions, prices and ingredient lists are fictional and written for this demo. No dermatological or clinical claims are made.
- Photography: [Pexels](https://www.pexels.com/license/) (free licence). Credit belongs to the original photographers.
- Base theme: [Shopify Dawn](https://github.com/Shopify/dawn) — see `LICENSE.md`. Dawn's original README is kept at `docs/DAWN-README.md`.
