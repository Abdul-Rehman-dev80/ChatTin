import ChatCard from "./ChatCard";

export default function MessageList() {
  const messageListArr = [
    {
      pfp: "./defaultPfp.png",
      username: "User1",
      lastMessage: "Hey, how are you?",
      time: "2:30 PM",
    },
    {
      pfp: "./defaultPfp.png",
      username: "User2",
      lastMessage: "Hey, how are you?",
      time: "3:40 PM",
    },
    {
      pfp: "./defaultPfp.png",
      username: "User3",
      lastMessage: "Hey, how are you?",
      time: "4:40 PM",
    },
  ];
  return (
    <div className="bg-gray-700 w-[50%] min-w-[270px] flex flex-col border-r border-gray-600">
      <div className="px-4 py-5 border-b border-gray-600">
        <h1 className="text-2xl font-bold text-white">ChatTin</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="flex flex-col">
          {messageListArr.map((msg, index) => (
            <ChatCard key={index} details={msg} />
          ))}
        </div>
      </div>
    </div>
  );
}
