export default function Intro() {
  // const links = [
  //   { name: "HOME", url: "/" },
  //   { name: "DEMO", url: "/" },
  //   { name: "INTEGRATE", url: "/" },
  // ];
  return (
    <div
      className="text-white h-screen w-full bg-blue-400 bg-gradient-to-tr from-emerald-100 via-sky-300 to-fuchsia-300
    flex flex-col justify-center items-center py-4 relative"
    >
      <img
        src="logo.png"
        className="top-0 left-0 absolute w-20 xs:w-32 md:w-48"
      />
      {/* <div className="flex flex-row justify-end w-full pr-5 xs:pr-10 text-sm xs:text-base">
        {links.map((link) => {
          return (
            <a href={link.url} className="mx-2">
              {link.name}
            </a>
          );
        })}
      </div> */}
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl sm:text-7xl md:text-9xl drop-shadow-lg">
          Wholdstill​
        </h1>
        <div className="h-0.5 w-36 md:w-80 bg-white my-4"></div>
        <h1 className="text-base sm:text-lg md:text-2xl">
          Wholdstill holds the whole screen still​
        </h1>
        <a href="/demo">
          <button className="bg-blue-600 px-2 py-1 my-4 shadow-md ">
            Try Live Demo
          </button>
        </a>
      </div>
      <img
        src="arrow.png"
        className="absolute bottom-10 w-12 animate-bounce mb-10"
      ></img>
    </div>
  );
}
