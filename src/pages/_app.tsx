import type { AppProps } from "next/app";
import Head from "next/head";
import "@/libs/datadogRumSdk";
import DatadogInit from "@/libs/datadog-init";

export default function App({ Component, pageProps }: AppProps) {
  return (
  <>
    <DatadogInit />
    <Component {...pageProps} />
  </>
  )
}
