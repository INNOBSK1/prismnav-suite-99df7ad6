export type Language = 'en' | 'lg';

export const languageNames: Record<Language, string> = {
  en: 'English',
  lg: 'Luganda',
};

// Use a recursive mapped type to widen literal strings
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type TranslationKeys = DeepStringify<typeof translations.en>;

export const translations = {
  en: {
    // Auth page
    auth: {
      brandName: '🌿 FBMS',
      brandSubtitle: 'Farm Business Management System',
      heroTitle: 'Helping farmers grow smarter, not harder.',
      heroDescription: 'FBMS gives you the tools to track your farm\'s performance, manage resources, and make better decisions — all in one place.',
      feature1: 'Track crops, livestock & inventory',
      feature2: 'Monitor expenses & revenue',
      feature3: 'Access reports & insights anytime',
      footerText: 'Built for farmers, by people who care 💚',
      getStarted: 'Get started',
      enterDetails: 'Enter your details to continue',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      emailLabel: 'Email address',
      emailPlaceholder: 'name@company.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'At least 6 characters',
      fullNameLabel: 'Full name',
      fullNamePlaceholder: 'Your name',
      continueBtn: 'Continue',
      signingIn: 'Signing in...',
      createAccount: 'Create account',
      creatingAccount: 'Creating account...',
      termsText: 'By continuing, you agree to our terms of service',
      invalidCredentials: 'Invalid email or password',
      accountExists: 'An account with this email already exists',
      accountCreated: 'Account created successfully!',
      signedIn: 'Signed in successfully!',
      unexpectedError: 'An unexpected error occurred',
    },

    // Dashboard
    dashboard: {
      welcomeBack: 'Welcome back',
      accountOverview: "Here's what's happening with your account",
      availableSites: 'Available Sites',
      sitesAccess: 'Sites you can access',
      downloads: 'Downloads',
      totalDownloads: 'Total files downloaded',
    },

    // Profile
    profile: {
      title: 'Profile',
      manageAccount: 'Manage your account information',
      profilePicture: 'Profile Picture',
      uploadHint: 'Click or drag and drop to upload (max 2MB)',
      email: 'Email',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      bio: 'Bio',
      bioPlaceholder: 'Tell us about yourself',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      signOut: 'Sign Out',
      loading: 'Loading...',
      updateSuccess: 'Profile updated successfully!',
      updateError: 'Failed to update profile',
      loadError: 'Failed to load profile',
      avatarSuccess: 'Avatar updated successfully',
      avatarError: 'Failed to upload avatar',
      imageOnly: 'Please upload an image file',
      fileTooLarge: 'Image size should be less than 2MB',
    },

    // Downloads
    downloadsSection: {
      title: 'Downloads',
      description: 'Track your downloads from embedded sites',
      exportCSV: 'Export CSV',
      noDownloads: 'No downloads yet. Downloads from embedded sites will appear here.',
      date: 'Date',
      fileName: 'File Name',
      action: 'Action',
      exportSuccess: 'Downloads exported successfully',
      noExportData: 'No downloads to export',
      loadError: 'Failed to load downloads',
    },

    // Site Viewer
    siteViewer: {
      notFound: 'Site not found',
      notFoundDesc: 'The requested site could not be found.',
    },

    // Sidebar
    sidebar: {
      sites: 'Sites',
      account: 'Account',
      dashboard: 'Dashboard',
      aiAssistant: 'AI Assistant',
      openChat: 'Open Chat',
    },

    // AI Chat
    aiChat: {
      title: 'AI Assistant',
      greeting: "Hi! I'm your AI assistant.",
      askAnything: 'Ask me anything!',
      placeholder: 'Type a message...',
      rateLimitError: 'Rate limit exceeded. Please try again later.',
      paymentError: 'Payment required. Please add funds to your workspace.',
      responseError: 'Failed to get response',
      chatError: 'An error occurred while chatting',
    },

    // Trial
    trial: {
      trialPeriod: 'Trial Period',
      daysRemaining: 'days remaining',
      trialExpired: 'Trial Expired',
      upgradeNow: 'Upgrade Now',
      upgradePrompt: 'Upgrade now to continue using the app after your trial ends.',
      expiredPrompt: 'Your trial has expired. Please upgrade to continue using the app.',
    },

    // Not Found
    notFound: {
      title: '404',
      message: 'Oops! Page not found',
      returnHome: 'Return to Home',
    },

    // Common
    common: {
      language: 'Language',
    },
  },

  lg: {
    // Auth page
    auth: {
      brandName: '🌿 FBMS',
      brandSubtitle: 'Enkola y\'Okuddukanya Ebizinensi by\'Obulimi',
      heroTitle: 'Tuyamba abalimi okulima n\'amagezi, si n\'amaanyi.',
      heroDescription: 'FBMS ekuwa ebikozesebwa eby\'okugoberera emirimu gy\'okulima, okukozesa obulungi ebyetaagisa, n\'okukola ebisalawo ebirungi — byonna mu kifo kimu.',
      feature1: 'Goberera ebirime, ebisolo n\'ebintu',
      feature2: 'Kebera ebisasulirizibwa n\'ensimbi ezijja',
      feature3: 'Funa lipooti n\'amakubo buli kiseera',
      footerText: 'Kyazimbibwa abalimi, abantu ababafaako 💚',
      getStarted: 'Tandika',
      enterDetails: 'Yingiza ebikukwatako olyoke okomeke',
      signIn: 'Yingira',
      signUp: 'Wewandiise',
      emailLabel: 'Endagiriro ya email',
      emailPlaceholder: 'erinnya@kkampuni.com',
      passwordLabel: 'Ekigambo ekykuuma',
      passwordPlaceholder: 'Obunene 6 ennukuta',
      fullNameLabel: 'Erinnya lyo lyonna',
      fullNamePlaceholder: 'Erinnya lyo',
      continueBtn: 'Komeka',
      signingIn: 'Oyingira...',
      createAccount: 'Kolawo akawunti',
      creatingAccount: 'Tukola akawunti...',
      termsText: 'Bw\'okomeka, okkiriza amateeka gaffe ag\'obuweereza',
      invalidCredentials: 'Email oba ekigambo eky\'okukuuma si kituufu',
      accountExists: 'Akawunti n\'email eno emaze okubaawo',
      accountCreated: 'Akawunti ekolebwa bulungi!',
      signedIn: 'Oyingidde bulungi!',
      unexpectedError: 'Wabaddewo ensobi etaalabirewo',
    },

    // Dashboard
    dashboard: {
      welcomeBack: 'Tukusanyukidde',
      accountOverview: 'Bino bye bikolebwa ku akawunti yo',
      availableSites: 'Saiti Eziriwo',
      sitesAccess: 'Saiti z\'osobola okukozesa',
      downloads: 'Ebiwandiikiddwa',
      totalDownloads: 'Fayilo zonna eziwandiikiddwa',
    },

    // Profile
    profile: {
      title: 'Profayilo',
      manageAccount: 'Ddukanya ebikukwatako ku akawunti',
      profilePicture: 'Ekifaananyi ky\'oprofayilo',
      uploadHint: 'Nyiga oba sika ofuule oteeke (obunene 2MB)',
      email: 'Email',
      fullName: 'Erinnya Lyonna',
      fullNamePlaceholder: 'Yingiza erinnya lyo lyonna',
      bio: 'Ebikukwatako',
      bioPlaceholder: 'Tubuulire ebikukwatako',
      saveChanges: 'Kuuma Enkyukakyuka',
      saving: 'Tukuuma...',
      signOut: 'Fuluma',
      loading: 'Tunona...',
      updateSuccess: 'Profayilo ekyusiddwa bulungi!',
      updateError: 'Tetusobodde kukyusa profayilo',
      loadError: 'Tetusobodde okunona profayilo',
      avatarSuccess: 'Ekifaananyi kikyusiddwa bulungi',
      avatarError: 'Tetusobodde kuteeka ekifaananyi',
      imageOnly: 'Bambi teeka ekifaananyi',
      fileTooLarge: 'Obunene bw\'ekifaananyi buleme okusukka 2MB',
    },

    // Downloads
    downloadsSection: {
      title: 'Ebiwandiikiddwa',
      description: 'Goberera ebiwandiikiddwa okuva mu saiti',
      exportCSV: 'Fulumya CSV',
      noDownloads: 'Tewali biwandiikiddwa. Ebiwandiikiddwa okuva mu saiti bijja kulabikira wano.',
      date: 'Ennaku',
      fileName: 'Erinnya lya Fayilo',
      action: 'Ekintu',
      exportSuccess: 'Ebiwandiikiddwa bifulumiziddwa bulungi',
      noExportData: 'Tewali biwandiikiddwa by\'ofulumya',
      loadError: 'Tetusobodde okunona ebiwandiikiddwa',
    },

    // Site Viewer
    siteViewer: {
      notFound: 'Saiti tezibaliddwa',
      notFoundDesc: 'Saiti gy\'onoonya tezisobodde kuboneka.',
    },

    // Sidebar
    sidebar: {
      sites: 'Saiti',
      account: 'Akawunti',
      dashboard: 'Dashiboodi',
      aiAssistant: 'Omuyambi wa AI',
      openChat: 'Ggulawo Okwogera',
    },

    // AI Chat
    aiChat: {
      title: 'Omuyambi wa AI',
      greeting: 'Nze omuyambi wo owa AI.',
      askAnything: 'Mbuuza ekyo kyonna!',
      placeholder: 'Wandiika obubaka...',
      rateLimitError: 'Osenze okubuuza emirundi mingi. Gezaako oluvannyuma.',
      paymentError: 'Okusasula kwetaagisa. Bambi teeka ssente.',
      responseError: 'Tetusobodde kufuna ddamu',
      chatError: 'Wabaddewo ensobi ng\'oyogera',
    },

    // Trial
    trial: {
      trialPeriod: 'Ekiseera ky\'Okugezesa',
      daysRemaining: 'ennaku ezisigadde',
      trialExpired: 'Ekiseera ky\'Okugezesa Kiggudde',
      upgradeNow: 'Yongera Kaakano',
      upgradePrompt: 'Yongera kaakano olyoke okomeke okukozesa app oluvannyuma lw\'ekiseera ky\'okugezesa.',
      expiredPrompt: 'Ekiseera kyo eky\'okugezesa kiggudde. Bambi yongera olyoke okomeke okukozesa app.',
    },

    // Not Found
    notFound: {
      title: '404',
      message: 'Ggwe! Omuko guno teguboneka',
      returnHome: 'Dda Ewaka',
    },

    // Common
    common: {
      language: 'Olulimi',
    },
  },
} as const;
