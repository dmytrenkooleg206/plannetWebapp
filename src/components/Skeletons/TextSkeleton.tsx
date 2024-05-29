export default function TextSkeleton() {
  return (
    <div role="status" className="max-w-sm animate-pulse ">
      <div className="h-2.5 bg-white-300 rounded-full dark:bg-white-600 w-24 mb-2.5" />
      <div className="w-32 h-2 bg-white-200 rounded-full dark:bg-white-700" />
    </div>
  );
}
