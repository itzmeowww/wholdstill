import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function Demo() {
  const [loadedModel, setLoadedModel] = useState(false);
  const [complete, setComplete] = useState(true);
  const [openSetting, setOpenSetting] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [speed, setSpeed] = useState(0.1);
  const closeModal = () => {
    setOpenModal(false);
    setOpenUpload(false);
    setOpenHelp(false);
    setOpenSetting(false);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
  };

  const getSpeed = () => {
    if (document.getElementById("mySpeed"))
      return document.getElementById("mySpeed").innerHTML;
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
    // console.log(navigator.mediaDevices);
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
    console.log("loading");
    const MODEL_URL = "/models";
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);

    setLoadedModel(true);
    console.log("loaded");

    let movingAverage = 3;
    let couMovingAverage = 0;
    let posX = -1;
    let posY = -1;

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
      if (complete) {
        setComplete(false);
        let fullDesc = await faceapi.detectSingleFace(video, OPTION);

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
          console.log(text.style.marginLeft, text.style.marginTop);
        }
        setComplete(true);
      }
    }, 25);
  }, []);
  return (
    <div style={{ height: "300vh" }}>
      <h1 className="hidden" id="mySpeed">
        {speed}
      </h1>
      {openModal ? (
        <div className="flex w-full h-screen fixed z-10  justify-center items-center">
          <div
            onClick={closeModal}
            className="w-full h-screen bg-black bg-opacity-50 absolute"
          ></div>
          <div className=" bg-gray-50 px-5 py-10 mx-5 flex flex-col justify-center items-start rounded-md relative flex-wrap w-56 md:w-72">
            <button
              onClick={closeModal}
              className="-top-3 -right-3 absolute rounded-full bg-red-400 w-6 h-6 text-center"
            >
              ✕
            </button>
            {openUpload ? (
              <div>
                <input id="image-file" type="file" className="w-4/5" />
                <button
                  className="bg-blue-600 px-2 py-1 my-2 shadow-md text-white"
                  onClick={updateImg}
                >
                  Update Image
                </button>
              </div>
            ) : (
              <></>
            )}
            {openSetting ? (
              <div className="flex flex-col pb-10 w-4/5 mx-auto">
                <label HtmlFor="speed">
                  <b>Sensitivity</b>
                </label>
                <input
                  className="bg-blue-300  pl-2"
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
            {openHelp ? (
              <h1>
                <b> To try this demo version:</b>
                <ol>
                  <li>1. Enable camera access </li>
                  <li>
                    2. Focus on the text below or upload your images file 
                  </li>
                  <li>3. Adjust the sensitivity of the movement</li>
                  <li>4. Try moving your head</li>
                  <li>5. Enjoy your smooth experience</li>
                </ol>
              </h1>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="text-center mb-10 flex flex-col justify-start items-center px-20 py-10">
        <div className="flex justify-start w-full text-left"></div>
        <a href="/" className="text-blue-600 font-bold">
          Home
        </a>
        <div className="text-white">
          <button
            className="bg-blue-600 px-2 py-1 my-2 shadow-md mx-2"
            onClick={() => {
              setOpenModal(true);
              setOpenSetting(true);
            }}
          >
            Sensitivity
          </button>
          <button
            className="bg-blue-600 px-2 py-1 my-2 shadow-md mx-2"
            onClick={() => {
              setOpenModal(true);
              setOpenHelp(true);
            }}
          >
            Help
          </button>
          <button
            className="bg-blue-600 px-2 py-1 my-2 shadow-md mx-2"
            onClick={() => {
              setOpenModal(true);
              setOpenUpload(true);
            }}
          >
            Upload Image
          </button>
        </div>
      </div>

      <div
        style={{ transitionDuration: 500 }}
        className=" transition-all w-full overflow-hidden"
      >
        <div id="myText" className="overflow-hidden flex justify-center w-full">
          {loadedModel ? (
            <img
              id="my-img"
              src="images/demo.jpg"
              className="w-screen md:w-5/6"
              height="auto"
              width="100%"
            ></img>
          ) : (
            <h2 className="animate-pulse">Loading Model...</h2>
          )}
        </div>
      </div>
      <video crossOrigin="anonymous" id="myVid" className="hidden" />
    </div>
  );
}
