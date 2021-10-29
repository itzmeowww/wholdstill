import Head from "next/head";
import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function Home() {
  const [loadedModel, setLoadedModel] = useState(false);

  const [complete, setComplete] = useState(true);
  const [openSetting, setOpenSetting] = useState(false);
  const [speed, setSpeed] = useState(0.1);
  const toggleSetting = () => {
    setOpenSetting(!openSetting);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
  };

  const getSpeed = () => {
    if (document.getElementById("speed"))
      return document.getElementById("speed").value;
    return 0.1;
  };
  const updateImg = () => {
    let files = document.getElementById("image-file").files;
    if (files && files[0]) {
      var img = document.getElementById("my-img");
      img.onload = () => {
        URL.revokeObjectURL(img.src); // no longer needed, free memory
      };
      img.src = URL.createObjectURL(files[0]); // set src to blob url
    }
  };
  useEffect(async () => {
    clearInterval();
    const video = document.getElementById("myVid");
    const text = document.getElementById("myText");

    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");
      video.style.width = "100px";

      let facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
      let constraints = {
        audio: false,
        video: {
          facingMode: facingMode,
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function success(stream) {
          video.srcObject = stream;
        });
    }

    const MODEL_URL = "/models";
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);

    setLoadedModel(true);
    // let count = 1;
    let movingAverage = 3;
    let couMovingAverage = 0;
    let posX = -1;
    let posY = -1;
    let oldPosX = -1;
    let oldPosY = -1;
    let averageX = 0.0;
    let averageY = 0.0;
    let posList = [];

    let inputSize = 96;
    let scoreThreshold = 0.4;
    const OPTION = new faceapi.TinyFaceDetectorOptions({
      inputSize,
      scoreThreshold,
    });

    setInterval(async () => {
      // tiny_face_detector options

      // console.log(`start : ${count}`);

      // detect all faces and generate full description from image
      // including landmark and descriptor of each face
      if (complete) {
        setComplete(false);
        let fullDesc = await faceapi.detectSingleFace(video, OPTION);
        // console.log(fullDesc);
        if (fullDesc != undefined) {
          let currentX = Math.floor(fullDesc.box.x * 20) / 20;
          let currentY = Math.floor(fullDesc.box.y * 20) / 20;
          if (couMovingAverage <= movingAverage) {
            averageX = averageX + currentX;
            averageY = averageY + currentY;
            posList.push({ x: currentX, y: currentY });
            couMovingAverage = couMovingAverage + 1;
          } else {
            averageX = averageX - posList[0].x;
            averageY = averageY - posList[0].y;
            posList.shift();

            averageX = averageX + currentX;
            averageY = averageY + currentY;
            posList.push({ x: currentX, y: currentY });
          }
          console.log(currentX, averageX);

          if (posX == -1) {
            posX = currentX;
          }

          if (posY == -1) {
            posY = currentY;
          }

          let speedConst = getSpeed();

          text.style.marginLeft =
            speedConst * (posX - averageX / movingAverage) + "px";
          text.style.marginTop =
            speedConst * (averageY / movingAverage - posY) + "px";
          // if (
          //   Math.abs(currentX - oldPosX) < 1 ||
          //   Math.abs(currentY - oldPosY) < 1
          // ) {
          // } else {
          //   text.style.marginLeft = speedConst * (posX - currentX) + "px";
          //   text.style.marginTop = speedConst * (currentY - posY) + "px";
          // }
          oldPosX = currentX;
          oldPosY = currentY;

          // console.log(speedConst);
        }
        setComplete(true);
      }

      // console.log(`end : ${count}`);
      // count++;
    }, 25);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start pt-2 ">
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />

        <title>Wholdstill</title>
        <link rel="icon" href="/icons/icon-256.png" />

        <meta name="application-name" content="Wholdstill" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wholdstill" />
        <meta name="description" content="Wholdstill" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon.png" />
        {/* <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
         */}
        {/*
        
        
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />


        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="PWA App" />
        <meta name="twitter:description" content="Best PWA App in the world" />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@DavidWShadow" />


        <meta property="og:type" content="website" />
        <meta property="og:title" content="PWA App" />
        <meta property="og:description" content="Best PWA App in the world" />
        <meta property="og:site_name" content="PWA App" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta
          property="og:image"
          content="https://yourdomain.com/icons/apple-touch-icon.png"
        /> */}
      </Head>
      <div className="text-center mb-10 flex flex-col justify-start items-center">
        <h1 className="text-6xl font-bold">Wholdstill</h1>
        <h1 className="text-3xl font-thin">whole + hold + still</h1>

        <div>
          <button
            className="bg-blue-400 rounded-md px-2 py-1 shadow-lg my-2 w-24"
            onClick={toggleSetting}
          >
            Setting
          </button>
        </div>
        <div>
          <input id="image-file" type="file" className=" w-1/2" />
          <button
            className="bg-blue-400 rounded-md px-2 py-1 shadow-lg "
            onClick={updateImg}
          >
            Update Image
          </button>
        </div>
      </div>
      {openSetting ? (
        <div className="flex flex-col pb-10">
          <label HtmlFor="speed">Speed </label>
          <input
            id="speed"
            type="number"
            step={0.1}
            onChange={handleSpeedChange}
            value={speed}
          />
        </div>
      ) : (
        <></>
      )}

      <div
        style={{ "transition-duration": 500 }}
        className=" transition-all w-full overflow-hidden"
      >
        <div id="myText" className="overflow-hidden flex justify-center w-full">
          {loadedModel ? (
            <>
              <img
                id="my-img"
                src="instruction.jpeg"
                className="w-screen md:w-5/6"
                height="auto"
                width="100%"
              ></img>
              {/* <iframe src="quiz.pdf" width="400px" height="400px"></iframe> */}
            </>
          ) : (
            <h2 className="animate-pulse">Loading Model...</h2>
          )}
        </div>
      </div>

      <video crossOrigin="anonymous" id="myVid" className="hidden" />
    </div>
  );
}
