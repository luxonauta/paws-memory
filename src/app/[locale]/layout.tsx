import "../globals.css";

import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans"
});

type Params = Promise<{ locale: string }>;

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description")
  };
};

const LocaleLayout = async ({ children, params }: { children: React.ReactNode; params: Params }) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return null;
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${notoSans.variable} antialiased`} suppressHydrationWarning>
      <body className="text-xs leading-relaxed font-medium text-slate-600">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
