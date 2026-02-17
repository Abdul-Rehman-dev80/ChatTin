import { getAllUsers } from "../Services/usersService";
import ChatCard from "./ChatCard";
import SearchBar from "./SearchBar";
import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";

export default function MessageList() {
  const { data, isPending, error } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  return (
    <div className="bg-gray-700 w-[50%] min-w-[270px] flex flex-col border-r border-gray-600">
      <div className="px-2 py-2">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          ChatTin
        </h1>
        <SearchBar />
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="flex flex-col">
          {data &&
            data.map((user, index) => (
              <ChatCard
                key={index}
                details={{
                  pfp: user.pfp,
                  username: user.username,
                  lastMessage: "Last message",
                  time: "2:30 PM",
                }}
              />
            ))}
        </div>
      </div>
      {isPending && <Loader />}
      {error && <div className="text-red-500">{error.message}</div>}
    </div>
  );
}
