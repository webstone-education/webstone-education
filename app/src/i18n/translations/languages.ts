export const courseLanguages = {
	ar: 'العربية',
	cs: 'Čeština',
	da: 'Dansk',
	de: 'Deutsch',
	en: 'English',
	es: 'Español',
	fa: 'فارسی',
	fr: 'Français',
	gl: 'Galego',
	he: 'עברית',
	hi: 'हिन्दी',
	id: 'Bahasa Indonesia',
	it: 'Italiano',
	ja: '日本語',
	ko: '한국어',
	nb: 'Norsk bokmål',
	nl: 'Nederlands',
	'pt-br': 'Português do Brasil',
	ro: 'Română',
	ru: 'Русский',
	sv: 'Svenska',
	tr: 'Türkçe',
	uk: 'Українська',
	vi: 'Tiếng Việt',
	'zh-cn': '简体中文',
	'zh-tw': '繁體中文',
} as const;

/**
 * Map of language codes to a written out language name.
 * Used to populate the language switcher in the navbar.
 */
export default courseLanguages;

export const rtlLanguages = new Set(['ar']);
