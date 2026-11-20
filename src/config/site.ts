/**
 * Единствено место за името, насловот во картичката и брзиот излез.
 * `brand` е логото. `documentTitle` е <title> на СЕКОЈА страница — нека остане
 * неутрално, за историјата и прегледот на линк да не го кажуваат предметот.
 * `quickExitUrl` мора да е https. Копчето користи location.replace.
 * Кога ќе се проверат броевите одново, смени ја `verifiedOnLabel`.
 */
export const site = {
  brand: "Зора",
  documentTitle: "Зора",
  defaultLocale: "mk" as const,
  locales: ["mk"] as const,
  quickExitUrl: "https://weather.com/",
  verifiedOnLabel: "20.11.2026",
};

export const paths = {
  home: "/",
  contacts: "/komu-da-se-javam",
  tracks: "/sokrij-gi-tragite",
  articles: "/statii",
} as const;
