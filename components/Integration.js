import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function Integration() {
  const exampleCode = `git clone https://github.com/itzmeowww/wholdstill
cd wholdstill
yarn
yarn build
yarn start`;
  return (
    <div className="w-full py-10 flex justify-center flex-col items-center">
      <h1 className="text-2xl sm:text-4xl mb-4">Usage</h1>
      <div className="flex flex-col  mx-2 text-xs sm:text-base leading-6 sm:leading-8">
        <h1 className=" text-center">
          The GitHub repository can be found
          <a
            href="https://github.com/itzmeowww/wholdstill"
            className="text-blue-600"
          >
            {" "}
            here.
          </a>
        </h1>
        <div className="w-80 sm:w-auto overflow-x-auto text-base">
          <SyntaxHighlighter language="bash">{exampleCode}</SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
