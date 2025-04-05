import { useState } from "react";
import { User, MessageCircle, X, Heart } from "lucide-react";
import "./App.css";

const PROFILE_SELECTION = "PROFILE_SELECTION";
const MATCHES_LIST = "MATCHES_LIST";
const CHAT_SCREEN = "CHAT_SCREEN";

const ProfileSelector = () => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="relative">
        <img
          alt={"tty"}
          src={
            "http://localhost:8080/images/fcf41221-54b5-44c2-8b87-383c9254d681.jpg"
          }
        />
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black p-4 text-white">
          <h2 className="text-3xl font-bold">Foo Bar, 30</h2>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600">Hi, I'm debajit Deb</p>
      </div>
      <div className="flex justify-center space-x-4 p-4">
        <button
          className="rounded-full bg-red-500 p-4 text-white hover:bg-red-700"
          onClick={(e) => console.log("swipe left", e)}
        >
          <X size={24} />
        </button>
        <button
          className="rounded-full bg-green-500 p-4 text-white hover:bg-green-700"
          onClick={(e) => console.log("Swipe right", e)}
        >
          <Heart size={24} />
        </button>
      </div>
    </div>
  );
};

const MatchesList = ({ onSelectMatch }) => {
  return (
    <div className={"rounded-lg p-4 shadow-lg"}>
      <h2 className={"mb-4 text-2xl font-bold"}>Matches</h2>
      <ul>
        {[
          {
            id: 1,
            firstName: "Debajit",
            lastName: "Deb",
            imageUrl:
              "http://localhost:8080/images/fcf41221-54b5-44c2-8b87-383c9254d681.jpg",
            age: 27,
          },
          {
            id: 2,
            firstName: "Debajit",
            lastName: "Deb",
            imageUrl:
              "http://localhost:8080/images/767e0e5c-66ba-45f7-8019-35822f7d1a92.jpg",
            age: 27,
          },
        ].map((match) => {
          return (
            <li key={match.id} className={"mb-3"}>
              <buttom
                className={"item-center flex w-full rounded hover:bg-gray-100"}
                onClick={onSelectMatch}
              >
                <img
                  src={match.imageUrl}
                  alt={match.firstName + " " + match.lastName}
                  className={"mr-3 h-16 w-16 rounded-full"}
                />
                <span>
                  <h3 className={"font-bold"}>
                    {match.firstName} {match.lastName}
                  </h3>
                </span>
              </buttom>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const ChatScreen = () => {
  const [input, setInput] = useState('');

  const onSend = () => {
    if (input.trim() !== '') {
      console.log("sending message", input.trim());
      setInput('');
    }
  }

  return (
    <div className={"rounded-lg p-4 shadow-lg"}>
      <h2 className={'text-2xl font-bold mb-4'}>Chat with Debajit</h2>
        <div className="border rounded overflow-y-auto mb-4 p-2">
        {[
          "Hi", 
          "How are you?",
          "How are you?",
          "How are you?",
          "How are you?",
          "How are you?",
          "How are you?",
          "How are you?",
          "How are you?",
        ].map((message, idx) => (
          <div key={idx}>
            <div className="mb-4 p-2 rounded bg-gray-100">{message}</div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input type="text" 
          className="border flex-1 rounded p-2 mr-2"
          placeholder={"Type a message"}
          value={input}
          onChange={(e) => {
            e.preventDefault();
            setInput(e.target.value);
          }}
        />
        <button className={"bg-blue-500 text-white rounded p-2 bg-gradient-to-bl disabled:bg-gray-500"} 
          onClick={onSend}
          disabled={input === ''}
          >
            Send
          </button>
      </div>
    </div>
  );
};



function App() {
  const [selection, setSelection] = useState(PROFILE_SELECTION);

  const renderScreen = (selection) => {
    switch (selection) {
      case PROFILE_SELECTION:
        return <ProfileSelector />
      case MATCHES_LIST:
        return <MatchesList onSelectMatch={() => setSelection(CHAT_SCREEN)} />
      case CHAT_SCREEN:
        return <ChatScreen />
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <nav className="flex justify-between py-4">
        <User
          onClick={(e) => {
            e.preventDefault();
            setSelection(PROFILE_SELECTION);
          }}
        />
        <MessageCircle
          onClick={(e) => {
            e.preventDefault();
            setSelection(MATCHES_LIST);
          }}
        />
      </nav>
      {renderScreen(selection)}
    </div>
  );
}

export default App;
