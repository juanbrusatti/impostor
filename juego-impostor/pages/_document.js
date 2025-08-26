import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <meta name="application-name" content="Juego del Impostor" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Impostor" />
          <meta name="description" content="Juego del impostor - Diviértete con tus amigos" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#1e1e2f" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#1e1e2f" />
          
          <link rel="apple-touch-icon" href="/icon-192.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icon-192.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/icon-192.png" />
          
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4cafef" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;