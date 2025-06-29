/**
 * Internationalization setup for English, Hindi, and Spanish
 */

export const translations = {
  en: {
    // Authentication
    welcome: 'Welcome to AgriConnect',
    getStarted: 'Get Started',
    enterContact: 'Enter your contact information',
    sendCode: 'Send Code',
    verifyCode: 'Verify & Continue',
    enterCode: 'Enter the 6-digit verification code',
    
    // Farmer Onboarding
    createProfile: 'Create Your Farm Profile',
    farmName: 'Farm Name',
    location: 'Location',
    getCurrentLocation: 'Get Current Location',
    profilePhoto: 'Profile Photo',
    takePhoto: 'Take Photo',
    choosePhoto: 'Choose from Gallery',
    bio: 'Tell us about your farm',
    
    // Document Verification
    verificationRequired: 'Verification Required',
    uploadId: 'Upload ID Document',
    governmentId: 'Government ID',
    farmDocument: 'Farm Ownership Document',
    
    // Navigation
    home: 'Home',
    marketplace: 'Marketplace',
    crops: 'My Crops',
    messages: 'Messages',
    profile: 'Profile',
    
    // Common
    next: 'Next',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    email: 'Email',
    phone: 'Phone',
  },
  
  hi: {
    // Authentication  
    welcome: 'AgriConnect में आपका स्वागत है',
    getStarted: 'शुरू करें',
    enterContact: 'अपनी संपर्क जानकारी दर्ज करें',
    sendCode: 'कोड भेजें',
    verifyCode: 'सत्यापित करें और जारी रखें',
    enterCode: '6 अंकों का सत्यापन कोड दर्ज करें',
    
    // Farmer Onboarding
    createProfile: 'अपना फार्म प्रोफाइल बनाएं',
    farmName: 'फार्म का नाम',
    location: 'स्थान',
    getCurrentLocation: 'वर्तमान स्थान प्राप्त करें',
    profilePhoto: 'प्रोफाइल फोटो',
    takePhoto: 'फोटो लें',
    choosePhoto: 'गैलरी से चुनें',
    bio: 'अपने फार्म के बारे में बताएं',
    
    // Document Verification
    verificationRequired: 'सत्यापन आवश्यक',
    uploadId: 'ID दस्तावेज अपलोड करें',
    governmentId: 'सरकारी ID',
    farmDocument: 'फार्म स्वामित्व दस्तावेज',
    
    // Navigation
    home: 'होम',
    marketplace: 'बाज़ार',
    crops: 'मेरी फसलें',
    messages: 'संदेश',
    profile: 'प्रोफाइल',
    
    // Common
    next: 'अगला',
    back: 'वापस',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफल',
    email: 'ईमेल',
    phone: 'फोन',
  },
  
  es: {
    // Authentication
    welcome: 'Bienvenido a AgriConnect',
    getStarted: 'Comenzar',
    enterContact: 'Ingresa tu información de contacto',
    sendCode: 'Enviar Código',
    verifyCode: 'Verificar y Continuar',
    enterCode: 'Ingresa el código de verificación de 6 dígitos',
    
    // Farmer Onboarding
    createProfile: 'Crea tu Perfil de Granja',
    farmName: 'Nombre de la Granja',
    location: 'Ubicación',
    getCurrentLocation: 'Obtener Ubicación Actual',
    profilePhoto: 'Foto de Perfil', 
    takePhoto: 'Tomar Foto',
    choosePhoto: 'Elegir de la Galería',
    bio: 'Cuéntanos sobre tu granja',
    
    // Document Verification
    verificationRequired: 'Verificación Requerida',
    uploadId: 'Subir Documento de ID',
    governmentId: 'ID Gubernamental',
    farmDocument: 'Documento de Propiedad de Granja',
    
    // Navigation
    home: 'Inicio',
    marketplace: 'Mercado',
    crops: 'Mis Cultivos',
    messages: 'Mensajes', 
    profile: 'Perfil',
    
    // Common
    next: 'Siguiente',
    back: 'Atrás',
    save: 'Guardar',
    cancel: 'Cancelar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    email: 'Email',
    phone: 'Teléfono',
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (key: TranslationKey, language: Language = 'en'): string => {
  return translations[language][key] || translations.en[key];
};