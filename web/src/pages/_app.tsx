import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

import { Montserrat } from "@next/font/google";

const montserrat = Montserrat({ subsets: ["latin-ext"], display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={montserrat.className}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}
