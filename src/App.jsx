import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { User, MessageCircle, X, Heart } from "lucide-react";
import "./App.css";

const PROFILE_SELECTION = "PROFILE_SELECTION";
const MATCHES_LIST = "MATCHES_LIST";
const CHAT_SCREEN = "CHAT_SCREEN";

const getImageUrl = (imgId) => `http://localhost:8080/images/${imgId}`;

const Spinner = () => {
  return (
    <div className="animate-pulse">
      <p>Loading</p>
    </div>
  );
};

const ProfileSelector = () => {
  const [profile, setProfile] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // Get user profile
  const getUserProfile = async () => {
    !!profile && setLoading(true);

    try {
      const userProfile = await axios.get(
        "http://localhost:8080/profile/random",
        {
          headers: {
            Accept: "*",
          },
        },
      );

      console.log(userProfile.data);

      setProfile(userProfile.data);
    } catch (e) {
      throw new Error("Failed to fetch data from api", e);
    } finally {
      setLoading(false);
    }
  };

  // Get Matched
  const onSendLike = async (profileId) => {
    await axios.post(
      "http://localhost:8080/matches",
      {
        profileId: profileId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
      {loading || profile === undefined ? (
        <Spinner />
      ) : (
        <>
          <div className="relative">
            <img alt={"tty"} src={getImageUrl(profile.imageUrl)} />
            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black p-4 text-white">
              <h2 className="text-3xl font-bold">
                {profile.firstName} {profile.lastName}
                {","} {profile.age}
              </h2>
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-600">{profile.bio}</p>
          </div>
          <div className="flex justify-center space-x-4 p-4">
            <button
              className="rounded-full bg-red-500 p-4 text-white hover:bg-red-700"
              onClick={getUserProfile}
            >
              <X size={24} />
            </button>
            <button
              className="rounded-full bg-green-500 p-4 text-white hover:bg-green-700"
              onClick={(e) => {
                e.preventDefault();
                onSendLike(profile.id);
                getUserProfile();
              }}
            >
              <Heart size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const MatchesList = ({ onSelectMatch }) => {
  const [matchesList, setMatchesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // get all matches
  const getAllMatches = async () => {
    setLoading(true);

    try {
      const matches = (await axios.get("http://localhost:8080/matches")).data;

      setMatchesList(matches);
    } catch (e) {
      throw new Error("Unable to fetch matches", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMatches();
  }, []);

  return loading || matchesList === undefined ? (
    <Spinner />
  ) : (
    <div className={"rounded-lg p-4 shadow-lg"}>
      <h2 className={"mb-4 text-2xl font-bold"}>Matches</h2>
      <ul>
        {matchesList.map((match) => {
          return (
            <li key={match.id} className={"mb-3"}>
              <button
                className={"item-center flex w-full rounded hover:bg-gray-100"}
                onClick={() => {
                  localStorage.setItem("CONV_ID", match.conversationId);
                  localStorage.setItem("PROFILE_DATA", JSON.stringify(match.profile))
                  onSelectMatch();
                }}
              >
                <img
                  src={getImageUrl(match.profile.imageUrl)}
                  alt={match.profile.firstName + " " + match.profile.lastName}
                  className={"mr-3 h-16 w-16 rounded-full"}
                />
                <span>
                  <h3 className={"font-bold"}>
                    {match.profile.firstName} {match.profile.lastName}
                  </h3>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const ChatScreen = () => {
  const [conversationList, setConversationList] = useState([]);
  const [input, setInput] = useState("");

  const onSendMessage = async (message, conversationId) => {
    const res = await axios.post(
      `http://localhost:8080/conversations/${conversationId}`,
      {
        messageText: message,
        authorId: "user",
        messageTime: "2025-04-06T00:11:12.134Z",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("RESp => ", res);
  };

  const onSend = async () => {
    if (input.trim() !== "") {
      console.log("sending message", input.trim());

      setInput("");

      await onSendMessage(input, localStorage.getItem("CONV_ID"));

      setTimeout(() => getConversations(localStorage.getItem("CONV_ID")), 1000);
    }
  };

  const getConversations = async (conversationId) => {
    const conversations = (
      await axios.get(`http://localhost:8080/conversations/${conversationId}`)
    ).data;
    console.log(conversations);

    setConversationList([...conversations.messages]);
  };

  useEffect(() => {
    const convId = localStorage.getItem("CONV_ID");
    console.log(convId);

    getConversations(convId);
  }, []);

  return (
    <div className={"rounded-lg p-4 shadow-lg"}>
      <h2 className={"mb-4 text-2xl font-bold"}>Chat with {JSON.parse(localStorage.getItem("PROFILE_DATA")).firstName}</h2>
      <div className="mb-4 h-100 overflow-y-auto rounded border p-2">
        {conversationList.map((message, idx) => (
          <div key={message.messageTime}>
            {message.authorId === "user" ? (
              <div className="mb-4 rounded bg-blue-300 p-2">
                {message.messageText}
              </div>
            ) : (
              <div className="mb-4 rounded bg-gray-300 p-2">
                {message.messageText}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="mr-2 flex-1 rounded border p-2"
          placeholder={"Type a message"}
          value={input}
          onChange={(e) => {
            e.preventDefault();
            setInput(e.target.value);
          }}
          onKeyUp={async (e) => {
            if (e.key === "Enter") {
              await onSend();
            }
          }}
        />
        <button
          className={
            "rounded bg-blue-500 bg-gradient-to-bl p-2 text-white disabled:bg-gray-500"
          }
          onClick={onSend}
          disabled={input === ""}
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
        return <ProfileSelector />;
      case MATCHES_LIST:
        return <MatchesList onSelectMatch={() => setSelection(CHAT_SCREEN)} />;
      case CHAT_SCREEN:
        return <ChatScreen />;
    }
  };

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
