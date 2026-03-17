import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Translation data for 5 languages
const translations = {
  en: {
    // Navbar
    navbar: {
      welcome: "Welcome",
      logout: "Logout",
      systemTitle: "Inventory Management System"
    },
    
    // Sidebar
    sidebar: {
      menu: "MENU",
      dashboard: "Dashboard",
      items: "Items",
      transactions: "Transactions",
      reports: "Reports",
      alerts: "Alerts",
      userManagement: "User Management"
    },
    
    // Items Page
    items: {
      title: "Items Management",
      addNew: "+ Add New Item",
      search: "Search by item code or name...",
      status: "STATUS",
      category: "CATEGORY",
      stockLevel: "STOCK LEVEL",
      sortBy: "SORT BY",
      order: "ORDER",
      reset: "Reset",
      itemCode: "ITEM CODE",
      itemName: "ITEM NAME",
      uom: "UOM",
      stockQty: "STOCK QTY",
      minLevel: "MIN LEVEL",
      actions: "ACTIONS",
      edit: "Edit",
      stock: "Stock",
      delete: "Delete",
      active: "Active",
      inactive: "Inactive",
      allStatus: "All Status",
      allCategories: "All Categories",
      allStockLevels: "All Stock Levels",
      available: "Available",
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
      showing: "Showing",
      of: "of",
      itemsLabel: "items"
    },
    
    // Transactions Page
    transactions: {
      title: "Stock Transactions",
      newTransaction: "+ New Transaction",
      stockAdjustment: "📝 Stock Adjustment",
      transactionType: "TRANSACTION TYPE",
      sortBy: "SORT BY",
      order: "ORDER",
      resetFilters: "Reset Filters",
      date: "DATE",
      type: "TYPE",
      referenceNo: "REFERENCE NO",
      items: "ITEMS",
      totalQty: "TOTAL QTY",
      actions: "ACTIONS",
      viewDetails: "View Details",
      allTypes: "All Types",
      newestFirst: "Newest First",
      oldestFirst: "Oldest First",
      inward: "Inward",
      outward: "Outward",
      adjust: "Adjust",
      showing: "Showing",
      transaction: "transaction",
      transactions: "transactions",
      filteredBy: "Filtered by"
    },
    
    // Common
    common: {
      loading: "Loading...",
      noData: "No data found",
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      close: "Close",
      yes: "Yes",
      no: "No"
    }
  },
  
  ta: { // Tamil
    navbar: {
      welcome: "வணக்கம்",
      logout: "வெளியேறு",
      systemTitle: "சரக்கு மேலாண்மை அமைப்பு"
    },
    
    sidebar: {
      menu: "பட்டியல்",
      dashboard: "முகப்பு",
      items: "பொருட்கள்",
      transactions: "பரிவர்த்தனைகள்",
      reports: "அறிக்கைகள்",
      alerts: "எச்சரிக்கைகள்",
      userManagement: "பயனர் மேலாண்மை"
    },
    
    items: {
      title: "பொருள் மேலாண்மை",
      addNew: "+ புதிய பொருளைச் சேர்க்கவும்",
      search: "பொருள் குறியீடு அல்லது பெயரால் தேடுங்கள்...",
      status: "நிலை",
      category: "வகை",
      stockLevel: "இருப்பு நிலை",
      sortBy: "வரிசைப்படுத்து",
      order: "ஆர்டர்",
      reset: "மீட்டமை",
      itemCode: "பொருள் குறியீடு",
      itemName: "பொருளின் பெயர்",
      uom: "அலகு",
      stockQty: "இருப்பு அளவு",
      minLevel: "குறைந்தபட்ச அளவு",
      actions: "செயல்கள்",
      edit: "திருத்து",
      stock: "இருப்பு",
      delete: "நீக்கு",
      active: "செயலில்",
      inactive: "செயலற்ற",
      allStatus: "அனைத்து நிலை",
      allCategories: "அனைத்து வகைகள்",
      allStockLevels: "அனைத்து இருப்பு நிலைகள்",
      available: "கிடைக்கக்கூடியது",
      lowStock: "குறைந்த இருப்பு",
      outOfStock: "இருப்பு இல்லை",
      showing: "காட்டுகிறது",
      of: "இல்",
      itemsLabel: "பொருட்கள்"
    },
    
    transactions: {
      title: "இருப்பு பரிவர்த்தனைகள்",
      newTransaction: "+ புதிய பரிவர்த்தனை",
      stockAdjustment: "📝 இருப்பு சரிசெய்தல்",
      transactionType: "பரிவர்த்தனை வகை",
      sortBy: "வரிசைப்படுத்து",
      order: "ஆர்டர்",
      resetFilters: "வடிகட்டிகளை மீட்டமை",
      date: "தேதி",
      type: "வகை",
      referenceNo: "குறிப்பு எண்",
      items: "பொருட்கள்",
      totalQty: "மொத்த அளவு",
      actions: "செயல்கள்",
      viewDetails: "விவரங்களைக் காண்க",
      allTypes: "அனைத்து வகைகள்",
      newestFirst: "புதியது முதலில்",
      oldestFirst: "பழையது முதலில்",
      inward: "உள்வரவு",
      outward: "வெளியேற்றம்",
      adjust: "சரிசெய்",
      showing: "காட்டுகிறது",
      transaction: "பரிவர்த்தனை",
      transactions: "பரிவர்த்தனைகள்",
      filteredBy: "வடிகட்டப்பட்டது"
    },
    
    common: {
      loading: "ஏற்றுகிறது...",
      noData: "தரவு இல்லை",
      save: "சேமி",
      cancel: "ரத்துசெய்",
      confirm: "உறுதிப்படுத்து",
      close: "மூடு",
      yes: "ஆம்",
      no: "இல்லை"
    }
  },
  
  hi: { // Hindi
    navbar: {
      welcome: "स्वागत",
      logout: "लॉग आउट",
      systemTitle: "इन्वेंटरी प्रबंधन प्रणाली"
    },
    
    sidebar: {
      menu: "मेनू",
      dashboard: "डैशबोर्ड",
      items: "आइटम",
      transactions: "लेनदेन",
      reports: "रिपोर्ट",
      alerts: "अलर्ट",
      userManagement: "उपयोगकर्ता प्रबंधन"
    },
    
    items: {
      title: "आइटम प्रबंधन",
      addNew: "+ नया आइटम जोड़ें",
      search: "आइटम कोड या नाम से खोजें...",
      status: "स्थिति",
      category: "श्रेणी",
      stockLevel: "स्टॉक स्तर",
      sortBy: "क्रमबद्ध करें",
      order: "क्रम",
      reset: "रीसेट",
      itemCode: "आइटम कोड",
      itemName: "आइटम का नाम",
      uom: "इकाई",
      stockQty: "स्टॉक मात्रा",
      minLevel: "न्यूनतम स्तर",
      actions: "कार्रवाई",
      edit: "संपादित करें",
      stock: "स्टॉक",
      delete: "हटाएं",
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      allStatus: "सभी स्थिति",
      allCategories: "सभी श्रेणियां",
      allStockLevels: "सभी स्टॉक स्तर",
      available: "उपलब्ध",
      lowStock: "कम स्टॉक",
      outOfStock: "स्टॉक खत्म",
      showing: "दिखा रहा है",
      of: "का",
      itemsLabel: "आइटम"
    },
    
    transactions: {
      title: "स्टॉक लेनदेन",
      newTransaction: "+ नया लेनदेन",
      stockAdjustment: "📝 स्टॉक समायोजन",
      transactionType: "लेनदेन प्रकार",
      sortBy: "क्रमबद्ध करें",
      order: "क्रम",
      resetFilters: "फ़िल्टर रीसेट करें",
      date: "तारीख",
      type: "प्रकार",
      referenceNo: "संदर्भ संख्या",
      items: "आइटम",
      totalQty: "कुल मात्रा",
      actions: "कार्रवाई",
      viewDetails: "विवरण देखें",
      allTypes: "सभी प्रकार",
      newestFirst: "नवीनतम पहले",
      oldestFirst: "पुरानी पहले",
      inward: "आवक",
      outward: "जावक",
      adjust: "समायोजन",
      showing: "दिखा रहा है",
      transaction: "लेनदेन",
      transactions: "लेनदेन",
      filteredBy: "द्वारा फ़िल्टर किया गया"
    },
    
    common: {
      loading: "लोड हो रहा है...",
      noData: "कोई डेटा नहीं मिला",
      save: "सहेजें",
      cancel: "रद्द करें",
      confirm: "पुष्टि करें",
      close: "बंद करें",
      yes: "हां",
      no: "नहीं"
    }
  },
  
  es: { // Spanish
    navbar: {
      welcome: "Bienvenido",
      logout: "Cerrar sesión",
      systemTitle: "Sistema de Gestión de Inventario"
    },
    
    sidebar: {
      menu: "MENÚ",
      dashboard: "Tablero",
      items: "Artículos",
      transactions: "Transacciones",
      reports: "Informes",
      alerts: "Alertas",
      userManagement: "Gestión de Usuarios"
    },
    
    items: {
      title: "Gestión de Artículos",
      addNew: "+ Agregar Nuevo Artículo",
      search: "Buscar por código o nombre...",
      status: "ESTADO",
      category: "CATEGORÍA",
      stockLevel: "NIVEL DE STOCK",
      sortBy: "ORDENAR POR",
      order: "ORDEN",
      reset: "Restablecer",
      itemCode: "CÓDIGO",
      itemName: "NOMBRE",
      uom: "UNIDAD",
      stockQty: "CANTIDAD",
      minLevel: "NIVEL MÍN.",
      actions: "ACCIONES",
      edit: "Editar",
      stock: "Stock",
      delete: "Eliminar",
      active: "Activo",
      inactive: "Inactivo",
      allStatus: "Todos los estados",
      allCategories: "Todas las categorías",
      allStockLevels: "Todos los niveles",
      available: "Disponible",
      lowStock: "Stock bajo",
      outOfStock: "Sin stock",
      showing: "Mostrando",
      of: "de",
      itemsLabel: "artículos"
    },
    
    transactions: {
      title: "Transacciones de Stock",
      newTransaction: "+ Nueva Transacción",
      stockAdjustment: "📝 Ajuste de Stock",
      transactionType: "TIPO DE TRANSACCIÓN",
      sortBy: "ORDENAR POR",
      order: "ORDEN",
      resetFilters: "Restablecer Filtros",
      date: "FECHA",
      type: "TIPO",
      referenceNo: "REF. NO.",
      items: "ARTÍCULOS",
      totalQty: "CANT. TOTAL",
      actions: "ACCIONES",
      viewDetails: "Ver Detalles",
      allTypes: "Todos los tipos",
      newestFirst: "Más reciente primero",
      oldestFirst: "Más antiguo primero",
      inward: "Entrada",
      outward: "Salida",
      adjust: "Ajuste",
      showing: "Mostrando",
      transaction: "transacción",
      transactions: "transacciones",
      filteredBy: "Filtrado por"
    },
    
    common: {
      loading: "Cargando...",
      noData: "No se encontraron datos",
      save: "Guardar",
      cancel: "Cancelar",
      confirm: "Confirmar",
      close: "Cerrar",
      yes: "Sí",
      no: "No"
    }
  },
  
  fr: { // French
    navbar: {
      welcome: "Bienvenue",
      logout: "Déconnexion",
      systemTitle: "Système de Gestion d'Inventaire"
    },
    
    sidebar: {
      menu: "MENU",
      dashboard: "Tableau de bord",
      items: "Articles",
      transactions: "Transactions",
      reports: "Rapports",
      alerts: "Alertes",
      userManagement: "Gestion des Utilisateurs"
    },
    
    items: {
      title: "Gestion des Articles",
      addNew: "+ Ajouter un Article",
      search: "Rechercher par code ou nom...",
      status: "STATUT",
      category: "CATÉGORIE",
      stockLevel: "NIVEAU DE STOCK",
      sortBy: "TRIER PAR",
      order: "ORDRE",
      reset: "Réinitialiser",
      itemCode: "CODE",
      itemName: "NOM",
      uom: "UNITÉ",
      stockQty: "QUANTITÉ",
      minLevel: "NIVEAU MIN.",
      actions: "ACTIONS",
      edit: "Modifier",
      stock: "Stock",
      delete: "Supprimer",
      active: "Actif",
      inactive: "Inactif",
      allStatus: "Tous les statuts",
      allCategories: "Toutes les catégories",
      allStockLevels: "Tous les niveaux",
      available: "Disponible",
      lowStock: "Stock faible",
      outOfStock: "Rupture de stock",
      showing: "Affichage",
      of: "de",
      itemsLabel: "articles"
    },
    
    transactions: {
      title: "Transactions de Stock",
      newTransaction: "+ Nouvelle Transaction",
      stockAdjustment: "📝 Ajustement de Stock",
      transactionType: "TYPE DE TRANSACTION",
      sortBy: "TRIER PAR",
      order: "ORDRE",
      resetFilters: "Réinitialiser les Filtres",
      date: "DATE",
      type: "TYPE",
      referenceNo: "RÉF. NO.",
      items: "ARTICLES",
      totalQty: "QTÉ TOTALE",
      actions: "ACTIONS",
      viewDetails: "Voir les Détails",
      allTypes: "Tous les types",
      newestFirst: "Plus récent d'abord",
      oldestFirst: "Plus ancien d'abord",
      inward: "Entrée",
      outward: "Sortie",
      adjust: "Ajustement",
      showing: "Affichage",
      transaction: "transaction",
      transactions: "transactions",
      filteredBy: "Filtré par"
    },
    
    common: {
      loading: "Chargement...",
      noData: "Aucune donnée trouvée",
      save: "Enregistrer",
      cancel: "Annuler",
      confirm: "Confirmer",
      close: "Fermer",
      yes: "Oui",
      no: "Non"
    }
  }
};

// Language metadata
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    languages,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};