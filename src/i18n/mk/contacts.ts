import type { Phone } from "./phones";

/**
 * Не додавај број што не е јавно проверен.
 * Извор: WAVE / reagiraj-bidibezbedna.mk / страници на организациите, 20.11.2026.
 * Кога ќе провериш одново, смени ја verifiedOnLabel во src/config/site.ts
 * и списокот во scripts/check-build.mjs.
 * Локалните броеви се бираат како +389 без почетната 0. Кратките и 0800 се бираат како што се напишани.
 */

export interface HelpBar {
  label: string;
  order: number;
}

export interface Contact {
  id: string;
  title: string;
  org?: string;
  description?: string;
  phones: Phone[];
  url?: string;
  helpBar?: HelpBar;
}

export const contacts: Contact[] = [
  {
    id: "141700",
    title: "141 700",
    org: "Национален совет за родова еднаквост",
    description:
      "Бесплатна SOS линија, 24 часа, секој ден. На македонски, албански, ромски и турски јазик.",
    phones: [{ display: "141 700", kind: "short" }],
    helpBar: { label: "Бесплатно", order: 2 },
  },
  {
    id: "15315",
    title: "15 315",
    org: "Кризен центар „Надеж“",
    description: "SOS линија, 24 часа, секој ден.",
    phones: [{ display: "15 315", kind: "short" }],
    url: "https://krizencentar.org.mk/",
    helpBar: { label: "SOS линија", order: 1 },
  },
  {
    id: "192",
    title: "192",
    org: "Полиција",
    phones: [{ display: "192", kind: "short" }],
    helpBar: { label: "Полиција", order: 3 },
  },
  {
    id: "glas",
    title: "Глас против насилство",
    description: "Советување.",
    phones: [
      { label: "Скопје", display: "075 255 154", kind: "local" },
      { label: "Тетово", display: "075 344 770", kind: "local" },
      { label: "Канцеларија", display: "02 609 0066", kind: "local" },
    ],
    url: "https://www.glasprotivnasilstvo.org.mk/",
  },
  {
    id: "hera",
    title: "ХЕРА",
    phones: [
      { display: "02 3200 007", kind: "local" },
      { display: "070 249 596", kind: "local" },
    ],
    url: "https://hera.org.mk/",
  },
  {
    id: "ese",
    title: "ЕСЕ",
    description: "Правна помош.",
    phones: [
      { display: "02 3117 866", kind: "local" },
      { display: "071 266 101", kind: "local" },
    ],
    url: "https://esem.org.mk/",
  },
  {
    id: "helsinki",
    title: "Хелсиншки комитет",
    description: "Бесплатна правна помош.",
    phones: [{ display: "0800 44 222", kind: "freephone" }],
    url: "https://mhc.org.mk/",
  },
  {
    id: "myla",
    title: "МЗМП / MYLA",
    phones: [{ display: "02 3220 870", kind: "local" }],
    url: "https://myla.org.mk/",
  },
  {
    id: "lastrada",
    title: "Ла Страда",
    description: "Трговија со луѓе.",
    phones: [{ display: "0800 11111", kind: "freephone" }],
    url: "https://lastrada.org.mk/",
  },
  {
    id: "bushavko",
    title: "Ало Бушавко",
    description: "Детска линија.",
    phones: [{ display: "070 390 632", kind: "local" }],
    url: "https://childrensembassy.org.mk/",
  },
];

export function helpBarContacts(): Contact[] {
  return contacts
    .filter((contact) => contact.helpBar)
    .sort((a, b) => a.helpBar!.order - b.helpBar!.order);
}
