import "./style.css";

// ===================================================
// 1. GLOBAL STATE MANAGEMENT
// ===================================================

const state = {
  wishlistCount: 0,
  wishlistItems: [],
  cartCount: 0,
};

function updateBadges() {
  const wishlistBadges = document.querySelectorAll(".wishlist-count");
  const cartBadges = document.querySelectorAll(".cart-count");

  // Wishlist Badge update
  wishlistBadges.forEach((badge) => {
    badge.textContent = state.wishlistCount;
    if (state.wishlistCount > 0) {
      badge.classList.remove("hidden");
      badge.classList.add("flex");
    } else {
      badge.classList.add("hidden");
      badge.classList.remove("flex");
    }
  });

  cartBadges.forEach((badge) => {
    badge.textContent = state.cartCount;
    if (state.cartCount > 0) {
      badge.classList.remove("hidden");
      badge.classList.add("flex");
    } else {
      badge.classList.add("hidden");
      badge.classList.remove("flex");
    }
  });
}

window.incrementCart = () => {
  state.cartCount++;
  updateBadges();
};

window.decrementCart = () => {
  if (state.cartCount > 0) state.cartCount--;
  updateBadges();
};

window.toggleWishlist = (event, productId) => {
  event.preventDefault();
  event.stopPropagation();
  const icon = event.currentTarget.querySelector("i");
  const index = state.wishlistItems.indexOf(productId);

  if (index === -1) {
    state.wishlistItems.push(productId);
    state.wishlistCount++;
    icon.className =
      "ri-heart-3-fill text-red-500 text-lg scale-110 transition-transform";
  } else {
    state.wishlistItems.splice(index, 1);
    state.wishlistCount--;
    icon.className = "ri-heart-3-fill text-white text-lg transition-colors";
  }

  updateBadges();
};
// ===================================================
// 4. SECTION INITIALIZATIONS
// ===================================================

async function initNavbar() {
  try {
    const response = await fetch("/data/nav-data.json");
    const data = await response.json();

    document.getElementById("desktop-brand-name").textContent = data.brand.name;
    document.getElementById("mobile-brand-name").textContent = data.brand.name;
    document.getElementById("user-name").textContent = data.user.name;
    document.getElementById("user-avatar").src = data.user.avatar;
    state.wishlistCount = data.counts.wishlist;
    state.cartCount = data.counts.cart;
    updateBadges();

    const categoryContainer = document.getElementById("desktop-categories");
    let categoryHTML = `
            <div class="flex items-center gap-1 text-[#f77f00] mr-2">
                <i class="ri-menu-line text-lg"></i>
            </div>
        `;

    data.categories.forEach((cat) => {
      categoryHTML += `
                <a href="${cat.link}" class="hover:text-[#f77f00] transition-colors">
                    ${cat.name}
                </a>
            `;
    });

    categoryContainer.innerHTML = categoryHTML;
    const pagesContainer = document.getElementById("desktop-pages");
    let pagesHTML = "";
    data.pages.forEach((page) => {
      const target = page.link.includes("http") ? 'target="_blank"' : "";
      pagesHTML += `
                <a href="${page.link}" ${target} class="hover:text-[#f77f00] transition-colors">
                    ${page.name}
                </a>
            `;
    });
    pagesContainer.innerHTML = pagesHTML;
    if (window.refreshCursorHover) window.refreshCursorHover();
  } catch (error) {
    console.error(error);
  }
}

async function initHeroSection() {
  try {
    const response = await fetch("/data/hero-data.json");
    const data = await response.json();
    const sliderContainer = document.getElementById("hero-slider");
    const dotsContainer = document.getElementById("slider-dots");
    let sliderHTML = "";
    let dotsHTML = "";

    data.primarySlider.forEach((slide, index) => {
      sliderHTML += `
                <a href="${slide.link}" class="min-w-full h-full block relative cursor-pointer snap-center shrink-0">
                <img src="${slide.image}" alt="${slide.alt}" class="w-full h-full object-cover" loading="lazy">
                </a>
            `;
      dotsHTML += `
                <button class="dot-btn h-2 w-2 rounded-full transition-all duration-300 ${index === 0 ? "bg-[#f77f00] w-6" : "bg-white/60"}" data-index="${index}"></button>
            `;
    });

    sliderContainer.innerHTML = sliderHTML;
    if (dotsContainer) dotsContainer.innerHTML = dotsHTML;

    const totalSlides = data.primarySlider.length;
    const dots = dotsContainer ? document.querySelectorAll(".dot-btn") : [];

    sliderContainer.addEventListener("scroll", () => {
      const currentSlideIndex = Math.round(
        sliderContainer.scrollLeft / sliderContainer.clientWidth,
      );
      dots.forEach((dot, idx) => {
        dot.className = `
                dot-btn h-2 w-2 rounded-full transition-all duration-300 ${idx === currentSlideIndex ? "bg-[#f77f00] w-6" : "bg-white/60"}
                `;
      });
    });

    let autoSlideCurrent = 0;
    setInterval(() => {
      autoSlideCurrent = (autoSlideCurrent + 1) % totalSlides;
      if (sliderContainer) {
        sliderContainer.scrollTo({
          left: sliderContainer.clientWidth * autoSlideCurrent,
          behavior: "smooth",
        });
      }
    }, 4000);

    const videoElement = document.getElementById("hero-video");
    const videoLinkElement = document.getElementById("hero-video-link");
    if (videoElement && videoLinkElement) {
      videoElement.src = data.heroVideo.videoUrl;
      videoLinkElement.href = data.heroVideo.link;
    }
    const desktopBannerContainer = document.getElementById(
      "desktop-secondary-banners",
    );
    const mobileSecondaryContainer = document.getElementById(
      "mobile-secondary-banners",
    );
    let desktopHTML = "";
    let mobileHTML = "";

    data.secondaryBanners.forEach((banner) => {
      desktopHTML += `
        <a href="${banner.link}" class="group relative rounded-2xl overflow-hidden h-[160px] shadow-sm block cursor-pointer bg-gray-100">
            <img src="${banner.image}" alt="Banner" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
            <div class="absolute bottom-4 right-4 h-8 w-8 glass-btn z-10 shadow-lg">
                <i class="ri-arrow-right-up-line text-sm"></i>
            </div>
        </a>
    `;

      mobileHTML += `
        <a href="${banner.link}" class="relative rounded-2xl overflow-hidden h-[130px] w-[85%] shrink-0 snap-center shadow-sm block bg-gray-100">
            <img src="${banner.image}" alt="Banner" class="w-full h-full object-cover" loading="lazy">
          <div class="absolute bottom-3 right-3 h-7 w-7 glass-btn z-10">
    <i class="ri-arrow-right-up-line text-xs"></i>
</div>    
            </a>
    `;
    });

    if (desktopBannerContainer) desktopBannerContainer.innerHTML = desktopHTML;
    if (mobileSecondaryContainer)
      mobileSecondaryContainer.innerHTML = mobileHTML;

    if (window.refreshCursorHover) window.refreshCursorHover();
  } catch (error) {
    console.error(error);
  }
}

async function initCategoriesSection() {
  try {
    const response = await fetch("/data/categories-data.json");
    const data = await response.json();
    const filterContainer = document.getElementById("category-filters");
    const cardsContainer = document.getElementById("category-cards-container");
    let activeCategory = "All";

    function renderFilters() {
      let filtersHTML = "";
      data.filters.forEach((filter) => {
        const isActive = filter === activeCategory;
        const activeClasses = isActive
          ? "bg-[#f77f00] text-[#FAF9F5] border-[#f77f00]"
          : "bg-white text-gray-600 border-gray-200 hover:border-[#f77f00] hover:text-[#f77f00]";

        filtersHTML += `
            <button class="category-filter-btn px-4 py-1.5 rounded-full border text-xs md:text-sm font-medium transition-all duration-300 shrink-0 ${activeClasses}" data-category="${filter}">${filter}</button>
        `;
      });

      filterContainer.innerHTML = filtersHTML;
      document.querySelectorAll(".category-filter-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          activeCategory = e.target.getAttribute("data-category");
          renderFilters();
          renderCards();
        });
      });
    }

    function renderCards() {
      let cardsHTML = "";
      const filteredItems =
        activeCategory === "All"
          ? data.items
          : data.items.filter((item) => item.category === activeCategory);
      if (filteredItems.length === 0) {
        cardsContainer.innerHTML = `
            <p class="text-gray-500 text-center w-full py-6">No categories found.</p>
        `;
        return;
      }

      filteredItems.forEach((item) => {
        cardsHTML += `
            <a href="${item.link}" class="group relative rounded-2xl overflow-hidden h-[130px] md:h-[160px] w-[85%] md:w-[280px] shrink-0 snap-center shadow-sm block cursor-pointer bg-gray-100">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">

                <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>

                <div class="absolute bottom-3 left-3 bg-white/30 backdrop-blur-md border border-white/40 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    ${item.title}
                </div>
            </a>
        `;
      });
      cardsContainer.style.opacity = "0";
      setTimeout(() => {
        cardsContainer.innerHTML = cardsHTML;
        cardsContainer.style.transition = "opacity 0.3s ease";
        cardsContainer.style.opacity = "1";
        cardsContainer.scrollTo({ left: 0, behavior: "smooth" });
        if (window.refreshCursorHover) window.refreshCursorHover();
      }, 150);
    }
    renderFilters();
    renderCards();
  } catch (error) {
    console.error(error);
  }
}

async function initNewCollection() {
  try {
    const response = await fetch("/data/new-collection.json");

    const data = await response.json();
    const filtersContainer = document.getElementById("collection-filters");
    const gridContainer = document.getElementById("collection-grid");

    if (!filtersContainer || !gridContainer) return;

    let activeCollectionFilter = "All";

    function renderCollectionFilters() {
      let filtersHTML = "";
      data.filters.forEach((filter) => {
        const isActive = filter === activeCollectionFilter;
        const activeClasses = isActive
          ? "bg-[#f77f00] text-[#FAF9F5] border-[#f77f00]"
          : "bg-white text-gray-600 border-gray-200 hover:border-[#f77f00] hover:text-[#f77f00]";
        filtersHTML += `
                    <button class="collection-filter-btn px-4 py-1.5 rounded-full border text-xs md:text-sm font-medium transition-all duration-300 shrink-0 ${activeClasses}" data-filter="${filter}">${filter}</button>
                `;
      });

      filtersContainer.innerHTML = filtersHTML;

      document.querySelectorAll(".collection-filter-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          activeCollectionFilter = e.target.getAttribute("data-filter");
          renderCollectionFilters();
          renderProducts();
        });
      });
    }

    function renderProducts() {
      let productsHTML = "";
      const filteredProducts =
        activeCollectionFilter === "All"
          ? data.products
          : data.products.filter(
              (item) => item.category === activeCollectionFilter,
            );

      if (filteredProducts.length === 0) {
        gridContainer.innerHTML = `<p class="text-gray-500 text-center w-full col-span-full py-6">No products found.</p>`;
        return;
      }

      filteredProducts.forEach((product) => {
        const isWished =
          window.state && window.state.wishlistItems
            ? window.state.wishlistItems.includes(product.id)
            : false;
        const heartClass = isWished
          ? "ri-heart-3-fill text-red-500"
          : "ri-heart-3-fill text-white";

        productsHTML += `
                    <a href="${product.link}" class="group block cursor-pointer">
                        <div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 mb-3 shadow-sm">
                            <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                            <button onclick="toggleWishlist(event, '${product.id}')" class="absolute top-3 right-3 h-8 w-8 bg-white/30 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center shadow-md z-10 transition-transform active:scale-90 glass-btn">
                                <i class="${heartClass} text-lg transition-colors duration-300"></i>
                            </button>
                        </div>
                        <div class="flex flex-col px-1">
                            <span class="text-[10px] md:text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">${product.brand}</span>
                            <h3 class="text-xs md:text-sm font-medium text-gray-800 leading-snug line-clamp-2 mb-1.5 group-hover:text-[#f77f00] transition-colors">${product.title}</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm md:text-base font-bold text-[#f77f00]">₹${product.sellPrice}</span>
                                <span class="text-[10px] md:text-xs text-gray-400 line-through">₹${product.oldPrice}</span>
                            </div>
                        </div>
                    </a>
                `;
      });

      gridContainer.style.opacity = "0";
      setTimeout(() => {
        gridContainer.innerHTML = productsHTML;
        gridContainer.style.transition = "opacity 0.3s ease";
        gridContainer.style.opacity = "1";
        if (window.refreshCursorHover) window.refreshCursorHover();
      }, 150);
    }

    //

    renderCollectionFilters();
    renderProducts();
  } catch (error) {
    console.error("New Collection Fetch Error:", error);
  }
}

async function initOurProducts() {
  try {
    const response = await fetch("/data/our-products.json");
    const data = await response.json();
    const filtersContainer = document.getElementById("products-filters");
    const gridContainer = document.getElementById("products-grid");

    if (!filtersContainer || !gridContainer) return;

    let activeProductFilter = "All";

    function renderProductFilters() {
      let filtersHTML = "";
      data.filters.forEach((filter) => {
        const isActive = filter === activeProductFilter;
        const activeClasses = isActive
          ? "bg-[#f77f00] text-[#FAF9F5] border-[#f77f00]"
          : "bg-white text-gray-600 border-gray-200 hover:border-[#f77f00] hover:text-[#f77f00]";

        filtersHTML += `
                    <button class="product-filter-btn px-4 py-1.5 rounded-full border text-xs md:text-sm font-medium transition-all duration-300 shrink-0 ${activeClasses}" data-filter="${filter}">${filter}</button>
                `;
      });
      filtersContainer.innerHTML = filtersHTML;

      document.querySelectorAll(".product-filter-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          activeProductFilter = e.target.getAttribute("data-filter");
          renderProductFilters();
          renderProducts();
        });
      });
    }

    function renderProducts() {
      let productsHTML = "";
      const filteredProducts =
        activeProductFilter === "All"
          ? data.products
          : data.products.filter(
              (item) => item.category === activeProductFilter,
            );

      if (filteredProducts.length === 0) {
        gridContainer.innerHTML = `<p class="text-gray-500 text-center w-full col-span-full py-6">No products found.</p>`;
        return;
      }

      filteredProducts.forEach((product) => {
        const isWished =
          window.state && window.state.wishlistItems
            ? window.state.wishlistItems.includes(product.id)
            : false;
        const heartClass = isWished
          ? "ri-heart-3-fill text-red-500"
          : "ri-heart-3-fill text-white";

        productsHTML += `
                    <a href="${product.link}" class="group block cursor-pointer">
                        <div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 mb-3 shadow-sm">
                            <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                            <button onclick="toggleWishlist(event, '${product.id}')" class="absolute top-3 right-3 h-8 w-8 bg-white/30 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center shadow-md z-10 transition-transform active:scale-90 glass-btn">
                                <i class="${heartClass} text-lg transition-colors duration-300"></i>
                            </button>
                        </div>
                        <div class="flex flex-col px-1">
                            <span class="text-[10px] md:text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">${product.brand}</span>
                            <h3 class="text-xs md:text-sm font-medium text-gray-800 leading-snug line-clamp-2 mb-1.5 group-hover:text-[#f77f00] transition-colors">${product.title}</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm md:text-base font-bold text-[#f77f00]">₹${product.sellPrice}</span>
                                <span class="text-[10px] md:text-xs text-gray-400 line-through">₹${product.oldPrice}</span>
                            </div>
                        </div>
                    </a>
                `;
      });

      gridContainer.style.opacity = "0";
      setTimeout(() => {
        gridContainer.innerHTML = productsHTML;
        gridContainer.style.transition = "opacity 0.3s ease";
        gridContainer.style.opacity = "1";
        if (window.refreshCursorHover) window.refreshCursorHover();
      }, 150);
    }

    renderProductFilters();
    renderProducts();
  } catch (error) {
    console.error("Products Error:", error);
  }
}

async function initNewsletter() {
  try {
    const response = await fetch("/data/newsletter.json");
    const data = await response.json();
    const video = document.getElementById("newsletter-video");
    const container = document.getElementById("newsletter-container");

    if (video) video.src = data.backgroundVideo;

    document.getElementById("newsletter-heading").textContent = data.heading;
    document.getElementById("newsletter-subheading").textContent =
      data.subheading;
    document.getElementById("newsletter-input").placeholder = data.placeholder;
    document.getElementById("newsletter-btn-text").textContent =
      data.buttonText;
    if (video && container) {
      window.addEventListener("scroll", () => {
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrollProgress =
            (windowHeight - rect.top) / (windowHeight + rect.height);
          const yOffset = -(scrollProgress * 25);
          video.style.transform = `translateY(${yOffset}%)`;
        }
      });
    }

    if (window.refreshCursorHover) window.refreshCursorHover();
  } catch (error) {
    console.error(error);
  }
}

async function initFooter() {
  try {
    const response = await fetch("/data/footer.json");
    const data = await response.json();
    const primaryContainer = document.getElementById("footer-primary");

    let socialHTML = "";
    data.socials.forEach((social) => {
      socialHTML += `
                <a href="${social.link}" target="_blank" class="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-[#f77f00] hover:border-[#f77f00] hover:-translate-y-1 hover:text-white transition-all duration-300 shadow-sm">
                    <i class="${social.icon} text-lg"></i>
                </a>
            `;
    });

    let catHTML = "";
    data.categories.forEach((cat) => {
      catHTML += `
                <li>
                    <a href="${cat.link}" class="text-gray-600 hover:text-[#f77f00] hover:translate-x-1 inline-block transition-transform duration-300 text-sm">${cat.name}</a>
                </li>
            `;
    });

    let legalHTML = "";
    data.legal.forEach((link) => {
      legalHTML += `
        <li>
            <a href="${link.link}" class="text-gray-600 hover:text-[#f77f00] hover:translate-x-1 inline-block transition-transform duration-300 text-sm">${link.name}</a>
        </li>
    `;
    });

    primaryContainer.innerHTML = `
<div>
    <h3 class="text-2xl font-black text-gray-900 mb-4 tracking-tight">Dukaan</h3>

    <p class="text-gray-600 text-sm leading-relaxed mb-6 pr-4">${data.about.description}</p>

    <div class="flex gap-3">${socialHTML}</div>
</div>

<div>
    <h4 class="text-gray-900 font-bold mb-5 uppercase tracking-wider text-sm">All Categories</h4>

    <ul class="space-y-3">${catHTML}</ul>
</div>

<div>
    <h4 class="text-gray-900 font-bold mb-5 uppercase tracking-wider text-sm">Legal & Help</h4>

    <ul class="space-y-3">${legalHTML}</ul>
</div>

<div>
    <h4 class="text-gray-900 font-bold mb-5 uppercase tracking-wider text-sm">Contact Us</h4>

    <ul class="space-y-4 text-sm text-gray-600">
        <li class="flex items-center gap-3">
            <i class="ri-mail-send-line text-[#f77f00] text-xl"></i>
            ${data.about.email}
        </li>

        <li class="flex items-center gap-3">
            <i class="ri-customer-service-2-line text-[#f77f00] text-xl"></i>
            ${data.about.phone}
        </li>
    </ul>
</div>
`;

    document.getElementById("footer-map-container").innerHTML = `
            <iframe src="${data.mapEmbed}" class="w-full h-full border-0 grayscale transition-all duration-700 hover:grayscale-0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

            <div class="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-2xl"></div>
        `;

    document.getElementById("footer-copyright").textContent = data.copyright;

    if (window.refreshCursorHover) window.refreshCursorHover();
  } catch (error) {
    console.error(error);
  }
}
// ===================================================
// 5. APPLICATION BOOT
// ===================================================

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHeroSection();
  initCategoriesSection();
  initNewCollection();
  initOurProducts();
  initNewsletter();
  initFooter();
});
