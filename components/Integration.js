export default function Integration() {
  return (
    <div className="w-full py-10 flex justify-center flex-col items-center">
      <h1 className="text-2xl sm:text-4xl mb-4">Usage</h1>
      <div className="flex flex-col  mx-2">
        <h1>
          The GitHub repository can be found
          <a
            href="https://github.com/itzmeowww/wholdstill"
            className="text-blue-600"
          >
            {" "}
            here.
          </a>
        </h1>
        <div className="bg-gray-200 rounded-md flex flex-col p-2 text-xs md:text-base">
          <code>git clone https://github.com/itzmeowww/wholdstill</code>
          <code>cd wholdstill</code>
          <code>yarn</code>
          <code>yarn build</code>
          <code>yarn start</code>
        </div>
      </div>
    </div>
  );
}
