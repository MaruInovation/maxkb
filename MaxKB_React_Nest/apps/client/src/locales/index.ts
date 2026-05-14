import i18n from "i18next";
import { initReactI18next } from "react-i18next";

void i18n.use(initReactI18next).init({
	resources: {
		"zh-CN": {
			translation: {},
		},
		"en-US": {
			translation: {},
		},
	},
	lng: localStorage.getItem("MaxKB-locale") || navigator.language || "zh-CN",
	fallbackLng: "zh-CN",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
