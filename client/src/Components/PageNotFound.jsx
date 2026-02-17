import React from "react";

export default function PageNotFound() {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-900">
      <div className="bg-gray-800 flex flex-col p-8 rounded-xl w-[400px] shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          404 Page Not Found :(
        </h1>
        <p className="text-gray-300 text-center mb-4">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
