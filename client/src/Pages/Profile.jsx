export default function Profile() {
  return (
    <div className="bg-gray-800">
      <div>
        <div>
          <img
            className="w-34 h-34 rounded-full object-cover"
            src="/defaultPfp.png"
            alt=""
          />
        </div>
        <div className="flex">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-300 mb-2"
          >
            Name
          </label>
          <input
            className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            type="text"
            id="name"
            value={"user1"}
            disabled
          />
          <label
            htmlFor="about"
            className="text-sm font-medium text-gray-300 mb-2"
          >
            About
          </label>
          <input
            className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            type="text"
            id="about"
            value={"user1 about"}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
