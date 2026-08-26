export type Language = "es" | "en";

export interface Translations {
  // Navigation
  nav: {
    products: string;
    categories: string;
    search: string;
    quote: string;
    admin: string;
    home: string;
  };
  // Hero
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    exploreBtn: string;
    categoriesBtn: string;
    cardFrontTitle: string;
    cardBackTitle: string;
    cardBackItems: string[];
    scrollIndicator: string;
  };
  // 3D Featured Section
  featured3D: {
    tag: string;
    title: string;
    subtitle: string;
    titles: string[];
    specs: {
      cpu: string;
      gpu: string;
      ram: string;
      ssd: string;
      cooling: string;
      price: string;
    };
    scrollHint: string;
  };
  // 3D Experience Section
  experience3D: {
    stages: {
      title: string;
      titleHighlight: string;
      subtitle: string;
    }[];
    hud: {
      compute: string;
      vram: string;
      cooling: string;
    };
  };
  // Stats
  stats: {
    products: string;
    categories: string;
    clients: string;
    years: string;
  };
  // Categories
  categoriesSection: {
    tag: string;
    title: string;
    subtitle: string;
    productsCount: string;
  };
  // Catalog & Products
  catalog: {
    tag: string;
    title: string;
    subtitle: string;
    allFilter: string;
    viewDetails: string;
    addToCart: string;
    quoteWhatsapp: string;
    inStock: string;
    outOfStock: string;
    offer: string;
    new: string;
    popular: string;
  };
  // Product Detail Modal
  modal: {
    hoverZoom: string;
    touchZoom: string;
    touchExit: string;
    touchHint: string;
    specLabel: string;
    quoteNow: string;
    close: string;
  };
  // Search Overlay
  search: {
    placeholder: string;
    noResults: string;
    shortcutHint: string;
    viewProduct: string;
  };
  // CTA
  cta: {
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    quoteBtn: string;
  };
  // Toast
  toast: {
    addedFavorite: string;
    copied: string;
  };
  // Footer
  footer: {
    tagline: string;
    categoriesTitle: string;
    linksTitle: string;
    rights: string;
  };
}

export const translations: Record<Language, Translations> = {
  es: {
    nav: {
      products: "Productos",
      categories: "Categorías",
      search: "Buscar",
      quote: "Cotizar",
      admin: "Admin",
      home: "Inicio",
    },
    hero: {
      badge: "Tecnología de Vanguardia",
      titleLine1: "Potencia que",
      titleLine2: "inspira.",
      subtitle: "Descubre el futuro de la tecnología con setups y equipos de alto rendimiento para gaming, ingeniería y producción.",
      exploreBtn: "Explorar",
      categoriesBtn: "Categorías",
      cardFrontTitle: "Setup Premium Gaming",
      cardBackTitle: "¿Por qué Diginast?",
      cardBackItems: [
        "Garantía oficial 3 años",
        "Envío gratis asegurado",
        "Soporte especializado 24/7",
        "Configuración personalizada a medida",
      ],
      scrollIndicator: "Desliza para descubrir",
    },
    featured3D: {
      tag: "// Hardware de Alto Rendimiento",
      title: "Setup Premium Gaming",
      subtitle: "Explora cada componente en 360°",
      titles: [
        "Setup Premium Gaming",
        "Potencia Extrema",
        "Refrigeración Líquida",
        "RGB Personalizable",
        "Tu Próxima Máquina",
      ],
      specs: {
        cpu: "Intel i9-14900K",
        gpu: "NVIDIA RTX 4090",
        ram: "64GB DDR5 6000MHz",
        ssd: "2TB NVMe Gen4",
        cooling: "Liquid 360mm ARGB",
        price: "$3,499 USD",
      },
      scrollHint: "Continúa deslizando",
    },
    experience3D: {
      stages: [
        {
          title: "Una experiencia",
          titleHighlight: "visual única",
          subtitle: "Explora el poder desde adentro con gráficos en tiempo real",
        },
        {
          title: "Rendimiento",
          titleHighlight: "extremo",
          subtitle: "Cada componente optimizado para el máximo rendimiento térmico y computacional",
        },
        {
          title: "El futuro es",
          titleHighlight: "ahora",
          subtitle: "Descubre el estándar de ingeniería que define a Diginast",
        },
      ],
      hud: {
        compute: "⚡ 83 TFLOPS Compute",
        vram: "🔥 24GB GDDR6X",
        cooling: "❄️ Custom Liquid Cooling",
      },
    },
    stats: {
      products: "Productos Premium",
      categories: "Categorías Pro",
      clients: "Clientes Satisfechos",
      years: "Años de Excelencia",
    },
    categoriesSection: {
      tag: "// Explora por categoría",
      title: "Encuentra tu equipo perfecto",
      subtitle: "Desde workstations y setups gaming hasta componentes de última generación",
      productsCount: "productos",
    },
    catalog: {
      tag: "// Catálogo destacado",
      title: "Equipos y Componentes",
      subtitle: "Haz clic o toca cualquier producto para inspeccionar detalles y zoom",
      allFilter: "Todos",
      viewDetails: "Ver Detalles",
      addToCart: "Cotizar",
      quoteWhatsapp: "Consultar por WhatsApp",
      inStock: "En Stock",
      outOfStock: "Agotado",
      offer: "Oferta",
      new: "Nuevo",
      popular: "Destacado",
    },
    modal: {
      hoverZoom: "Hover para zoom",
      touchZoom: "Toca para zoom",
      touchExit: "Doble tap para salir",
      touchHint: "👆 Toca y arrastra para zoom óptico",
      specLabel: "Especificación",
      quoteNow: "Cotizar por WhatsApp",
      close: "Cerrar",
    },
    search: {
      placeholder: "Buscar por nombre, categoría o especificaciones... (Ctrl + K)",
      noResults: "No se encontraron productos coincidentes",
      shortcutHint: "ESC para salir",
      viewProduct: "Inspeccionar",
    },
    cta: {
      titlePrefix: "¿Listo para el",
      titleHighlight: "siguiente nivel?",
      subtitle: "Cotiza tu equipo personalizado o estación de trabajo con nuestros ingenieros hoy mismo.",
      quoteBtn: "Solicitar Cotización",
    },
    toast: {
      addedFavorite: "Guardado en lista de favoritos",
      copied: "Enlace copiado al portapapeles",
    },
    footer: {
      tagline: "Potencia que inspira. Tu socio de confianza en hardware de alto rendimiento, workstations y ensambles a medida.",
      categoriesTitle: "Categorías",
      linksTitle: "Enlaces",
      rights: "Diginast. Todos los derechos reservados.",
    },
  },
  en: {
    nav: {
      products: "Products",
      categories: "Categories",
      search: "Search",
      quote: "Get Quote",
      admin: "Admin",
      home: "Home",
    },
    hero: {
      badge: "Cutting-Edge Technology",
      titleLine1: "Power that",
      titleLine2: "inspires.",
      subtitle: "Experience the next echelon of computing with high-performance setups engineered for gaming, coding, and production.",
      exploreBtn: "Explore",
      categoriesBtn: "Categories",
      cardFrontTitle: "Premium Gaming Setup",
      cardBackTitle: "Why Diginast?",
      cardBackItems: [
        "3-year official warranty",
        "Free insured worldwide delivery",
        "24/7 specialized technical support",
        "Tailored custom-built hardware",
      ],
      scrollIndicator: "Scroll to discover",
    },
    featured3D: {
      tag: "// High Performance Hardware",
      title: "Premium Gaming Rig",
      subtitle: "Inspect each component in full 360°",
      titles: [
        "Premium Gaming Setup",
        "Extreme Power",
        "Liquid Cooling",
        "Customizable RGB",
        "Your Next Machine",
      ],
      specs: {
        cpu: "Intel i9-14900K",
        gpu: "NVIDIA RTX 4090",
        ram: "64GB DDR5 6000MHz",
        ssd: "2TB NVMe Gen4",
        cooling: "Liquid 360mm ARGB",
        price: "$3,499 USD",
      },
      scrollHint: "Keep scrolling down",
    },
    experience3D: {
      stages: [
        {
          title: "A unique",
          titleHighlight: "visual experience",
          subtitle: "Explore raw computing power from within with real-time graphics",
        },
        {
          title: "Extreme",
          titleHighlight: "performance",
          subtitle: "Every component fine-tuned for optimal thermal and computational headroom",
        },
        {
          title: "The future is",
          titleHighlight: "now",
          subtitle: "Discover the engineering benchmark that defines Diginast",
        },
      ],
      hud: {
        compute: "⚡ 83 TFLOPS Compute",
        vram: "🔥 24GB GDDR6X",
        cooling: "❄️ Custom Liquid Cooling",
      },
    },
    stats: {
      products: "Premium Products",
      categories: "Pro Categories",
      clients: "Satisfied Clients",
      years: "Years of Excellence",
    },
    categoriesSection: {
      tag: "// Explore by category",
      title: "Find Your Perfect Rig",
      subtitle: "From workstations and gaming setups to cutting-edge components",
      productsCount: "products",
    },
    catalog: {
      tag: "// Featured Catalog",
      title: "Rigs & Components",
      subtitle: "Click or tap any item to inspect details and optical zoom",
      allFilter: "All",
      viewDetails: "View Details",
      addToCart: "Get Quote",
      quoteWhatsapp: "Inquire via WhatsApp",
      inStock: "In Stock",
      outOfStock: "Sold Out",
      offer: "Special Offer",
      new: "New",
      popular: "Featured",
    },
    modal: {
      hoverZoom: "Hover to zoom",
      touchZoom: "Tap to zoom",
      touchExit: "Double tap to exit",
      touchHint: "👆 Tap and drag for optical zoom lens",
      specLabel: "Specification",
      quoteNow: "Inquire via WhatsApp",
      close: "Close",
    },
    search: {
      placeholder: "Search by title, category, or specs... (Ctrl + K)",
      noResults: "No matching products found",
      shortcutHint: "ESC to close",
      viewProduct: "Inspect",
    },
    cta: {
      titlePrefix: "Ready for the",
      titleHighlight: "next level?",
      subtitle: "Order your custom-built rig or workstation with our engineers today.",
      quoteBtn: "Request Quote",
    },
    toast: {
      addedFavorite: "Saved to your favorites",
      copied: "Link copied to clipboard",
    },
    footer: {
      tagline: "Power that inspires. Your trusted partner in high-performance hardware, workstations, and custom rig engineering.",
      categoriesTitle: "Categories",
      linksTitle: "Links",
      rights: "Diginast. All rights reserved.",
    },
  },
};
