import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import useQuestions from "../hooks/useQuestions";
import { BsThreeDotsVertical } from "react-icons/bs";
import PicModal from "./PicModal";

// eslint-disable-next-line react/prop-types
function RepostCard({ questionId }) {
  const authState = useSelector((state) => state.auth);
  const [quesState] = useQuestions();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [userIdx, setUserIdx] = useState(null);
  const [name, setName] = useState("Anonymous");
  const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png");
  const [isOpen, setIsOpen] = useState(false);
  const [quest, setQuest] = useState(null);
  const [fullQuestion, setFullQuestion] = useState(null);
  const [dateDiff, setDateDiff] = useState(0);
  const [check, setCheck] = useState(false);
  const [showPicModal, setShowPicModal] = useState(false);
  const [modalData, setModalData] = useState({ image: '', name: '' });

  async function findQues() {
    const foundQuest = quesState.downloadedQuestions.filter((q) => q._id === questionId);
    setQuest(foundQuest[0]);
  }

  async function findName() {
    if (quest?.userId && authState?.userList?.length > 0) {
      const nm = authState.userList.findIndex((e) => e?._id === quest?.userId);
      setUserIdx(nm);

      if(authState?.userList[nm]?.name) setName(authState?.userList[nm]?.name);
      if(authState?.userList[nm]?.image) setImage(authState?.userList[nm]?.image);
    }
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

  function getDate() {
    let date = quest.createdAt?.toString()?.split('T')[0].split('-').reverse().join("-");
    setDateDiff(date);
  }

  const closeModal = () => {
    setShowPicModal(false);
  };

  const imageClick = (name, image) => {
      console.log('haha' ,name, image)
      setModalData({
          name: name,
          image: image
      });
      setShowPicModal(true);
  }

  useEffect(() => {
    findQues();
  }, [questionId]);

  useEffect(() => {
    findName();
  }, [quest?.userId, authState?.userList]);

  useEffect(() => {
    if (quest) {
      getDate();
      if (quest.question?.length > 1000) {
        const newQuest = quest.question.substring(0, 1000) + "...";
        setQuest({ ...quest, question: newQuest });
        setCheck(true);
      }
    }
  }, [quest?.userId, questionId, quesState.questionList?.length]);

  useEffect(() => {
    if (quest?.question?.length > 1000) {
      setFullQuestion(quest);
      const newQuest = quest.question.substring(0, 1000) + "...";
      setQuest({ ...quest, question: newQuest });
      setCheck(true);
    }
  }, [quest?.userId, questionId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <article className="mb-2 w-full break-inside p-3 bg-gray-900 flex flex-col bg-clip-border rounded-md border-[2px] border-gray-700">
        <div className="flex flex-col pb-3">
          <div className="flex justify-between items-center">
            <div className="flex">
              <img src={image} alt={name} className="mr-4 rounded-full max-w-none w-10 h-10 object-cover hover:cursor-pointer" onClick={() => imageClick(name, image)} />
              <div className="flex flex-col justify-center">
                <div className="flex items-center">
                  <a onClick={userView} className="inline-block font-bold mr-2 text-sm hover:cursor-pointer hover:underline">
                    {name}
                  </a>
                </div>
                <div className="text-slate-300 text-xs">{dateDiff}</div>
              </div>
            </div>
            <div className="relative inline-block text-left z-[0]" ref={dropdownRef}>
              <div>
                <button onClick={() => setIsOpen(!isOpen)} className="inline-flex justify-center w-full shadow-sm px-4 py-2 focus:outline-none">
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
            <p className="text-md">{quest?.question || ""}</p>
            {check && (
              <button className="text-xs text-[#F2BEA0]" onClick={() => { setQuest(fullQuestion); setCheck(!check); }}>
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
        {showPicModal && (<PicModal
                            picture={modalData.image}
                            name={modalData.name}
                            closeModal={closeModal} />)}
      </article>
    </>
  );
}

export default RepostCard;
