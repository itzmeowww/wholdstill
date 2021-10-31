import { Link as ScrollLink } from "react-scroll";
export default function Intro() {
  // const links = [
  //   { name: "HOME", url: "/" },
  //   { name: "DEMO", url: "/" },
  //   { name: "INTEGRATE", url: "/" },
  // ];
  return (
    // bg-blue-400 bg-gradient-to-tr from-emerald-100 via-sky-300 to-fuchsia-300
    <div className="bg-gradient-to-r from-green-300 via-blue-400 to-purple-500 text-white h-screen w-full flex flex-col justify-center items-center py-4 relative">
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
          <button className="bg-blue-600 px-2 py-1 my-4 shadow-md text-base md:text-lg">
            Try Live Demo
          </button>
        </a>
      </div>

      <ScrollLink
        to="section2"
        smooth={true}
        duration={500}
        offset={-40}
        className="absolute bottom-10 w-12 animate-bounce mb-10 mx-auto cursor-pointer"
      >
        <img src="arrow.png"></img>
      </ScrollLink>
    </div>
  );
}
