import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getQuestion, voteQuestion } from "../redux/Slices/ques.slice";
import { getVoted } from "../redux/Slices/auth.slice";
import PicModal from "./PicModal";

// eslint-disable-next-line react/prop-types
function RepostPollCard({questionId}) {

    const authState = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const dropdownRef = useRef(null);

    const [arr, setArr] = useState();
    const [creator, setCreator] = useState();
    const [topic, setTopic] = useState();
    const [title, setTitle] = useState();
    const [quesImage, setQuesImage] = useState();
    const [createdAt, setCreatedAt] = useState();
    const [votes, setVotes] = useState(0);
    const [userIdx, setUserIdx] = useState();
    const [name, setName] = useState('Anonymous');
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")
    const [isOpen, setIsOpen] = useState(false);
    const [dateDiff, setDateDiff] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [orgQues, setOrgQues] = useState("");
    const [quest, setQuest] = useState("");
    const [check, setCheck] = useState(false);
    const [showPicModal, setShowPicModal] = useState(false);
    const [modalData, setModalData] = useState({ image: '', name: '' });

    async function onVoted(index, id) {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        if(selectedId) return;
        setSelectedId(id);
        const res = await dispatch(voteQuestion({
            quesId: questionId,
            req: {
                optionId: arr[index]._id,
                userId: authState.data?._id
            }
        }))
        if(res) await dispatch(getVoted(authState.data?._id))
    }

    async function findName(){
        const nm = authState.userList.findIndex((e) => e._id === creator);
        setUserIdx(nm);
        if(authState?.userList[nm]?.name) setName(authState?.userList[nm]?.name.substring(0, 10));
        if(authState.userList[nm]?.image) setImage(authState.userList[nm]?.image);
    }

    async function userView() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        if(!authState.userList[userIdx]?._id) return;
        if(authState.userList[userIdx]?._id != authState.data?._id) navigate(`/profile?userid=${authState.userList[userIdx]?._id}`);
        else navigate('/profile');
    }

    function getDate() {
        let date = createdAt?.toString()?.split('T')[0].split('-').reverse().join("-");
        setDateDiff(date);
    }

    async function loadVoted() {
        if(authState.isLoggedIn) await dispatch(getVoted(authState.data?._id))
    }

    async function loadQuestion() {
        const res = await dispatch(getQuestion(questionId));
        const ques = res.payload?.data?.question;
        setCreatedAt(ques.createdAt);
        setCreator(ques.userId);
        setQuesImage(ques.image);
        setArr(ques.poll);
        setTopic(ques.topic);
        setTitle(ques.title);
        setQuest(ques.question);
        setOrgQues(ques.question);
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
        loadVoted();
    }, [questionId])

    useEffect(() => {
        if(quest?.length > 1000){
            const newQuest = quest.substring(0, 1000) + "...";
            setQuest(newQuest); setCheck(true);
        }
    }, [questionId])

    useEffect(() => {
        loadQuestion();
    }, [selectedId, authState.voted?.length])

    useEffect(() => {
        if(!authState.isLoggedIn){
            dispatch(getVoted("000000000000000000000000"))
            setSelectedId(null)
        }
    }, [authState.isLoggedIn])

    useEffect(() => {
        if (arr) {
            const totalVotes = arr.reduce((acc, opt) => acc + opt.votes, 0);
            setVotes(totalVotes);
        }
    }, [arr]);

    useEffect(() => {
        const checkArr = arr?.filter((option) => authState.voted?.includes(option._id));
        if(checkArr?.length) setSelectedId(checkArr[0]._id);
    }, [arr])

    useEffect(() => {
        findName(); getDate();
    }, [creator, createdAt])


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
        <article className="mb-2 w-full break-inside p-3 bg-gray-900 flex flex-col bg-clip-border rounded-md border-[2px] border-gray-800">
            <div className="flex flex-col pb-3">
                <div className="flex justify-between items-center">
                    <div className="flex">
                        <img src={image} alt={name} className="mr-4 rounded-full max-w-none w-10 h-10 object-cover hover:cursor-pointer" onClick={() => imageClick(name, image)} />
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center">
                                <a onClick={userView} className="inline-block font-bold mr-2 text-sm hover:cursor-pointer hover:underline">{name}</a>
                            </div>
                            <div className="text-slate-300 text-xs">
                                {dateDiff}
                            </div>
                        </div>
                    </div>
                </div>
                {topic && 
                <div className="mt-4">
                    <p className="text-[0.5rem] rounded-2xl border-[0.1px] w-max px-2 py-1 hover:cursor-pointer border-[#F2BEA0] font-inconsolata">{topic}</p>
                </div>}
            </div>
            <div className="pb-2">
                {title && <h2 className="ml-2 text-lg font-bold mb-2">{title}</h2>}
                <div className="ml-2 mb-2">
                    <p className="text-md">
                        {quest}
                    </p>
                    {check && <button className="text-xs text-[#F2BEA0]" onClick={() => {
                        setQuest(orgQues); setCheck(!check);
                    }}>
                        Read more
                    </button>}
                </div>
                {quesImage && <div className="flex justify-center px-2"><img src={quesImage} className="py-2"/></div>}
                <div>
                <div className="space-y-4 px-5">
                    {arr?.map((option, index) => (
                        <div key={index} className="w-full">
                            <div className="flex justify-between">
                                <div className="flex">
                                    <input
                                        type="checkbox"
                                        checked={selectedId === option._id}
                                        onChange={() => onVoted(index, option._id)}
                                        className="mr-2"
                                    />
                                    <h2 className="text-white text-lg">{option.option}</h2>
                                </div>
                                <h2 className="text-sm text-gray-400 mt-2">{option.votes}</h2>
                            </div>
                            <div className="w-full bg-gray-700 rounded-sm h-2 mt-2">
                            <div
                                className="bg-[#F2BEA0] h-2 rounded-sm"
                                style={{
                                width: `${votes > 0 ? (option.votes / votes) * 100 : 0}%`,
                                }}
                            ></div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            {showPicModal && (<PicModal
                            picture={modalData.image}
                            name={modalData.name}
                            closeModal={closeModal} />)}
        </article>
    </>
  );
}

export default RepostPollCard;