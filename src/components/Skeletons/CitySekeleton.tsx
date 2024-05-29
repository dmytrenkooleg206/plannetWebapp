export default function CitySekeleton() {
  return (
    <div role="status" className="max-w-[440px] animate-pulse ">
      <div className="bg-black-500 p-2.5 my-2.5 rounded flex">
        <div className="w-24 h-24 bg-white-300 rounded dark:bg-white-600" />
        <div className="ml-2.5 flex flex-col grow">
          <div className="h-6 bg-white-300 rounded-lg w-full dark:bg-white-600 mb-2.5" />
          <div className="h-2.5 w-24 bg-white-300 rounded-full dark:bg-white-600" />
          <div className="h-8 bg-white-300 rounded w-full dark:bg-white-600 mt-auto" />
        </div>
      </div>
    </div>
  );
}
