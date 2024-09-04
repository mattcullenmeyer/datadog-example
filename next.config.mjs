/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_DD_RUM_APPLICATION_ID: process?.env?.NEXT_DD_RUM_APPLICATION_ID,
    NEXT_DD_RUM_CLIENT_TOKEN: process?.env?.NEXT_DD_RUM_CLIENT_TOKEN,
    NEXT_DD_RUM_TRACK_VIEW_MANUALLY: process?.env?.NEXT_DD_RUM_TRACK_VIEW_MANUALLY,
    NEXT_DD_RUM_VERSION: process?.env?.NEXT_DD_RUM_VERSION,
    NEXT_DD_RUM_ENV: process?.env?.NEXT_DD_RUM_ENV,
    NEXT_DD_RUM_SERVICE: process?.env?.NEXT_DD_RUM_SERVICE,
    NEXT_DD_RUM_SITE: process?.env?.NEXT_DD_RUM_SITE,
    NEXT_DD_RUM_APP_ROUTER_PROXY : process?.env?.NEXT_DD_RUM_APP_ROUTER_PROXY
  }
};

export default nextConfig;
