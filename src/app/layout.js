import { Cairo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "كوخ المونة ماركت | Kokh Al-Mouna Market",
  description: "اطلب مونة بيتك أونلاين - الدفع عند الاستلام",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" className={`${cairo.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}