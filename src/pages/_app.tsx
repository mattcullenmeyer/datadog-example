import type { AppProps } from "next/app";
import Head from "next/head";
import { datadogRumSdk } from "@/libs/datadogRumSdk";

export default function App({ Component, pageProps }: AppProps) {
  return (
  <>
    <Head>
      <script dangerouslySetInnerHTML={{ __html: datadogRumSdk }} />
    </Head>
    
    <Component {...pageProps} />
  </>
  )
}
