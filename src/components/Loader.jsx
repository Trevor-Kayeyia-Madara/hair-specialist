const Loader = () => {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
        <div className="flex flex-col items-center">
          <img src="/loader.gif" alt="Loading..." className="h-20 w-20" />
          <p className="text-gray-700 font-semibold mt-2">Loading...</p>
        </div>
      </div>
    );
  };
  
  export default Loader;
  