import { site } from "../config/site";
import { contacts } from "./mk/contacts";
import { tracks } from "./mk/tracks";
import { ui } from "./mk/ui";

const dictionaries = {
  mk: { ui, contacts, tracks },
} as const;

export type Locale = keyof typeof dictionaries;

export function getDictionary(locale: Locale = site.defaultLocale) {
  return dictionaries[locale];
}
