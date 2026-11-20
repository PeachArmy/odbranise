export type PhoneKind = "short" | "local" | "freephone";

export interface Phone {
  display: string;
  kind: PhoneKind;
  label?: string;
}

/** Display text is the source of truth. tel: is derived so it cannot drift. */
export function phoneHref(phone: Phone): string {
  const digits = phone.display.replace(/\s+/g, "");
  if (!/^\d+$/.test(digits)) {
    throw new Error(`Неважечки број: ${phone.display}`);
  }
  if (phone.kind === "local") {
    if (!digits.startsWith("0") || digits.startsWith("0800")) {
      throw new Error(`Локален број мора да почнува со 0, а не со 0800: ${phone.display}`);
    }
    return `tel:+389${digits.slice(1)}`;
  }
  return `tel:${digits}`;
}

export function hostLabel(url: string): string {
  return url.replace(/^https:\/\//, "").replace(/\/$/, "");
}
