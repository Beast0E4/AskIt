import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import useQuestions from "../hooks/useQuestions";
import { BsThreeDotsVertical } from "react-icons/bs";

// eslint-disable-next-line react/prop-types
function RepostCard({ questionId }) {

  const authState = useSelector((state) => state.auth);
  const [quesState] = useQuestions();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [userIdx, setUserIdx] = useState();
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(
    "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
  );
  const [quest, setQuest] = useState(null);
  const [dateDiff, setDateDiff] = useState(0);
  const [check, setCheck] = useState(false);

  async function findQues() {
    const foundQuest = quesState.downloadedQuestions.find(
      (ques) => ques._id === questionId
    );
    setQuest(foundQuest);
    console.log("Repost", foundQuest);
  }

  async function findName() {
    if (!quest) return; // Ensure quest is available
    const nm = authState.userList.findIndex((e) => e._id === quest?.userId);
    setUserIdx(nm);
    setName(authState?.userList[nm]?.name?.substring(0, 10) || "Anonymous");
    setImage(authState.userList[nm]?.image || image);
  }

  async function userView() {
    if (!authState.isLoggedIn) {
      navigate("/login");
      return;
    }
    if (authState.userList[userIdx]._id !== authState.data?._id) {
      navigate(`/profile?userid=${authState.userList[userIdx]._id}`);
    } else navigate("/profile");
  }

  async function onView() {
    if (!authState.isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(`/answer?question=${questionId}`);
  }

  function getTimeElapsed(date) {
    const now = new Date();
    const questionTime = new Date(date);
    const elapsedTime = now - questionTime;

    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      setDateDiff(`${days} day(s) ago`);
    } else if (hours > 0) {
      setDateDiff(`${hours} hour(s) ago`);
    } else if (minutes > 0) {
      setDateDiff(`${minutes} minute(s) ago`);
    } else {
      setDateDiff(`${seconds} second(s) ago`);
    }
  }

  useEffect(() => {
    findQues();
  }, [questionId]);

  useEffect(() => {
    if (quest) {
      getTimeElapsed(quest.createdAt);
      findName();
    }
    if (quest?.question?.length > 1000) {
      const newQuest = quest.question.substring(0, 1000) + "...";
      setQuest({ ...quest, question: newQuest });
      setCheck(true);
    }
  }, [quest, authState.selectedUser.likedQuestion?.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <article className="mb-2 w-full break-inside p-3 bg-gray-900 flex flex-col bg-clip-border rounded-md border-[1.5px] border-gray-800">
        <div className="flex flex-col pb-3">
        <div className="flex justify-between items-center">
                        <div className="flex">
                            <a className="inline-block mr-4" href={image}>
                                <img src={image} alt={name} className="rounded-full max-w-none w-10 h-10 object-cover" />
                            </a>
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center">
                                    <a onClick={userView} className="inline-block font-bold mr-2 text-sm hover:cursor-pointer hover:underline">{name}</a>
                                </div>
                                <div className="text-slate-300 text-xs">
                                    {dateDiff}
                                </div>
                            </div>
                        </div>
                        <div className="relative inline-block text-left z-[0]" ref={dropdownRef}>
                            <div>
                                <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex justify-center w-full shadow-sm px-4 py-2 focus:outline-none"
                                >
                                <BsThreeDotsVertical className="h-8 w-8 p-2 rounded-full hover:bg-gray-950" />
                                </button>
                            </div>

                            {isOpen && (
                                <div
                                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 focus:outline-none z-10"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="menu-button"
                                tabIndex="-1"
                                >
                                    <div className="py-1" role="none">
                                        <h2
                                            className="block px-4 py-2 text-sm text-white hover:bg-gray-700 font-semibold hover:cursor-pointer"
                                            role="menuitem"
                                            tabIndex="-1"
                                            onClick={onView}
                                        >
                                        View
                                        </h2>
                                    </div>
                                </div>
                            )}
                        </div>
                        </div>
          {quest?.topic && (
            <div className="mt-4">
              <p className="text-[0.5rem] rounded-2xl border-[0.1px] w-max px-2 py-1 hover:cursor-pointer border-[#F2BEA0] font-inconsolata">
                {quest.topic}
              </p>
            </div>
          )}
        </div>
        <div className="pb-2">
          {quest?.title && <h2 className="ml-2 text-lg font-bold mb-2">{quest.title}</h2>}
          <div className="ml-2">
            <p className="text-md">
              {quest?.question || ""}
            </p>
            {check && (
              <button
                className="text-xs text-[#F2BEA0]"
                onClick={() => {
                  setQuest(quest);
                  setCheck(!check);
                }}
              >
                Read more
              </button>
            )}
          </div>
          {quest?.image && (
            <div className="flex justify-center px-2">
              <img src={quest.image} className="py-2" />
            </div>
          )}
        </div>
      </article>
    </>
  );
}

export default RepostCard;
