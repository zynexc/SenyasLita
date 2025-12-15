  // Video view toggler + modal + accordion logic
(function () {
  const DEFAULT_FRONT = 'front-view.mp4';
  const DEFAULT_SIDE = 'side-view.mp4';
  const categoryGrid = document.getElementById('category-grid');
  const detailSection = document.getElementById('category-detail');
  const detailTitle = document.getElementById('detail-title');
  const backBtn = document.getElementById('back-to-categories');
  const searchInput = document.getElementById('category-search');
  const signButtons = document.querySelectorAll('.sign-btn');
  const signsListItems = document.querySelectorAll('.signs-list-item');

  // Tabs inside modal
  function setupTabs(context) {
    const tabGroups = context.querySelectorAll('[data-tab-group]');
    tabGroups.forEach((group) => {
      const buttons = group.querySelectorAll('.tab');
      const video = context.querySelector('video[data-view]');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          buttons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const view = btn.dataset.view;
          if (video) {
            const frontSrc = modal?.dataset.frontSrc || DEFAULT_FRONT;
            const sideSrc = modal?.dataset.sideSrc || DEFAULT_SIDE;
            video.src = view === 'front' ? frontSrc : sideSrc;
            // ensure controls are hidden
            video.controls = false;
            video.loop = true;
            video.autoplay = true;
            video.play().catch(() => {});
          }
        });
      });
    });
  }

  const modal = document.getElementById('sign-modal');
  const modalTitle = document.getElementById('modal-sign-title');
  const modalName = document.getElementById('modal-sign-name');
  const modalDesc = document.getElementById('modal-sign-desc');
  const modalClose = modal?.querySelector('.close-modal');

  function openModal(button) {
    if (!modal) return;
    const signName = button.dataset.sign;
    const frontSrc = button.dataset.front || DEFAULT_FRONT;
    const sideSrc = button.dataset.side || DEFAULT_SIDE;

    modal.setAttribute('aria-hidden', 'false');
    modalTitle.textContent = signName;
    modalName.textContent = signName;
    // set per-video description (falls back to placeholder)
    if (modalDesc) modalDesc.textContent = button.dataset.desc || 'Put the description or guide for the gesture here.';
    modal.dataset.frontSrc = frontSrc;
    modal.dataset.sideSrc = sideSrc;

    const tabButtons = modal.querySelectorAll('.tab');
    tabButtons.forEach((btn) => btn.classList.remove('active'));
    tabButtons[0]?.classList.add('active');
    const video = modal.querySelector('video[data-view]');
    if (video) {
      video.src = frontSrc;
      // ensure controls are hidden for all modal videos
      video.controls = false;
      video.load();
      video.loop = true;
      video.autoplay = true;
      video.play().catch(() => {});
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    const video = modal.querySelector('video[data-view]');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    document.body.style.overflow = '';
  }

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Sign buttons
  document.querySelectorAll('.sign-btn').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn));
  });

  // Ensure every sign button has a description attribute (so each video can
  // show a different guide). User can replace these in HTML later.
  document.querySelectorAll('.sign-btn').forEach((b) => {
    if (!b.dataset.desc) b.dataset.desc = 'Put the description or guide for the gesture here.';
  });
  // Example: set a specific description for Siyam (Nine)
  const siyamBtn = Array.from(document.querySelectorAll('.sign-btn')).find((b) => b.dataset.sign && b.dataset.sign.toLowerCase().includes('siyam'));
  if (siyamBtn) siyamBtn.dataset.desc = 'Number after eight.';

  // Category view handling
  const categoryCards = document.querySelectorAll('.category-card');

  function hideAllLists() {
    signsListItems.forEach((item) => {
      item.style.display = 'none';
    });
  }

  // Ensure all individual sign buttons are visible (clear inline styles)
  function resetSignButtonsVisibility() {
    document.querySelectorAll('.sign-btn').forEach((btn) => {
      btn.style.display = '';
    });
  }


  function showCategory(category, label) {
    hideAllLists();
    const match = Array.from(signsListItems).find(
      (item) => item.dataset.category === category
    );
    if (match) {
      // restore any hidden sign buttons from previous search
      match.querySelectorAll('.sign-btn').forEach((b) => (b.style.display = ''));
      match.style.display = '';
    }
    detailTitle.textContent = label;
    detailSection?.classList.remove('hidden');
    categoryGrid?.classList.add('hidden');
    detailSection?.scrollIntoView({ behavior: 'smooth' });
  }

  categoryCards.forEach((card) => {
    card.addEventListener('click', () =>
      showCategory(card.dataset.category, card.textContent.trim())
    );
  });

  function resetToCategoryView() {
    if (searchInput) searchInput.value = '';
    detailSection?.classList.add('hidden');
    categoryGrid?.classList.remove('hidden');
    hideAllLists();
    // restore any hidden sign buttons so categories show full lists again
    resetSignButtonsVisibility();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backBtn?.addEventListener('click', resetToCategoryView);

  function filterSigns(query) {
    const q = query.trim().toLowerCase();
    let hasResults = false;

    signsListItems.forEach((item) => {
      const buttons = item.querySelectorAll('.sign-btn');
      let match = false;
      buttons.forEach((btn) => {
        const text = btn.textContent.toLowerCase();
        const isMatch = text.includes(q);
        btn.style.display = isMatch ? '' : 'none';
        if (isMatch) match = true;
      });

      if (match) {
        item.style.display = '';
        hasResults = true;
      } else {
        item.style.display = 'none';
      }
    });

    if (q) {
      detailTitle.textContent = hasResults
        ? 'Search results'
        : 'No results found';
      categoryGrid?.classList.add('hidden');
      detailSection?.classList.remove('hidden');
    } else {
      // Reset to default category grid view
      categoryCards.forEach((card) => (card.style.display = ''));
      detailSection?.classList.add('hidden');
      categoryGrid?.classList.remove('hidden');
      hideAllLists();
      // clear any inline hiding applied to sign buttons
      resetSignButtonsVisibility();
    }
  }
  // Search filter for categories
  searchInput?.addEventListener('input', (e) => filterSigns(e.target.value));

  // Initialize tabs in modal
  setupTabs(document);

  // Start with categories view only
  hideAllLists();
})();

