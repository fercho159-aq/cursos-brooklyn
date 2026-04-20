import type { Metadata } from 'next'
import Script from 'next/script'
import { Poppins } from 'next/font/google'
import './globals.css'

// Font Awesome config
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cursosbrooklyn.com'),
  title: {
    default: 'Cursos Brooklyn | Ingles y Marketing Digital',
    template: '%s | Cursos Brooklyn'
  },
  description: 'Aprende Ingles con certificacion Oxford y SELPIP, y Marketing Digital. Transforma tu futuro profesional con Cursos Brooklyn.',
  keywords: ['cursos ingles', 'certificacion oxford', 'SELPIP', 'marketing digital', 'chimalhuacan', 'cursos brooklyn'],
  authors: [{ name: 'Cursos Brooklyn' }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'Cursos Brooklyn',
    title: 'Cursos Brooklyn | Ingles y Marketing Digital',
    description: 'Aprende Ingles con certificacion Oxford y SELPIP, y Marketing Digital.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'vl6aLuOzfdm0Tit04g75UlzN8u3Ii6NmRlWBkWLjfyg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-K2DF0DHD60"
        />
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-K2DF0DHD60');
            `,
          }}
        />
      </head>
      <body className={poppins.variable}>
        {children}
      </body>
    </html>
  )
}
