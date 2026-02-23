import React from "react";

export default function PageNotFound() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-slate-900 px-4">
      <div className="bg-slate-800 flex flex-col p-8 rounded-xl w-full max-w-[400px] shadow-2xl border border-slate-600">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          404 Page Not Found :(
        </h1>
        <p className="text-slate-300 text-center mb-4">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
