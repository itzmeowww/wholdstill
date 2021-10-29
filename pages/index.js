import Head from "next/head";

import Intro from "../components/Intro";
import Detail from "../components/Detail";
import Compatibility from "../components/Compatibility";
import Line from "../components/Line";
import Integration from "../components/Integration";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start">
      <Head>
        <title>Wholdstill</title>
      </Head>
      <Intro />
      <Detail />
      <Line />
      <Compatibility />
      <Line />
      <Integration />
    </div>
  );
}
