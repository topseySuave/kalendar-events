import { AppProps } from "next/app";
import Head from "next/head";
import "../style.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Gabriel's Calendar Event</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
