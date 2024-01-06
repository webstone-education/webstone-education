/* @see https://github.com/withastro/docs/blob/main/src/i18n/translation-checkers.ts */
import enNav from './translations/en/nav';
import type enUI from './translations/en/ui';
import type { allLanguages } from './languages';

export type UIDictionaryKeys = keyof typeof enUI;
export type UIDict = Partial<typeof enUI>;
export type UILanguageKeys = keyof typeof allLanguages;

/** Helper to type check a dictionary of UI string translations. */
export const UIDictionary = (dict: Partial<typeof enUI>) => dict;

type NavDictionaryKeys = (typeof enNav)[number]['key'];
export type NavDictItem = {
	text: string;
	key: NavDictionaryKeys;
	labelIsTranslated: boolean;
	isFallback?: boolean;
} & ({ slug: string } | { header: true; });
export type NavDict = Array<NavDictItem>;

/**
 * Helper to type check and process a dictionary of navigation menu translations.
 * Converts it to an array matching the English menu’s sorting with English items used as fallback entries.
 */
export const NavDictionary = (dict: Partial<Record<NavDictionaryKeys, string>>) => {
	const orderedDictionary: NavDict = [];
	for (const enEntry of enNav) {
		const text = dict[enEntry.key] || enEntry.text;
		orderedDictionary.push({ ...enEntry, text, labelIsTranslated: !!dict[enEntry.key] });
	}
	return orderedDictionary;
};
