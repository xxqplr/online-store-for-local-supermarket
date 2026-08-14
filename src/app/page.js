"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShoppingBasket,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Check,
  Globe,
  Package,
  Droplets,
  Milk,
  ArrowRight,
  AlertTriangle,
  Sun,
  Moon,
   ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const ICONS = { Package, Droplets, Milk };

function categoryLabel(categoriesList, slug, isRTL) {
  // Safety check to ensure categoriesList is an array and slug is a string
  if (!Array.isArray(categoriesList) || typeof slug !== "string") {
    return String(slug);
  }
  const found = categoriesList.find((c) => c.slug === slug);
  if (found) return isRTL ? found.nameAr : found.nameEn;
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/_/g, " ");
}

const translations = {
  ar: {
    storeName: "كوخ المونة ماركت",
    tagline: "قارن ... ووفر",
    heroSub: "اطلب مونة بيتك بسهولة، وفريقنا بيتواصل معك خلال دقائق لتأكيد الطلب والتوصيل.",
    ctaShop: "تسوّق الآن",
    badgeCOD: "الدفع عند الاستلام",
    badgeNoAccount: "بدون تسجيل دخول",
    badgeDelivery: "توصيل سريع لباب البيت",
    productsTitle: "منتجاتنا",
    categoriesLabel: "الأقسام",
    sortLabel: "الترتيب",
    sortDefault: "الترتيب ",
    sortPriceAsc: "السعر: من الأقل للأعلى",
    sortPriceDesc: "السعر: من الأعلى للأقل",
    allCategories: "الكل",
    noProducts: "ما في منتجات بهاد القسم حاليًا",
    addToCart: "أضف للسلة",
    added: "تمت الإضافة",
    cartTitle: "سلة التسوق",
    emptyCart: "السلة فارغة",
    emptyCartSub: "أضف منتجات لتبدأ طلبك",
    subtotal: "المجموع",
    checkout: "إتمام الطلب",
    remove: "حذف",
    backToShop: "متابعة التسوق",
    checkoutTitle: "إتمام الطلب",
    orderSummary: "ملخص الطلب",
    total: "الإجمالي",
    nameLabel: "الاسم الكامل",
    namePlaceholder: "مثال: أحمد الفلاني",
    phoneLabel: "رقم الهاتف",
    phonePlaceholder: "07xxxxxxxx",
    confirmOrder: "تأكيد الطلب",
    submittingOrder: "جارٍ الإرسال...",
    submitError: "صار في مشكلة بالإرسال، حاول مرة ثانية.",
    checkoutNote: "بعد إرسال الطلب، فريقنا بيتصل فيك خلال دقائق لتأكيد التفاصيل. الدفع نقدًا عند الاستلام.",
    errorName: "الرجاء إدخال الاسم",
    errorPhone: "الرجاء إدخال رقم هاتف صحيح",
    confirmedTitle: "تم استلام طلبك!",
    confirmedBody: "رح نتواصل معك قريبًا على الرقم اللي تركته لتأكيد التفاصيل والتوصيل.",
    orderNumberLabel: "رقم الطلب",
    backToShopBtn: "العودة للمتجر",
    currency: "د.ا",


    notesLabel: "ملاحظات إضافية (اختياري)",
    notesPlaceholder: "أي ملاحظات خاصة بالتوصيل أو الطلب...",

  },


  en: {
    storeName: "Kokh Al-Mouna Market",
    tagline: "Compare & Save",
    heroSub: "Order your household essentials in minutes — we'll call to confirm your order and delivery.",
    ctaShop: "Shop now",
    badgeCOD: "Cash on delivery",
    badgeNoAccount: "No account needed",
    badgeDelivery: "Fast delivery to your door",
    productsTitle: "Our Products",
    categoriesLabel: "Categories",
    sortLabel: "Sort",
    sortDefault: "Default",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    allCategories: "All",
    noProducts: "No products in this category yet",
    addToCart: "Add to cart",
    added: "Added",
    cartTitle: "Your Cart",
    emptyCart: "Your cart is empty",
    emptyCartSub: "Add products to start your order",
    subtotal: "Subtotal",
    checkout: "Checkout",
    remove: "Remove",
    backToShop: "Continue shopping",
    checkoutTitle: "Checkout",
    orderSummary: "Order summary",
    total: "Total",
    nameLabel: "Full name",
    namePlaceholder: "e.g. Ahmad Ali",
    phoneLabel: "Phone number",
    phonePlaceholder: "07xxxxxxxx",
    confirmOrder: "Confirm order",
    submittingOrder: "Sending...",
    submitError: "Something went wrong sending your order. Please try again.",
    checkoutNote: "After you submit, we'll call within minutes to confirm the details. Cash on delivery.",
    errorName: "Please enter your name",
    errorPhone: "Please enter a valid phone number",
    confirmedTitle: "Order received!",
    confirmedBody: "We'll contact you shortly at the number you provided to confirm the details and delivery.",
    orderNumberLabel: "Order number",
    backToShopBtn: "Back to shop",
    currency: "JD",

    notesLabel: "Order Notes (Optional)",
    notesPlaceholder: "Any special instructions or delivery details...",
  },
};

function ProductImage({ product, isRTL, size = 96, fill = false }) {
  const Icon = ICONS[product.icon] || Package;
  const tintBg =
    product.tint === "red"
      ? "linear-gradient(135deg, var(--brand-red), var(--brand-red-dark))"
      : "linear-gradient(135deg, var(--brand-gold), #D99A03)";
  return (
    <div
      className="rounded-xl flex items-center justify-center overflow-hidden shrink-0"
      style={{
        height: size,
        width: fill ? "100%" : size,
        background: product.imageUrl ? "#F5F5F5" : tintBg,
        border: product.imageUrl ? "1px solid var(--border-color)" : "none",
      }}
    >
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.imageUrl}
          alt={isRTL ? product.nameAr : product.nameEn}
          className="w-full h-full object-contain p-2 rounded-lg"
        />
      ) : (
        <Icon size={size >= 96 ? 40 : 22} color="white" strokeWidth={1.7} />
      )}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState("ar");
  const [theme, setTheme] = useState("light");
  const [themeHydrated, setThemeHydrated] = useState(false);
  const [page, setPage] = useState("shop");
  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastId, setToastId] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const [bump, setBump] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 30;
  const prevCount = useRef(0);

const [notes, setNotes] = useState("");




  const t = translations[lang];
  const isRTL = lang === "ar";

  const cartItems = cart
    .map((ci) => ({ ...ci, product: products.find((p) => p.id === ci.id) }))
    .filter((i) => i.product);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);

  const presentCategories =
    categories.length > 0
      ? categories
          .map((c) => c.slug)
          .concat([...new Set(products.map((p) => p.category))].filter((c) => !categories.some((cat) => cat.slug === c)))
      : [...new Set(products.map((p) => p.category))];

  const filteredProducts = (selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory))
    .slice()
    .sort((a, b) => {
      if (sortOrder === "price_asc") return a.price - b.price;
      if (sortOrder === "price_desc") return b.price - a.price;
      return 0;
    });

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });
      if (!error && data) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            nameAr: p.name_ar,
            nameEn: p.name_en,
            sizeAr: p.size_ar,
            sizeEn: p.size_en,
            price: Number(p.price),
            originalPrice: p.original_price != null ? Number(p.original_price) : null,
            icon: p.icon,
            tint: p.tint,
            category: p.category || "pantry",
            imageUrl: p.image_url || null,
          }))
        );
      }
      setProductsLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (!error && data) {
        setCategories(data.map((c) => ({ slug: c.slug, nameAr: c.name_ar, nameEn: c.name_en })));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kokh-almouna-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("kokh-almouna-cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart, hydrated]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kokh-almouna-theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    } catch (e) {}
    setThemeHydrated(true);
  }, []);


useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortOrder]);





  useEffect(() => {
    if (!themeHydrated) return;
    try {
      localStorage.setItem("kokh-almouna-theme", theme);
    } catch (e) {}
  }, [theme, themeHydrated]);

  useEffect(() => {
    if (cartCount !== prevCount.current) {
      setBump(true);
      const id = setTimeout(() => setBump(false), 350);
      prevCount.current = cartCount;
      return () => clearTimeout(id);
    }
  }, [cartCount]);

  const addToCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id, qty: 1 }];
    });
    setToastId(id);
    setTimeout(() => setToastId((cur) => (cur === id ? null : cur)), 1000);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = t.errorName;
    if (!phone.trim() || phone.trim().replace(/\D/g, "").length < 7) e.phone = t.errorPhone;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitOrder = async () => {
    if (!validate()) return;
    setSubmitError(false);
    setSubmitting(true);

    const orderNumber = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const itemsPayload = cartItems.map((i) => ({
      id: i.product.id,
      name_ar: i.product.nameAr,
      name_en: i.product.nameEn,
      qty: i.qty,
      price: i.product.price,
    }));

    const { error } = await supabase.from("orders").insert({
      order_number: orderNumber,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      notes: notes.trim(),
      items: itemsPayload,
      total: cartTotal,
    });
    setNotes("");

    setSubmitting(false);

    if (error) {
      setSubmitError(true);
      return;
    }

    setOrder({ name, phone, items: cartItems, total: cartTotal, number: orderNumber });
    setCart([]);
    setName("");
    setPhone("");
    setCartOpen(false);
    setPage("confirmation");
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      lang={lang}
      data-theme={theme}
      className="min-h-screen w-full flex flex-col"
      style={{ background: "var(--brand-bg)", color: "var(--text-primary)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur border-b"
        style={{ background: "var(--surface-alt)", borderColor: "var(--border-color)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <button onClick={() => setPage("shop")} className="flex items-center gap-2.5 btn-press">
            <span
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{ width: 40, height: 40, background: "linear-gradient(135deg, var(--brand-red), var(--brand-gold))" }}
            >
              <ShoppingBasket size={22} color="white" strokeWidth={2.3} />
            </span>
            <span className="flex flex-col items-start text-start leading-tight">
              <span className="font-extrabold text-base">{t.storeName}</span>
              <span className="text-xs font-semibold" style={{ color: "var(--brand-red)" }}>
                {t.tagline}
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="flex items-center justify-center rounded-full btn-press scale-hover"
              style={{ width: 38, height: 38, border: "1px solid var(--border-strong)" }}
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setLang(isRTL ? "en" : "ar")}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold btn-press scale-hover"
              style={{ border: "1px solid var(--border-strong)" }}
              aria-label="Toggle language"
            >
              <Globe size={16} />
              {isRTL ? "EN" : "AR"}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center rounded-full btn-press scale-hover"
              style={{ width: 42, height: 42, background: "var(--brand-charcoal)" }}
              aria-label={t.cartTitle}
            >
              <ShoppingCart size={19} color="white" />
              {cartCount > 0 && (
                <span
                  className={`absolute -top-1.5 flex items-center justify-center rounded-full text-xs font-bold text-white ${bump ? "pop" : ""}`}
                  style={{ [isRTL ? "left" : "right"]: -4, minWidth: 19, height: 19, background: "var(--brand-red)", padding: "0 4px" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category bar — mobile/tablet only, replaced by the sidebar on desktop */}
        {page === "shop" && products.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-3 overflow-x-auto md:hidden">
            <div className="flex items-center gap-2 w-max">
              <button
                onClick={() => setSelectedCategory("all")}
                className="shrink-0 rounded-full px-4 py-2 text-xs font-bold btn-press"
                style={
                  selectedCategory === "all"
                    ? { background: "var(--brand-red)", color: "white" }
                    : { background: "var(--surface)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }
                }
              >
                {t.allCategories}
              </button>
              {presentCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className="shrink-0 rounded-full px-4 py-2 text-xs font-bold btn-press"
                  style={
                    selectedCategory === c
                      ? { background: "var(--brand-red)", color: "white" }
                      : { background: "var(--surface)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }
                  }
                >
                  {/* FIX: Passed 'categories' as the first argument */}
                  {categoryLabel(categories, c, isRTL)}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4">
        {page === "shop" && (
          <>
            {/* Hero */}
            <section
              className="mt-5 rounded-3xl px-6 py-10 sm:px-10 sm:py-14 text-white fade-up relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, var(--brand-red), var(--brand-red-dark))" }}
            >
              <div className="relative z-10 max-w-md">
                <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">{t.tagline}</h1>
                <p className="text-sm sm:text-base opacity-90 leading-relaxed mb-6">{t.heroSub}</p>
                <button
                  onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold text-sm btn-press"
                  style={{ background: "var(--brand-gold)", color: "var(--brand-charcoal)" }}
                >
                  {t.ctaShop}
                  <ArrowRight size={16} style={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
                </button>
                <div className="flex flex-wrap gap-2 mt-7">
                  {[t.badgeCOD, t.badgeNoAccount, t.badgeDelivery].map((b) => (
                    <span key={b} className="text-xs font-semibold rounded-full px-3 py-1.5" style={{ background: "rgba(255,255,255,0.15)" }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <ShoppingBasket
                size={190}
                strokeWidth={1}
                className="absolute opacity-10"
                style={{ [isRTL ? "left" : "right"]: -20, bottom: -30 }}
              />
            </section>

            {/* Products */}
            <section id="products" className="mt-10 mb-16">
              <div className="flex gap-6 items-start">
                {/* Sidebar — desktop only */}
                {products.length > 0 && (
                  <aside className="hidden md:block w-56 shrink-0 sticky top-24">
                    <h3 className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>
                      {t.categoriesLabel}
                    </h3>
                    <nav className="flex flex-col gap-1">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="text-start rounded-lg px-3 py-2.5 text-sm font-semibold btn-press"
                        style={
                          selectedCategory === "all"
                            ? { background: "var(--brand-red)", color: "white" }
                            : { color: "var(--text-primary)" }
                        }
                      >
                        {t.allCategories}
                      </button>
                      {presentCategories.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedCategory(c)}
                          className="text-start rounded-lg px-3 py-2.5 text-sm font-semibold btn-press"
                          style={
                            selectedCategory === c
                              ? { background: "var(--brand-red)", color: "white" }
                              : { color: "var(--text-primary)" }
                          }
                        >
                          {/* FIX: Passed 'categories' as the first argument */}
                          {categoryLabel(categories, c, isRTL)}
                        </button>
                      ))}
                    </nav>
                  </aside>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                    <h2 className="text-xl font-extrabold flex items-center gap-2 flex-wrap">
                      {selectedCategory === "all" ? (
                        t.productsTitle
                      ) : (
                        <>
                          <span style={{ color: "var(--text-muted)" }}>{t.productsTitle}</span>
                          <span style={{ color: "var(--text-muted)" }}>›</span>
                          <span>{categoryLabel(categories, selectedCategory, isRTL)}</span>
                        </>
                      )}
                    </h2>
                    <div className="flex items-center gap-3">
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        aria-label={t.sortLabel}
                        className="text-xs font-semibold rounded-lg px-3 py-2 btn-press"
                        style={{
                          border: "1px solid var(--border-strong)",
                          background: "var(--surface)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <option value="default">{t.sortDefault}</option>
                        <option value="price_asc">{t.sortPriceAsc}</option>
                        <option value="price_desc">{t.sortPriceDesc}</option>
                      </select>
                      {!productsLoading && (
                        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                          {filteredProducts.length}
                        </span>
                      )}
                    </div>
                  </div>

{!productsLoading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center rounded-full btn-press scale-hover"
                        style={{
                          width: 38,
                          height: 38,
                          border: "1px solid var(--border-strong)",
                          opacity: currentPage === 1 ? 0.4 : 1,
                          background: "var(--surface)",
                        }}
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={18} style={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
                      </button>
                      <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                        {isRTL ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                      </span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center rounded-full btn-press scale-hover"
                        style={{
                          width: 38,
                          height: 38,
                          border: "1px solid var(--border-strong)",
                          opacity: currentPage === totalPages ? 0.4 : 1,
                          background: "var(--surface)",
                        }}
                        aria-label="Next page"
                      >
                        <ChevronRight size={18} style={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
                      </button>
                    </div>
                  )}

                  {productsLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="rounded-2xl overflow-hidden"
                          style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}
                        >
                          <div className="animate-pulse" style={{ height: 140, background: "var(--skeleton)" }} />
                          <div className="p-3">
                            <div className="h-3 rounded animate-pulse mb-2" style={{ background: "var(--skeleton)" }} />
                            <div className="h-3 w-2/3 rounded animate-pulse" style={{ background: "var(--skeleton)" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <p className="text-sm text-center py-16" style={{ color: "var(--text-muted)" }}>
                      {t.noProducts}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {paginatedProducts.map((p, idx) => {
                        const justAdded = toastId === p.id;
                        const discountPct =
                          p.originalPrice && p.originalPrice > p.price
                            ? Math.round((1 - p.price / p.originalPrice) * 100)
                            : null;
                        return (
                          <div
                            key={p.id}
                            className="fade-up scale-hover rounded-2xl overflow-hidden flex flex-col"
                            style={{
                              background: "var(--surface)",
                              border: "1px solid var(--border-color)",
                              animationDelay: `${idx * 70}ms`,
                            }}
                          >
                            <div className="relative">
                              <ProductImage product={p} isRTL={isRTL} size={140} fill />

                              {discountPct && (
                                <span
                                  className="absolute text-[10px] font-bold rounded-full px-2 py-1"
                                  style={{
                                    top: 8,
                                    [isRTL ? "right" : "left"]: 8,
                                    background: "#DCFCE7",
                                    color: "#15803D",
                                  }}
                                >
                                  {isRTL ? `وفر ${discountPct}٪` : `Save ${discountPct}%`}
                                </span>
                              )}

                              <button
                                onClick={() => addToCart(p.id)}
                                aria-label={t.addToCart}
                                className="absolute flex items-center justify-center rounded-full btn-press"
                                style={{
                                  width: 34,
                                  height: 34,
                                  bottom: 8,
                                  [isRTL ? "left" : "right"]: 8,
                                  background: justAdded ? "#2F8F5B" : "var(--surface)",
                                  border: justAdded ? "none" : "1px solid var(--border-strong)",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                  transition: "background .2s ease",
                                }}
                              >
                                {justAdded ? <Check size={16} color="white" /> : <Plus size={16} color="var(--brand-red)" />}
                              </button>
                            </div>

                            <div className="p-3 flex-1 flex flex-col">
                              <p className="text-sm font-semibold leading-snug mb-0.5">
                                {isRTL ? p.nameAr : p.nameEn}
                              </p>
                              <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                                {isRTL ? p.sizeAr : p.sizeEn}
                              </p>
                              <div className="mt-auto flex items-baseline gap-2 flex-wrap">
                                <span className="font-mono-price font-extrabold text-sm">
                                  {p.price.toFixed(2)} {t.currency}
                                </span>
                                {discountPct && (
                                  <span
                                    className="font-mono-price text-xs line-through"
                                    style={{ color: "var(--text-muted)" }}
                                  >
                                    {p.originalPrice.toFixed(2)} {t.currency}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {page === "checkout" && (
          <section className="mt-6 mb-16 max-w-md mx-auto fade-up">
            <h2 className="text-xl font-extrabold mb-5">{t.checkoutTitle}</h2>

            <div className="rounded-2xl p-4 mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>
                {t.orderSummary}
              </p>
              {cartItems.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-sm py-1.5">
                  <span>
                    {isRTL ? i.product.nameAr : i.product.nameEn} × {i.qty}
                  </span>
                  <span className="font-mono-price font-semibold">
                    {(i.product.price * i.qty).toFixed(2)} {t.currency}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 mt-2 font-extrabold" style={{ borderTop: "1px dashed var(--border-strong)" }}>
                <span>{t.total}</span>
                <span className="font-mono-price" style={{ color: "var(--brand-red)" }}>
                  {cartTotal.toFixed(2)} {t.currency}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-bold">{t.nameLabel}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    border: `1.5px solid ${errors.name ? "var(--brand-red)" : "var(--border-strong)"}`,
                    background: "var(--surface)",
                    color: "var(--text-primary)",
                  }}
                />
                {errors.name && (
                  <span className="text-xs font-semibold" style={{ color: "var(--brand-red)" }}>
                    {errors.name}
                  </span>
                )}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-bold">{t.phoneLabel}</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  type="tel"
                  className="rounded-xl px-4 py-3 text-sm font-mono-price"
                  style={{
                    border: `1.5px solid ${errors.phone ? "var(--brand-red)" : "var(--border-strong)"}`,
                    background: "var(--surface)",
                    color: "var(--text-primary)",
                  }}
                />
                {errors.phone && (
                  <span className="text-xs font-semibold" style={{ color: "var(--brand-red)" }}>
                    {errors.phone}
                  </span>
                )}
              </label>

<label className="flex flex-col gap-1.5">
  <span className="text-sm font-bold">{t.notesLabel}</span>
  <textarea
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    placeholder={t.notesPlaceholder}
    rows={3}
    className="rounded-xl px-4 py-3 text-sm resize-none"
    style={{
      border: "1.5px solid var(--border-strong)",
      background: "var(--surface)",
      color: "var(--text-primary)",
    }}
  />
</label>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {t.checkoutNote}
              </p>

              {submitError && (
                <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold" style={{ background: "var(--danger-bg)", color: "var(--brand-red)" }}>
                  <AlertTriangle size={15} />
                  {t.submitError}
                </div>
              )}

              <button
                onClick={submitOrder}
                disabled={submitting}
                className="w-full rounded-xl py-3.5 font-bold text-sm text-white btn-press"
                style={{ background: "var(--brand-red)", opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? t.submittingOrder : t.confirmOrder}
              </button>
              <button onClick={() => setPage("shop")} className="text-sm font-semibold underline text-center btn-press">
                {t.backToShop}
              </button>
            </div>
          </section>
        )}

        {page === "confirmation" && order && (
          <section className="mt-16 mb-16 max-w-sm mx-auto text-center fade-up">
            <div className="mx-auto flex items-center justify-center rounded-full mb-5 pop" style={{ width: 72, height: 72, background: "#2F8F5B" }}>
              <Check size={34} color="white" strokeWidth={3} />
            </div>
            <h2 className="text-xl font-extrabold mb-2">{t.confirmedTitle}</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
              {t.confirmedBody}
            </p>
            <div className="inline-flex flex-col items-center gap-1 rounded-xl px-5 py-3 mb-8" style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}>
              <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                {t.orderNumberLabel}
              </span>
              <span className="font-mono-price font-bold text-lg" style={{ color: "var(--brand-red)" }}>
                {order.number}
              </span>
            </div>
            <button onClick={() => setPage("shop")} className="rounded-full px-6 py-3 font-bold text-sm text-white btn-press" style={{ background: "var(--brand-charcoal)" }}>
              {t.backToShopBtn}
            </button>
          </section>
        )}
      </main>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex" style={{ justifyContent: isRTL ? "flex-start" : "flex-end" }}>
          <div className="absolute inset-0" style={{ background: "var(--overlay)" }} onClick={() => setCartOpen(false)} />
          <div
            className={`relative w-full max-w-sm h-full flex flex-col ${isRTL ? "drawer-in-rtl" : "drawer-in-ltr"}`}
            style={{ background: "var(--brand-bg)", [isRTL ? "marginRight" : "marginLeft"]: "auto" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <h3 className="font-extrabold text-base">{t.cartTitle}</h3>
              <button onClick={() => setCartOpen(false)} aria-label="Close" className="btn-press">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-2 opacity-70">
                  <ShoppingCart size={36} />
                  <p className="font-bold text-sm mt-2">{t.emptyCart}</p>
                  <p className="text-xs">{t.emptyCartSub}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((i) => (
                    <div key={i.id} className="flex items-center gap-3">
                      <ProductImage product={i.product} isRTL={isRTL} size={52} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{isRTL ? i.product.nameAr : i.product.nameEn}</p>
                        <p className="text-xs font-mono-price" style={{ color: "var(--text-muted)" }}>
                          {i.product.price.toFixed(2)} {t.currency}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => updateQty(i.id, -1)}
                            className="flex items-center justify-center rounded-full btn-press"
                            style={{ width: 24, height: 24, border: "1px solid var(--border-strong)" }}
                            aria-label="decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">{i.qty}</span>
                          <button
                            onClick={() => updateQty(i.id, 1)}
                            className="flex items-center justify-center rounded-full btn-press"
                            style={{ width: 24, height: 24, border: "1px solid var(--border-strong)" }}
                            aria-label="increase"
                          >
                            <Plus size={12} />
                          </button>

                          
                        </div>
                      
                      </div>
                      
                      <button onClick={() => removeItem(i.id)} className="text-xs font-semibold underline self-start btn-press" style={{ color: "var(--brand-red)" }}>
                        {t.remove}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="px-5 py-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center justify-between mb-3 font-extrabold">
                  <span className="text-sm">{t.subtotal}</span>
                  <span className="font-mono-price" style={{ color: "var(--brand-red)" }}>
                    {cartTotal.toFixed(2)} {t.currency}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setPage("checkout");
                    setCartOpen(false);
                  }}
                  className="w-full rounded-xl py-3 font-bold text-sm text-white btn-press"
                  style={{ background: "var(--brand-red)" }}
                >
                  {t.checkout}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}