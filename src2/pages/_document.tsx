import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head/>
      <body>
        <script src="https://static.iadvize.com/conversation-panel-app-lib/2.9.0/idzcpa.umd.production.min.js"></script>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  )
}
