const translations = {
    en: {
        languageName: 'English',
        welcomeMessage: 'Welcome to {{siteName}}',
        siteDescription: 'Your universe of emojis. Discover, copy, and download thousands of emojis in various formats.',
        browseEmojis: 'Browse Emojis',
        exploreCategories: 'Explore Categories',
        featuredEmojis: 'Featured Emojis',
    },
    es: {
        languageName: 'Español',
        welcomeMessage: 'Bienvenido a {{siteName}}',
        siteDescription: 'Tu universo de emojis. Descubre, copia y descarga miles de emojis en varios formatos.',
        browseEmojis: 'Explorar Emojis',
        exploreCategories: 'Explorar Categorías',
        featuredEmojis: 'Emojis Destacados',
    },
    hi: {
        languageName: 'हिन्दी',
        welcomeMessage: '{{siteName}} में आपका स्वागत है',
        siteDescription: 'इमोजी का आपका ब्रह्मांड। विभिन्न प्रारूपों में हजारों इमोजी खोजें, कॉपी करें और डाउनलोड करें।',
        browseEmojis: 'इमोजी ब्राउज़ करें',
        exploreCategories: 'श्रेणियाँ अन्वेषण करें',
        featuredEmojis: 'विशेष रुप से प्रदर्शित इमोजी',
    },
    fr: {
        languageName: 'Français',
        welcomeMessage: 'Bienvenue sur {{siteName}}',
        siteDescription: 'Votre univers d\'émojis. Découvrez, copiez et téléchargez des milliers d\'émojis dans différents formats.',
        browseEmojis: 'Parcourir les émojis',
        exploreCategories: 'Explorer les catégories',
        featuredEmojis: 'Émojis en vedette',
    },
    ja: {
        languageName: '日本語',
        welcomeMessage: '{{siteName}}へようこそ',
        siteDescription: '絵文字の世界。何千もの絵文字をさまざまな形式で発見、コピー、ダウンロードできます。',
        browseEmojis: '絵文字を閲覧',
        exploreCategories: 'カテゴリーを探す',
        featuredEmojis: '注目の絵文字',
    },
    de: {
        languageName: 'Deutsch',
        welcomeMessage: 'Willkommen bei {{siteName}}',
        siteDescription: 'Dein Universum der Emojis. Entdecke, kopiere und lade Tausende von Emojis in verschiedenen Formaten herunter.',
        browseEmojis: 'Emojis durchsuchen',
        exploreCategories: 'Kategorien erkunden',
        featuredEmojis: 'Ausgewählte Emojis',
    },
    pt: {
        languageName: 'Português',
        welcomeMessage: 'Bem-vindo ao {{siteName}}',
        siteDescription: 'Seu universo de emojis. Descubra, copie e baixe milhares de emojis em vários formatos.',
        browseEmojis: 'Navegar por Emojis',
        exploreCategories: 'Explorar Categorias',
        featuredEmojis: 'Emojis em Destaque',
    },
    ru: {
        languageName: 'Русский',
        welcomeMessage: 'Добро пожаловать в {{siteName}}',
        siteDescription: 'Ваша вселенная эмодзи. Открывайте, копируйте и загружайте тысячи эмодзи в различных форматах.',
        browseEmojis: 'Просмотреть эмодзи',
        exploreCategories: 'Изучить категории',
        featuredEmojis: 'Избранные эмодзи',
    },
    zh: {
        languageName: '中文',
        welcomeMessage: '欢迎来到{{siteName}}',
        siteDescription: '您的表情符号世界。发现、复制和下载数千种各种格式的表情符号。',
        browseEmojis: '浏览表情符号',
        exploreCategories: '探索类别',
        featuredEmojis: '精选表情符号',
    }
};

export type Translations = typeof translations;
export default translations;
