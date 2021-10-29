export default function Container(props) {
  return (
    <div className="px-5 sm:px-10 md:px-20 w-full py-5 sm:py-10">
      {props.children}
    </div>
  );
}
