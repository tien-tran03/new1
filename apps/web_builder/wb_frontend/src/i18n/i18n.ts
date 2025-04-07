import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLangResource from './lang_resources/en/en.json';
import viLangResource from './lang_resources/vi/vi.json';

export const locales = {
    en: 'English',
    vi: 'Tiếng Việt',
} as const
// Lấy ngôn ngữ đã lưu trong localStorage, nếu không có thì mặc định là 'vi'
const savedLanguage = localStorage.getItem('language') || 'vi';
export const resources = {

    en: {
        translation: enLangResource,

    },
    vi: {
        translation: viLangResource,

    }
}
i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    ns: ['translation'],
    fallbackLng: 'vi',
    interpolation: {
        escapeValue: false
    }

})
// Lưu ngôn ngữ vào localStorage khi thay đổi
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});
export default i18n
