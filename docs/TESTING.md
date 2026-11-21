# Test report — Atelier Beauty (Phase 2)

Date: 2026-11-20 · Environment: `shopify theme dev` preview (Shopify CLI 5.0.2) on the development store `atelier-beauty-demo`, viewed in a Chromium-based browser at 1440 × 900 and 375 × 812.

Legend: ✅ run and passed · ⏳ requires a manual step in Shopify admin (not run yet) · ⚠️ known limitation.

## Product page
| Test | Result |
|---|---|
| Selecting a shade updates the selected label, URL `?variant=` and price | ✅ (Velvet Ink → Rosewood; Serum Foundation shades) |
| Sold-out variant (6W Espresso, stock 0): button shows "Sold out" and is disabled, inventory shows "Out of stock", swatch crossed | ✅ |
| Inventory indicator for in-stock variant | ✅ ("14 in stock") |
| Sticky add-to-bag appears after the main button scrolls away, mirrors variant/price and the sold-out state | ✅ (fixed a bug where fast scrolling skipped the trigger: switched from IntersectionObserver to a rAF scroll check) |
| Accordions hide when their metafield is empty | ✅ (How to apply / benefits hidden until metafields are filled) |
| Complementary products block | ⏳ needs Search & Discovery complementary products configured |

## Cart
| Test | Result |
|---|---|
| Add to cart opens the drawer with the right variant and price | ✅ |
| Quantity + / − updates line total and estimated total without reload | ✅ ($28 → $56) |
| Remove line empties the cart | ✅ |
| Quantity above stock is capped by Shopify with a message | ✅ (99 → 14, "Only 14 items were added…") |
| Invalid discount code: message shown, code removed from cart | ✅ (drawer and cart page) |
| Valid discount code applied to totals | ✅ `ATELIER15` (15 % off) applied in the drawer and carried to checkout |
| Cross-sell shows up to 3 available products not already in the cart | ✅ |
| Free-shipping progress | ⏳ disabled until a free-shipping rate is configured |

## Catalog & search
| Test | Result |
|---|---|
| Sort by price ascending | ✅ |
| Filter price ≤ $30 and in-stock availability | ✅ |
| Quick view modal (swatches, stock, add to cart) | ✅ opens with shade picker and stock |
| Predictive search "lip" returns collection + 3 products | ✅ |

## Technical checks
| Check | Result |
|---|---|
| JavaScript errors from theme code | ✅ none found. Console noise comes from Shopify scripts: missing `customer-account-main-menu` menu (fix in admin) and a `shop.app` frame blocked by CSP in local preview |
| Images without `alt` attribute (homepage) | ✅ none |
| Single `<h1>` per page, `lang="en"`, canonical URL, product JSON-LD | ✅ |
| Horizontal overflow at 375 px | ✅ none |
| `shopify theme check` | ✅ **0 errors**, 9 warnings — all in unmodified Dawn files (`facets`, `main-search`, `main-article`, `main-list-collections`, `quick-order-product-row`, `theme.liquid`/`password.liquid` `scheme_classes`, `main-product` `offset: continue` and `seo_media`). Left as-is to keep Dawn upgradable. Raw output: `docs/theme-check.json` |

## Checkout (run by the store owner — the store is password-protected)
| Step | Result |
|---|---|
| Select product + shade (Velvet Ink Lip Lacquer · Rosewood) and add to cart | ✅ |
| Change quantity in the cart drawer (1 → 2, $56.00) | ✅ |
| Apply `ATELIER15` in the cart drawer | ✅ |
| Native Shopify checkout with the Bogus Gateway test provider (no real payment) | ✅ |
| Order #1001 created in Shopify admin, flagged "Test order", paid, line items and SKU correct | ✅ |
| Inventory of the purchased variant decreased by the ordered quantity | ✅ |

_Tip: use fictitious customer data for test orders that appear in portfolio screenshots._
