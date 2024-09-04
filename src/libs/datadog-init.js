"use client";
import { useEffect, useState } from 'react';
// import { datadogRum } from '@datadog/browser-rum';
// import { datadogLogs } from '@datadog/browser-logs';
// import router from "next/router";
import { usePathname } from 'next/navigation';
import CookieConsent from "react-cookie-consent";



function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i=0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


const applicationId = process?.env?.NEXT_DD_RUM_APPLICATION_ID
const clientToken = process?.env?.NEXT_DD_RUM_CLIENT_TOKEN
const trackViewsManually = process?.env?.NEXT_DD_RUM_TRACK_VIEW_MANUALLY === "true"
const version = process?.env?.NEXT_DD_RUM_VERSION || '1.0.0'
const env = process?.env?.NEXT_DD_RUM_ENV || 'PRD'
const service = process?.env?.NEXT_DD_RUM_SERVICE || 'next.js-sample-application'
const site = process?.env?.NEXT_DD_RUM_SITE || 'datadoghq.com'


const proxyPath = process?.env?.NEXT_DD_RUM_APP_ROUTER_PROXY === "true" ? "/appApi/proxy/ddProxy" : "/api/proxy/ddProxy"


/*datadogLogs.init({
    clientToken: clientToken,
    site: site,
    service: service,
    env: env,
    version: version, 
    forwardErrorsToLogs: true,
    forwardConsoleLogs: "all",
    sessionSampleRate: 100,
    proxy: proxyPath
})
datadogLogs.logger.setLevel("info")
*/





export default function DatadogInit({ Component, pageProps }) {

    const [datadogRum, setDatadogRum] = useState()

    const handleRouteChange = (url) => {
        if (datadogRum) {
            console.log("App is changing to: ", url);
            const urlParsed = new URL(`${window.location.origin}${url}`)
            datadogRum.startView(urlParsed.pathname);
        }
    };

    function getGrantCookie() {
        // grant-cookie
        return window.document.cookie.includes("grant-cookie=true")
    }

    const pathname = usePathname()
    useEffect(() => {
        console.log("APP ROUTER")
        handleRouteChange(pathname)
    }, [pathname])

    // this function is to handle client-side actions
    useEffect(() => {
        if(window){
            const _datadogRum = window?.DD_RUM
            if (_datadogRum){
                const userObj = localStorage.getItem("userObj") ?
                    JSON.parse(localStorage.getItem("userObj")) :
                    {
                        id: makeid(10),
                        name: makeid(10),
                        email: `${makeid(5)}@${makeid(5)}.com`
                    }
                _datadogRum.setUser(userObj)
                _datadogRum.setGlobalContext({
                        loadingId: makeid(10),
                });
                localStorage.setItem("userObj", JSON.stringify(userObj));
                setDatadogRum(_datadogRum)
            }
        }
    },[])
    
    useEffect(() => {
        if (!datadogRum) return
        datadogRum.init({
            applicationId: applicationId,
            clientToken: clientToken,
            // `site` refers to the Datadog site parameter of your organization
            // see https://docs.datadoghq.com/getting_started/site/
            site: site,
            service: service,
            env: env,
            // Specify a version number to identify the deployed version of your application in Datadog
            version: version, 
            sessionSampleRate: 100,
            sessionReplaySampleRate: 20,
            trackUserInteractions: true,
            trackResources: true,
            trackLongTasks: true,
            defaultPrivacyLevel: 'mask-user-input',
            trackViewsManually: trackViewsManually,
            // proxy: proxyPath,
            proxy: (options) => `${proxyPath}Alt${options.path}?${options.parameters}`,
            trackingConsent: "not-granted",
            allowedTracingUrls: [() => {
                return true
            }],
            beforeSend: (event, context) => {
                // collect a RUM resource's response headers
                if (event.type === 'resource' && event.resource.type === 'fetch' && context?.response?.headers) {
                    event.context.responseHeaders = Object.fromEntries(context.response.headers)
                }
                return true
            }
        });
        datadogRum.setTrackingConsent(getGrantCookie() ? "granted" : "not-granted")
        if (!trackViewsManually) {
            return
        }
        // We listen to this event to determine whether to redirect or not
        if (!datadogRum?.getInternalContext?.()?.session_id) {
            datadogRum.startView(window.location.pathname)
        }
        // PAGE ROUTER OLD IMPLEMENTATION
        // router.events.on("routeChangeStart", handleRouteChange);
        // return () => {
        //    router.events.off("routeChangeStart", handleRouteChange);
        //};
    }, [datadogRum]);
      
    return <>
        <CookieConsent
            enableDeclineButton
            location="bottom"
            buttonText="GRANT ME!"
            cookieName="grant-cookie"
            style={{ background: "#2B373B" }}
            buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
            expires={150}
            onDecline={() => {
                datadogRum.setTrackingConsent("not-granted")
            }}
            onAccept={() => {
                datadogRum.setTrackingConsent("granted")
            }}
        >
            This website uses cookies to enhance the user experience.
        </CookieConsent>
    </>;
}
