class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.header = document.querySelector('.section-header');
    this.borderOffset = this.closest('.header-wrapper').classList.contains('header-wrapper--border-bottom') ? 1 : 0;
    this.addEventListener('keyup', this.onKeyUp.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll('summary').forEach(summary => summary.addEventListener('click', this.onSummaryClick.bind(this)));
    this.querySelectorAll('button').forEach(button => button.addEventListener('click', this.onCloseButtonClick.bind(this)));
  }

  onKeyUp(event) {
    if(event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if(!openDetailsElement) return;

    openDetailsElement === this ? this.closeMenuDrawer(event, this.querySelector('summary')) : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const parentMenuElement = detailsElement.closest('.has-submenu');
    const isOpen = detailsElement.hasAttribute('open');
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function addTrapFocus() {
      trapFocus(summaryElement.nextElementSibling, detailsElement.querySelector('button'));
      summaryElement.nextElementSibling.removeEventListener('transitionend', addTrapFocus);
    }

    if (detailsElement === this) {
      if(isOpen) event.preventDefault();
      isOpen ? this.closeMenuDrawer(event, summaryElement) : this.openMenuDrawer(summaryElement);

      if (window.matchMedia('(max-width: 990px)')) {
        document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
      }
    } else {
      setTimeout(() => {
        detailsElement.classList.add('menu-opening');
        summaryElement.setAttribute('aria-expanded', true);
        parentMenuElement && parentMenuElement.classList.add('submenu-open');
        !reducedMotion || reducedMotion.matches ? addTrapFocus() : summaryElement.nextElementSibling.addEventListener('transitionend', addTrapFocus);
      }, 100);
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.classList.add('menu-opening');
    });
    summaryElement.setAttribute('aria-expanded', true);
    trapFocus(this, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event === undefined) return;

    this.classList.remove('menu-opening');
    this.querySelectorAll('details').forEach(details => {
      details.removeAttribute('open');
      details.classList.remove('menu-opening');
    });
    this.querySelectorAll('.submenu-open').forEach(submenu => {
      submenu.classList.remove('submenu-open');
    });
    document.body.classList.remove(`overflow-hidden-${this.dataset.breakpoint}`);
    removeTrapFocus(elementToFocus);
    this.closeAnimation(this);

    if (event instanceof KeyboardEvent) elementToFocus?.setAttribute('aria-expanded', false);
  }

  onFocusOut() {
    setTimeout(() => {
      if (this.contains(document.activeElement)) return;
      this.close();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest('details');
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    const parentMenuElement = detailsElement.closest('.submenu-open');
    parentMenuElement && parentMenuElement.classList.remove('submenu-open');
    detailsElement.classList.remove('menu-opening');
    detailsElement.querySelector('summary').setAttribute('aria-expanded', false);
    removeTrapFocus(detailsElement.querySelector('summary'));
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute('open');
        if (detailsElement.closest('details[open]')) {
          trapFocus(detailsElement.closest('details[open]'), detailsElement.querySelector('summary'));
        }
      }
    }

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define('menu-drawer', MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }

  openMenuDrawer(summaryElement) {
    this.header.classList.add('menu-open');
    super.openMenuDrawer(summaryElement);
  }

  closeMenuDrawer(event, elementToFocus) {
    super.closeMenuDrawer(event, elementToFocus);
    this.header.classList.remove('menu-open');
  }
}

customElements.define('header-drawer', HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      'click',
      this.hide.bind(this, false)
    );
    this.addEventListener('keyup', (event) => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
    if (this.classList.contains('media-modal')) {
      this.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'mouse' && !event.target.closest('deferred-media, product-model')) this.hide();
      });
    } else {
      this.addEventListener('click', (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector('.template-popup');
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    document.body.dispatchEvent(new CustomEvent('modalClosed'));
    this.removeAttribute('open');
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
}
customElements.define('modal-dialog', ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');

    if (!button) return;
    button.addEventListener('click', () => {
      const modal = document.querySelector(this.getAttribute('data-modal'));
      if (modal) modal.show(button);
    });
  }
}
customElements.define('modal-opener', ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener('click', this.loadContent.bind(this));
  }

  loadContent(focus = true) {
    window.pauseAllMedia();
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));

      this.setAttribute('loaded', true);
      const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
      if (focus) deferredElement.focus();
      if (deferredElement.nodeName == 'VIDEO' && deferredElement.getAttribute('autoplay')) {
        // force autoplay for safari
        deferredElement.play();
      }
    }
  }
}

customElements.define('deferred-media', DeferredMedia);

class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('[id^="Slider-"]');
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.enableSliderLooping = false;
    this.currentPageElement = this.querySelector('.slider-counter--current');
    this.pageTotalElement = this.querySelector('.slider-counter--total');
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    if (!this.slider || !this.nextButton) return;

    this.initPages();
    const resizeObserver = new ResizeObserver(entries => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener('scroll', this.update.bind(this));
    this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
    this.nextButton.addEventListener('click', this.onButtonClick.bind(this));
  }

  initPages() {
    this.sliderItemsToShow = Array.from(this.sliderItems).filter(element => element.clientWidth > 0);
    if (this.sliderItemsToShow.length < 2) return;
    this.sliderItemOffset = this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft;
    this.slidesPerPage = Math.floor((this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) / this.sliderItemOffset);
    this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
    this.update();
  }

  resetPages() {
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.initPages();
  }

  update() {
    // Temporarily prevents unneeded updates resulting from variant changes
    // This should be refactored as part of https://github.com/Shopify/dawn/issues/2057
    if (!this.slider || !this.nextButton) return;

    const previousPage = this.currentPage;
    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;

    if (this.currentPageElement && this.pageTotalElement) {
      this.currentPageElement.textContent = this.currentPage;
      this.pageTotalElement.textContent = this.totalPages;
    }

    if (this.currentPage != previousPage) {
      this.dispatchEvent(new CustomEvent('slideChanged', {
        detail: {
          currentPage: this.currentPage,
          currentElement: this.sliderItemsToShow[this.currentPage - 1]
        }
      }));
    }

    if (this.enableSliderLooping) return;

    if (this.isSlideVisible(this.sliderItemsToShow[0]) && this.slider.scrollLeft === 0) {
      this.prevButton.setAttribute('disabled', 'disabled');
    } else {
      this.prevButton.removeAttribute('disabled');
    }

    if (this.isSlideVisible(this.sliderItemsToShow[this.sliderItemsToShow.length - 1])) {
      this.nextButton.setAttribute('disabled', 'disabled');
    } else {
      this.nextButton.removeAttribute('disabled');
    }
  }

  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide = this.slider.clientWidth + this.slider.scrollLeft - offset;
    return (element.offsetLeft + element.clientWidth) <= lastVisibleSlide && element.offsetLeft >= this.slider.scrollLeft;
  }

  onButtonClick(event) {
    event.preventDefault();
    const step = event.currentTarget.dataset.step || 1;
    this.slideScrollPosition = event.currentTarget.name === 'next' ? this.slider.scrollLeft + (step * this.sliderItemOffset) : this.slider.scrollLeft - (step * this.sliderItemOffset);
    this.setSlidePosition(this.slideScrollPosition);
  }

  setSlidePosition(position) {
    this.slider.scrollTo({
      left: position
    });
  }
}

customElements.define('slider-component', SliderComponent);

class SlideshowComponent extends SliderComponent {
  constructor() {
    super();
    this.sliderControlWrapper = this.querySelector('.slider-buttons');
    this.enableSliderLooping = true;

    if (!this.sliderControlWrapper) return;

    this.sliderFirstItemNode = this.slider.querySelector('.slideshow__slide');
    if (this.sliderItemsToShow.length > 0) this.currentPage = 1;

    this.announcementBarSlider = this.querySelector('.announcement-bar-slider');
    // Value below should match --duration-announcement-bar CSS value
    this.announcementBarAutorotateSpeed = 250;

    this.sliderControlLinksArray = Array.from(this.sliderControlWrapper.querySelectorAll('.slider-counter__link'));
    this.sliderControlLinksArray.forEach(link => link.addEventListener('click', this.linkToSlide.bind(this)));
    this.slider.addEventListener('scroll', this.setSlideVisibility.bind(this));
    this.setSlideVisibility();

    if (this.announcementBarSlider) {
      this.setAutoPlay();
    }
  }

  setAutoPlay() {
    this.autoplayButtonIsSetToPlay = true;
    this.play();
  }

  onButtonClick(event) {
    super.onButtonClick(event);
    this.wasClicked = true;

    const isFirstSlide = this.currentPage === 1;
    const isLastSlide = this.currentPage === this.sliderItemsToShow.length;

    if (!isFirstSlide && !isLastSlide) {
      this.applyAnimationToAnnouncementBar(event.currentTarget.name);
      return;
    }

    if (isFirstSlide && event.currentTarget.name === 'previous') {
      this.slideScrollPosition = this.slider.scrollLeft + this.sliderFirstItemNode.clientWidth * this.sliderItemsToShow.length;
    } else if (isLastSlide && event.currentTarget.name === 'next') {
      this.slideScrollPosition = 0;
    }

    this.applyAnimationToAnnouncementBar(event.currentTarget.name);

    this.setSlidePosition(this.slideScrollPosition);
  }

  setSlidePosition(position) {
    if (this.setPositionTimeout) clearTimeout(this.setPositionTimeout);
    this.setPositionTimeout = setTimeout(() => {
      this.slider.scrollTo({
        left: position
      });
    }, this.announcementBarSlider ? this.announcementBarAutorotateSpeed : 0);
  }

  update() {
    super.update();
    this.sliderControlButtons = this.querySelectorAll('.slider-counter__link');
    this.prevButton.removeAttribute('disabled');

    if (!this.sliderControlButtons.length) return;

    this.sliderControlButtons.forEach(link => {
      link.classList.remove('slider-counter__link--active');
      link.removeAttribute('aria-current');
    });
    this.sliderControlButtons[this.currentPage - 1].classList.add('slider-counter__link--active');
    this.sliderControlButtons[this.currentPage - 1].setAttribute('aria-current', true);
  }

  autoRotateSlides() {
    const slideScrollPosition = this.currentPage === this.sliderItems.length ? 0 : this.slider.scrollLeft + this.sliderItemOffset;

    this.setSlidePosition(slideScrollPosition);
  }

  setSlideVisibility(event) {
    this.sliderItemsToShow.forEach((item, index) => {
      const linkElements = item.querySelectorAll('a');
      if (index === this.currentPage - 1) {
        if (linkElements.length) linkElements.forEach(button => {
          button.removeAttribute('tabindex');
        });
        item.setAttribute('aria-hidden', 'false');
        item.removeAttribute('tabindex');
      } else {
        if (linkElements.length) linkElements.forEach(button => {
          button.setAttribute('tabindex', '-1');
        });
        item.setAttribute('aria-hidden', 'true');
        item.setAttribute('tabindex', '-1');
      }
    });
    this.wasClicked = false;
  }

  linkToSlide(event) {
    event.preventDefault();
    const slideScrollPosition = this.slider.scrollLeft + this.sliderItemOffset * (this.sliderControlLinksArray.indexOf(event.currentTarget) + 1 - this.currentPage);
    this.slider.scrollTo({
      left: slideScrollPosition
    });
  }

  play() {
    this.autoplayButtonIsSetToPlay = true;
    this.autorotateTimer = setInterval(this.autoRotateSlides.bind(this), this.autoplaySpeed);
  }

  pause() {
    this.autoplayButtonIsSetToPlay = false;
    clearInterval(this.autorotateTimer);
  }

  applyAnimationToAnnouncementBar(direction = 'next') {
    if (!this.announcementBarSlider) return;

    const currentAnnouncement = this.announcementBarSlider.querySelector('[data-slide]:not(.announcement-bar-slider__message--invisible)');
    const nextAnnouncement = currentAnnouncement.nextElementSibling || this.announcementBarSlider.querySelector('.announcement-bar-slider__message');
    const previousAnnouncement = currentAnnouncement.previousElementSibling || this.announcementBarSlider.querySelector('.announcement-bar-slider__message:last-child');

    const announcementToHide = currentAnnouncement;
    const announcementToShow = direction === 'next' ? nextAnnouncement : previousAnnouncement;

    if (this.announcementBarAnimationDelay) clearTimeout(this.announcementBarAnimationDelay);

    announcementToHide.classList.add('announcement-bar-slider__message--invisible');

    this.announcementBarAnimationDelay = setTimeout(() => {
      announcementToShow.classList.remove('announcement-bar-slider__message--invisible');
    }, this.announcementBarAutorotateSpeed);
  }
}

customElements.define('slideshow-component', SlideshowComponent);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.removeErrorMessage();
    this.updateVariantStatuses();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;

    const mediaGalleries = document.querySelectorAll(`[id^="MediaGallery-"]`);
    mediaGalleries.forEach(mediaGallery => mediaGallery.setActiveMedia(`${this.dataset.section}-${this.currentVariant.featured_media.id}`, true));

    const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
    if (!modalContent) return;
    const newMediaModal = modalContent.querySelector( `[data-media-id="${this.currentVariant.featured_media.id}"]`);
    modalContent.prepend(newMediaModal);
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    if (!shareButton || !shareButton.updateUrl) return;
    shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(variant => this.querySelector(':checked').value === variant.option1);
    const inputWrappers = [...this.querySelectorAll('.product-form__input')];
    inputWrappers.forEach((option, index) => {
      if (index === 0) return;
      const optionInputs = [...option.querySelectorAll('input[type="radio"], option')]
      const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value;
      const availableOptionInputsValue = selectedOptionOneVariants.filter(variant => variant.available && variant[`option${index}`] === previousOptionSelected).map(variantOption => variantOption[`option${index + 1}`]);
      this.setInputAvailability(optionInputs, availableOptionInputsValue)
    });
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach(input => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        input.innerText = input.getAttribute('value');
      } else {
        input.innerText = window.variantStrings.unavailable_with_option.replace('[value]', input.getAttribute('value'));
      }
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  removeErrorMessage() {
    const section = this.closest('section');
    if (!section) return;

    const productForm = section.querySelector('product-form');
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    const requestedVariantId = this.currentVariant.id;
    const sectionId = this.dataset.originalSection || this.dataset.section;

    fetch(`${this.dataset.url}?variant=${requestedVariantId}&section_id=${sectionId}`)
      .then((response) => response.text())
      .then((responseText) => {
        // prevent unnecessary ui changes from abandoned requests
        if (this.currentVariant.id !== requestedVariantId) return;

        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(`price-${this.dataset.section}`);
        const source = html.getElementById(`price-${sectionId}`);
        const skuSource = html.getElementById(`Sku-${sectionId}`);
        const skuDestination = document.getElementById(`Sku-${this.dataset.section}`);
        const inventorySource = html.getElementById(`Inventory-${sectionId}`);
        const inventoryDestination = document.getElementById(`Inventory-${this.dataset.section}`);

        const volumePricingSource = html.getElementById(`Volume-${sectionId}`);

        const pricePerItemDestination = document.getElementById(`Price-Per-Item-${this.dataset.section}`);
        const pricePerItemSource = html.getElementById(`Price-Per-Item-${sectionId}`);

        const volumePricingDestination = document.getElementById(`Volume-${this.dataset.section}`);
        const qtyRules = document.getElementById(`Quantity-Rules-${this.dataset.section}`);
        const volumeNote = document.getElementById(`Volume-Note-${this.dataset.section}`);

        if (source && destination) destination.innerHTML = source.innerHTML;
        if (inventorySource && inventoryDestination) inventoryDestination.innerHTML = inventorySource.innerHTML;
        if (skuSource && skuDestination) {
          skuDestination.innerHTML = skuSource.innerHTML;
          skuDestination.classList.toggle('visibility-hidden', skuSource.classList.contains('visibility-hidden'));
        }

        if (volumePricingSource && volumePricingDestination) {
          volumePricingDestination.innerHTML = volumePricingSource.innerHTML;
        }

        if (pricePerItemSource && pricePerItemDestination) {
          pricePerItemDestination.innerHTML = pricePerItemSource.innerHTML;
          pricePerItemDestination.classList.toggle('visibility-hidden', pricePerItemSource.classList.contains('visibility-hidden'));
        }

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('visibility-hidden');

        if (inventoryDestination) inventoryDestination.classList.toggle('visibility-hidden', inventorySource.classList.contains('visibility-hidden'));

        const addButtonUpdated = html.getElementById(`ProductSubmitButton-${sectionId}`);
        this.toggleAddButton(addButtonUpdated ? addButtonUpdated.hasAttribute('disabled') : true, window.variantStrings.soldOut);

        publish(PUB_SUB_EVENTS.variantChange, {
          data: {
            sectionId,
            html,
            variant: this.currentVariant
          }
        });
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;

    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    const inventory = document.getElementById(`Inventory-${this.dataset.section}`);
    const sku = document.getElementById(`Sku-${this.dataset.section}`);
    const pricePerItem = document.getElementById(`Price-Per-Item-${this.dataset.section}`);
    const volumeNote = document.getElementById(`Volume-Note-${this.dataset.section}`);
    const volumeTable = document.getElementById(`Volume-${this.dataset.section}`);
    const qtyRules = document.getElementById(`Quantity-Rules-${this.dataset.section}`);

    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add('visibility-hidden');
    if (inventory) inventory.classList.add('visibility-hidden');
    if (sku) sku.classList.add('visibility-hidden');
    if (pricePerItem) pricePerItem.classList.add('visibility-hidden');
    if (volumeNote) volumeNote.classList.add('visibility-hidden');
    if (volumeTable) volumeTable.classList.add('visibility-hidden');
    if (qtyRules) qtyRules.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define('variant-selects', VariantSelects);

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  function focustrap(e) {
    if (e.code.toUpperCase() === 'TAB') {
      // If we only have 1 focusable element, just stay on it
      if (elements.length === 1) {
        e.preventDefault();
        return;
      }

      if (e.target === last && !e.shiftKey) {
        e.preventDefault();
        first.focus();
      }

      if (e.target === first && e.shiftKey) {
        e.preventDefault();
        last.focus();
      }
    }

    if (e.code.toUpperCase() === 'ESCAPE') {
      elementToFocus.focus();
    }
  }

  elementToFocus.focus();

  document.addEventListener('keydown', focustrap);
}

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('keydown', trapFocus);
  if (elementToFocus) elementToFocus.focus();
}

function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.pause());
  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('keydown', trapFocus);
  if (elementToFocus) elementToFocus.focus();
}

// Job Application Modal functionality
class JobApplicationModal {
  constructor() {
    this.modal = null;
    this.currentStep = 1;
    this.formData = {};
    this.init();
  }

  init() {
    // Create modal HTML structure
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    const modalHTML = `
      <div id="job-application-modal" class="job-modal" style="display: none;">
        <div class="job-modal-content">
          <div class="job-modal-header">
            <h2 class="job-modal-title">Apply for Position</h2>
            <button type="button" class="job-modal-close">&times;</button>
          </div>
          <div class="job-modal-body">
            <div class="job-step" id="step-1">
              <h3>Personal Information</h3>
              <form id="job-form-step-1">
                <div class="field">
                  <label for="full-name" class="field__label">Full Name *</label>
                  <input type="text" id="full-name" name="fullName" class="field__input" required>
                </div>
                <div class="field">
                  <label for="email" class="field__label">Email *</label>
                  <input type="email" id="email" name="email" class="field__input" required>
                </div>
                <div class="field">
                  <label for="phone" class="field__label">Phone *</label>
                  <input type="tel" id="phone" name="phone" class="field__input" required>
                </div>
                <div class="field">
                  <label for="role" class="field__label">Role Applying For *</label>
                  <select id="role" name="role" class="field__input" required>
                    <option value="">Select a role</option>
                    <option value="remote-driver">Remote Driver</option>
                    <option value="dispatch-assistant">Dispatch Assistant</option>
                  </select>
                </div>
                <div class="job-modal-actions">
                  <button type="button" class="button button--primary" onclick="jobModal.nextStep()">Next</button>
                </div>
              </form>
            </div>
            
            <div class="job-step" id="step-2" style="display: none;">
              <h3>Document Upload</h3>
              <form id="job-form-step-2">
                <div class="field">
                  <label for="resume" class="field__label">Resume/CV *</label>
                  <input type="file" id="resume" name="resume" class="field__input" accept=".pdf,.doc,.docx" required>
                </div>
                <div class="field">
                  <label for="government-id" class="field__label">Government ID (Photo) *</label>
                  <input type="file" id="government-id" name="governmentId" class="field__input" accept="image/*,.pdf" required>
                </div>
                <div class="job-modal-actions">
                  <button type="button" class="button button--secondary" onclick="jobModal.prevStep()">Back</button>
                  <button type="button" class="button button--primary" onclick="jobModal.nextStep()">Next</button>
                </div>
              </form>
            </div>
            
            <div class="job-step" id="step-3" style="display: none;">
              <h3>Consent & Verification</h3>
              <div class="job-summary">
                <p><strong>Application Summary:</strong></p>
                <div id="application-summary"></div>
              </div>
              <form id="job-form-step-3">
                <div class="field">
                  <label class="field__label">
                    <input type="checkbox" id="consent" name="consent" required>
                    I agree to background check and identity verification *
                  </label>
                </div>
                <div class="job-modal-actions">
                  <button type="button" class="button button--secondary" onclick="jobModal.prevStep()">Back</button>
                  <button type="button" class="button button--primary" onclick="jobModal.submitApplication()">Submit Application</button>
                </div>
              </form>
            </div>
            
            <div class="job-step" id="step-4" style="display: none;">
              <h3>Application Submitted</h3>
              <div class="job-success">
                <p>Thank you for your application! We've received your submission and will review it shortly.</p>
                <p>Please check your email for next steps regarding identity verification.</p>
                <div class="job-modal-actions">
                  <button type="button" class="button button--primary" onclick="jobModal.close()">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('job-application-modal');
  }

  bindEvents() {
    // Close modal events
    const closeBtn = this.modal.querySelector('.job-modal-close');
    closeBtn.addEventListener('click', () => this.close());
    
    // Close modal when clicking outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Bind apply buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('apply-now-btn')) {
        e.preventDefault();
        const jobTitle = e.target.dataset.jobTitle || 'Position';
        this.open(jobTitle);
      }
    });
  }

  open(jobTitle) {
    this.jobTitle = jobTitle;
    this.currentStep = 1;
    this.formData = {};
    this.showStep(1);
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
    this.resetForm();
  }

  showStep(step) {
    // Hide all steps
    this.modal.querySelectorAll('.job-step').forEach(stepEl => {
      stepEl.style.display = 'none';
    });
    
    // Show current step
    const currentStepEl = this.modal.querySelector(`#step-${step}`);
    if (currentStepEl) {
      currentStepEl.style.display = 'block';
    }
    
    this.currentStep = step;
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      this.saveCurrentStepData();
      if (this.currentStep === 3) {
        this.updateSummary();
      }
      this.showStep(this.currentStep + 1);
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.showStep(this.currentStep - 1);
    }
  }

  validateCurrentStep() {
    const currentForm = this.modal.querySelector(`#job-form-step-${this.currentStep}`);
    if (currentForm) {
      const requiredFields = currentForm.querySelectorAll('[required]');
      for (let field of requiredFields) {
        if (!field.value.trim()) {
          field.focus();
          alert('Please fill in all required fields.');
          return false;
        }
        if (field.type === 'email' && !this.validateEmail(field.value)) {
          field.focus();
          alert('Please enter a valid email address.');
          return false;
        }
      }
    }
    return true;
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  saveCurrentStepData() {
    const currentForm = this.modal.querySelector(`#job-form-step-${this.currentStep}`);
    if (currentForm) {
      const formData = new FormData(currentForm);
      for (let [key, value] of formData.entries()) {
        this.formData[key] = value;
      }
    }
  }

  updateSummary() {
    const summaryEl = this.modal.querySelector('#application-summary');
    const summary = `
      <p><strong>Name:</strong> ${this.formData.fullName}</p>
      <p><strong>Email:</strong> ${this.formData.email}</p>
      <p><strong>Phone:</strong> ${this.formData.phone}</p>
      <p><strong>Role:</strong> ${this.formData.role}</p>
      <p><strong>Resume:</strong> ${this.formData.resume ? this.formData.resume.name : 'Uploaded'}</p>
      <p><strong>Government ID:</strong> ${this.formData.governmentId ? this.formData.governmentId.name : 'Uploaded'}</p>
    `;
    summaryEl.innerHTML = summary;
  }

  submitApplication() {
    if (this.validateCurrentStep()) {
      this.saveCurrentStepData();
      
      // Here you would typically send the data to your server
      console.log('Submitting application:', this.formData);
      
      // Show success step
      this.showStep(4);
      
      // Optional: Send data to external form service
      // this.sendToExternalService();
    }
  }

  resetForm() {
    this.currentStep = 1;
    this.formData = {};
    this.modal.querySelectorAll('form').forEach(form => form.reset());
  }

  // Optional: Send to external service like Typeform, Tally, etc.
  sendToExternalService() {
    // Example integration with a webhook or API
    // fetch('/submit-application', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(this.formData)
    // });
  }
}

// Initialize job application modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.jobModal = new JobApplicationModal();
});

// Make global variables available
window.trapFocus = trapFocus;
window.removeTrapFocus = removeTrapFocus;
window.pauseAllMedia = pauseAllMedia;