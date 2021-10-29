import Container from "./Container";
export default function Compatibility() {
  const logos = [
    { url: "images/browsers/Firefox.png" },
    { url: "images/browsers/GoogleChrome.png" },
    { url: "images/browsers/MicrosoftEdge.png" },
    { url: "images/browsers/Opera.png" },
    { url: "images/browsers/Safari.png" },
  ];
  return (
    <Container>
      <div className="w-full flex flex-col justify-center items-center ">
        <h1 className="text-2xl sm:text-4xl">Browser Compatibility</h1>
        <div className="flex justify-center w-full my-5">
          <h1 className="text-xs sm:text-base leading-6 sm:leading-8 text-center">
            Wholdstill uses getUsermedia/API which supports these browsers
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 lg:gap-10 w-4/5 items-center">
          {logos.map((logo) => {
            return <img src={logo.url} className="w-16 md:w-24" />;
          })}
        </div>
      </div>
    </Container>
  );
}
