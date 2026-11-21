/* ==========================================================================
   ATELIER BEAUTY — interactions
   Progressive enhancement only: every section works without this file.
   ========================================================================== */
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Reveal on scroll ---------- */
  let observer = null;

  const reveal = (el) => el.classList.add('is-revealed');

  const setStagger = (el) => {
    if (el.style.getPropertyValue('--ab-delay')) return;
    const parent = el.parentElement;
    if (!parent) return;
    const siblings = Array.from(parent.children).filter((child) => child.hasAttribute('data-ab-reveal'));
    const index = Math.min(siblings.indexOf(el), 6);
    if (index > 0) el.style.setProperty('--ab-delay', `${index * 0.08}s`);
  };

  const initReveal = (scope = document) => {
    const items = scope.querySelectorAll('[data-ab-reveal]:not(.is-revealed)');
    if (!items.length) return;

    if (reducedMotion.matches || !('IntersectionObserver' in window) || !root.classList.contains('ab-motion')) {
      items.forEach(reveal);
      return;
    }

    observer =
      observer ||
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            reveal(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
      );

    items.forEach((el) => {
      setStagger(el);
      observer.observe(el);
    });
  };

  /* ---------- Collection index: hover/focus swaps the preview ---------- */
  if (!customElements.get('ab-collection-index')) {
    customElements.define(
      'ab-collection-index',
      class AbCollectionIndex extends HTMLElement {
        connectedCallback() {
          this.rows = Array.from(this.querySelectorAll('.ab-index__row'));
          this.slides = Array.from(this.querySelectorAll('.ab-index__slide'));
          this.rows.forEach((row) => {
            const activate = () => this.activate(row.dataset.index);
            row.addEventListener('mouseenter', activate);
            row.addEventListener('focus', activate);
          });
        }

        activate(index) {
          this.slides.forEach((slide) => slide.classList.toggle('is-active', slide.dataset.index === index));
          this.rows.forEach((row) =>
            row.closest('.ab-index__item')?.classList.toggle('is-active', row.dataset.index === index)
          );
        }
      }
    );
  }

  /* ---------- Horizontal rail with prev/next buttons ---------- */
  if (!customElements.get('ab-rail')) {
    customElements.define(
      'ab-rail',
      class AbRail extends HTMLElement {
        connectedCallback() {
          this.track = this.querySelector('[data-rail-track]');
          this.prev = this.querySelector('[data-rail-prev]');
          this.next = this.querySelector('[data-rail-next]');
          if (!this.track) return;

          this.update = this.update.bind(this);
          this.prev?.addEventListener('click', () => this.move(-1));
          this.next?.addEventListener('click', () => this.move(1));
          this.track.addEventListener('scroll', this.update, { passive: true });

          if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(this.update);
            this.resizeObserver.observe(this.track);
          }
          this.update();
        }

        disconnectedCallback() {
          this.resizeObserver?.disconnect();
        }

        step() {
          const item = this.track.querySelector(':scope > li');
          if (!item) return this.track.clientWidth * 0.8;
          const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
          return item.getBoundingClientRect().width + gap;
        }

        move(direction) {
          this.track.scrollBy({
            left: direction * this.step(),
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
          });
        }

        update() {
          const max = this.track.scrollWidth - this.track.clientWidth;
          const left = this.track.scrollLeft;
          if (this.prev) this.prev.disabled = left <= 2;
          if (this.next) this.next.disabled = left >= max - 2;
          this.toggleAttribute('data-static', max <= 2);
        }
      }
    );
  }

  /* ---------- Copy discount code ---------- */
  if (!customElements.get('ab-copy-code')) {
    customElements.define(
      'ab-copy-code',
      class AbCopyCode extends HTMLElement {
        connectedCallback() {
          this.button = this.querySelector('button');
          this.status = this.querySelector('[data-copy-status]');
          this.button?.addEventListener('click', () => this.copy());
        }

        async copy() {
          const code = this.dataset.code || '';
          try {
            await navigator.clipboard.writeText(code);
            this.say(this.dataset.copied || 'Copied');
          } catch (error) {
            this.say(code);
          }
        }

        say(message) {
          if (!this.status) return;
          this.status.textContent = message;
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.status.textContent = '';
          }, 2600);
        }
      }
    );
  }

  /* ---------- Marquee pause/play (WCAG 2.2.2) ---------- */
  if (!customElements.get('ab-marquee')) {
    customElements.define(
      'ab-marquee',
      class AbMarquee extends HTMLElement {
        connectedCallback() {
          this.toggle = this.querySelector('[data-marquee-toggle]');
          this.label = this.toggle?.querySelector('.visually-hidden');
          this.toggle?.addEventListener('click', () => {
            const paused = this.classList.toggle('is-paused');
            this.toggle.setAttribute('aria-pressed', String(paused));
            if (this.label) this.label.textContent = paused ? 'Play scrolling text' : 'Pause scrolling text';
          });
        }
      }
    );
  }

  /* ---------- Sticky add-to-bag (mirrors Dawn's main product form) ---------- */
  if (!customElements.get('ab-sticky-atc')) {
    customElements.define(
      'ab-sticky-atc',
      class AbStickyAtc extends HTMLElement {
        connectedCallback() {
          this.info = document.querySelector('product-info[id^="MainProduct-"]');
          this.button = this.querySelector('[data-sticky-button]');
          this.priceEl = this.querySelector('[data-sticky-price]');
          this.variantEl = this.querySelector('[data-sticky-variant]');
          if (!this.info || !this.button) return;

          this.hidden = false;
          this.setVisible(false);

          this.bound = true;
          this.button.onclick = () => {
            const main = this.mainButton();
            if (!main) return;
            if (main.disabled || main.getAttribute('aria-disabled') === 'true') {
              main.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
              return;
            }
            main.click();
          };

          /* Position check on scroll (rAF-throttled): unlike an IntersectionObserver it also
             catches jumps past the button (anchor links, fast flicks). */
          this.check = () => {
            this.ticking = false;
            const main = this.mainButton();
            if (!main) return;
            const shouldShow = main.getBoundingClientRect().bottom < 0;
            if (shouldShow !== this.classList.contains('is-visible')) this.setVisible(shouldShow);
          };
          this.onScroll = () => {
            if (this.ticking) return;
            this.ticking = true;
            requestAnimationFrame(this.check);
          };
          window.addEventListener('scroll', this.onScroll, { passive: true });
          window.addEventListener('resize', this.onScroll, { passive: true });
          this.check();

          if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
            this.unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, () => {
              setTimeout(() => this.sync(), 60);
            });
          }
          this.sync();
        }

        disconnectedCallback() {
          window.removeEventListener('scroll', this.onScroll);
          window.removeEventListener('resize', this.onScroll);
          this.unsubscribe?.();
        }

        mainButton() {
          return this.info.querySelector('.product-form__submit');
        }

        sync() {
          const priceBox = this.info.querySelector('.price');
          const price = priceBox?.classList.contains('price--on-sale')
            ? priceBox.querySelector('.price__sale .price-item--sale')
            : priceBox?.querySelector('.price__regular .price-item--regular');
          if (price && this.priceEl) this.priceEl.textContent = price.textContent.trim();

          const variantJson = this.info.querySelector('variant-selects [data-selected-variant]');
          if (variantJson && this.variantEl) {
            try {
              const variant = JSON.parse(variantJson.textContent);
              this.variantEl.textContent = variant ? variant.title : '';
            } catch (error) {
              /* keep the server-rendered value */
            }
          }

          const main = this.mainButton();
          if (main) {
            const label = main.querySelector('span')?.textContent.trim();
            if (label) this.button.textContent = label;
            this.button.classList.toggle('is-unavailable', main.disabled);
          }
        }

        setVisible(visible) {
          this.classList.toggle('is-visible', visible);
          this.toggleAttribute('inert', !visible);
          this.setAttribute('aria-hidden', String(!visible));
          if (visible) this.sync();
        }
      }
    );
  }

  /* ---------- Cart discount codes (Shopify Ajax Cart API) ---------- */
  if (!customElements.get('ab-cart-discount')) {
    customElements.define(
      'ab-cart-discount',
      class AbCartDiscount extends HTMLElement {
        connectedCallback() {
          this.form = this.querySelector('form');
          this.input = this.querySelector('input');
          this.status = this.querySelector('[role="status"]');
          if (!this.closest('cart-drawer')) {
            try {
              const pending = sessionStorage.getItem('ab-discount-message');
              if (pending) {
                this.say(pending);
                sessionStorage.removeItem('ab-discount-message');
              }
            } catch (error) {
              /* ignore */
            }
          }

          this.form?.addEventListener('submit', (event) => {
            event.preventDefault();
            const code = this.input.value.trim();
            if (!code) {
              this.say('Enter a discount code.');
              this.input.focus();
              return;
            }
            const codes = this.codes();
            if (codes.some((existing) => existing.toLowerCase() === code.toLowerCase())) {
              this.say('That code is already applied.');
              return;
            }
            this.update([...codes, code], code);
          });

          this.querySelectorAll('[data-remove-code]').forEach((button) =>
            button.addEventListener('click', () =>
              this.update(this.codes().filter((code) => code !== button.dataset.removeCode))
            )
          );
        }

        codes() {
          return (this.dataset.codes || '')
            .split(',')
            .map((code) => code.trim())
            .filter(Boolean);
        }

        say(message) {
          if (this.status) this.status.textContent = message;
        }

        setLoading(loading) {
          this.classList.toggle('is-loading', loading);
          this.querySelector('.ab-discount__apply')?.toggleAttribute('disabled', loading);
          this.querySelector('.loading__spinner')?.classList.toggle('hidden', !loading);
        }

        async post(updateUrl, discount, sections) {
          const body = { discount };
          if (sections) body.sections = sections;
          const response = await fetch(`${updateUrl}.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(body),
          });
          const state = await response.json();
          if (!response.ok) throw new Error(state.description || state.message || 'Cart update failed');
          return state;
        }

        async update(codes, added) {
          const drawer = this.closest('cart-drawer');
          const sections = drawer ? drawer.getSectionsToRender().map((section) => section.id) : null;
          const updateUrl = (window.routes && window.routes.cart_update_url) || '/cart/update';

          this.setLoading(true);
          try {
            let state = await this.post(updateUrl, codes.join(','), sections);
            let message = added ? '' : 'Code removed.';

            if (added) {
              const match = (state.discount_codes || []).find(
                (entry) => entry.code.toLowerCase() === added.toLowerCase()
              );
              if (match && match.applicable) {
                message = `Code ${match.code} applied.`;
              } else {
                /* Drop the rejected code so it doesn't travel to checkout. */
                state = await this.post(updateUrl, codes.filter((code) => code !== added).join(','), sections);
                message = `“${added}” isn’t valid for the items in your bag.`;
              }
            }

            if (!drawer) {
              try {
                sessionStorage.setItem('ab-discount-message', message);
              } catch (error) {
                /* storage unavailable: the page still reloads with the updated cart */
              }
              window.location.reload();
              return;
            }

            drawer.renderContents(state);
            const fresh = document.querySelector('cart-drawer ab-cart-discount');
            fresh?.say(message);
            fresh?.querySelector('input')?.focus();
          } catch (error) {
            this.say('We couldn’t update your codes. Please try again.');
            this.setLoading(false);
          }
        }
      }
    );
  }

  /* ---------- Boot ---------- */
  initReveal();
  root.classList.add('ab-ready');

  document.addEventListener('shopify:section:load', (event) => initReveal(event.target));
})();
