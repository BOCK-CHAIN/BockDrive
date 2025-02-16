function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-gray-700"></div>
        <div className="absolute top-0 left-0 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}

export default Loading;
