export default function LocationSekeleton() {
  return (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="bg-black-500 p-2.5 my-2.5 rounded flex">
        <div className="w-12 h-12 bg-white-300 rounded dark:bg-white-600" />
        <div className="ml-2.5 flex flex-col grow">
          <div className="h-3 w-36 bg-white-300 rounded-full dark:bg-white-600 mb-2.5" />
          <div className="h-4 bg-white-300 rounded-lg w-full dark:bg-white-600" />
        </div>
      </div>
    </div>
  );
}
