"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as (typeof routing.locales)[number];
    router.replace(pathname, { locale: next });
  };

  return (
    <select defaultValue={routing.defaultLocale} onChange={onChange} aria-label="Language">
      <option value="en">English</option>
      <option value="pt">Português</option>
    </select>
  );
};
