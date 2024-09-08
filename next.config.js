/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    trailingSlash: true,
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.azurewebsites.net'
            },
            {
                protocol: 'https',
                hostname: 'i.ytimg.com'
            },
            {
                protocol: 'https',
                hostname: 'localhost'
            },
            {
                protocol: 'https',
                hostname: '**.azurefd.net'
            },
            {
                protocol: 'https',
                hostname: '**.alaskanative.net'
            }
        ]
    },
    publicRuntimeConfig: {
        recaptchaKey: '6LdfeJAoAAAAAF7AoHil1QNT1lUrKAX3od05jc7g',
        googleMapApiKey: 'AIzaSyC3tldJbWSMybEu9Isp9dWaO07AkUSS0l4'
    },
}

module.exports = nextConfig
