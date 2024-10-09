import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useComments from "../hooks/useComments";
// import useAnswers from "../hooks/useAnswers";
import { getQuestion, like, unLike, voteQuestion } from "../redux/Slices/ques.slice";
import { getLikedQuestions, getSaved, getVoted, saveQuestion } from "../redux/Slices/auth.slice";
import { createComment, getComments } from "../redux/Slices/comment.slice";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillLike, AiOutlineLike, AiOutlineRetweet } from "react-icons/ai";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import DeleteModal from "./DeleteModal";
import Comment from "./Comment";
import { MdModeComment, MdOutlineModeComment } from "react-icons/md";
import PicModal from "./PicModal";

// eslint-disable-next-line react/prop-types
function PollCard({questionId}) {

    const quesState = useSelector((state) => state.ques);
    const authState = useSelector((state) => state.auth);
    const [commentState] = useComments();

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
    const [totLikes, setTotLikes] = useState(0)
    const [isLiked, setIsLiked] = useState(false);
    const [quest, setQuest] = useState("")
    const [selectedQues, setSelectedQues] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [dateDiff, setDateDiff] = useState(0);
    const [orgQues, setOrgQues] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [retweets, setRetweets] = useState(0);
    const [checkSaved, setCheckSaved] = useState(false);
    const [check, setCheck] = useState(false);
    const [userName, setUserName] = useState('');
    const [showPicModal, setShowPicModal] = useState(false);
    const [modalData, setModalData] = useState({ image: '', name: '' });
    const [commentDetails, setCommentDetails] = useState({
        userId:authState.data?._id,
        questionId: questionId,
        description: ""
    })

    function calculateRetweets(){
        const list = quesState.downloadedQuestions.filter((ques) => ques.repost === questionId);
        setRetweets(list?.length);
    }

    function loadComments() {
        setComments(commentState.commentList.filter((comment) => comment.questionId === questionId));
        setComments(comments => comments.reverse());
    }

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
        if(authState.userList[nm]?.username) setUserName(authState.userList[nm]?.username);
    }

    async function userView() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        if(!authState.userList[userIdx]?._id) return;
        if(authState.userList[userIdx]?._id != authState.data?._id) navigate(`/profile?userid=${authState.userList[userIdx]?._id}`);
        else navigate('/profile');
    }

    async function onDelete(){
        setIsOpen(false);
        setSelectedQues(questionId);
        setShowModal(true);
    }

    async function handleChange(e) {
        setCommentDetails({
            ...commentDetails,
            description: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
        })
    }

    async function onLike() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        const res = await dispatch(like({
            quesId : questionId,
            userId: authState.data._id
        }));
        if(res){
            setIsLiked(true);
            setTotLikes(totLikes + 1);
            await dispatch(getLikedQuestions(authState.data?._id));
        }
    }

    async function onUnLike() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        const res = await dispatch(unLike({
            quesId : questionId,
            userId: authState.data._id
        }));
        if(res){
            setIsLiked(false);
            setTotLikes(totLikes - 1);
            await dispatch(getLikedQuestions(authState.data?._id));
        }
    }

    async function submitComment(){
        if(commentDetails.description.toString().trim()){
            const res = await dispatch(createComment(commentDetails));
            if(res){
                setCommentDetails({
                    ...commentDetails, description: ""
                })
                await dispatch(getComments());
                setShowComments(true);
            }
        }
    }

    function getDate() {
        let date = createdAt?.toString()?.split('T')[0].split('-').reverse().join("-");
        setDateDiff(date);
    }

    function onRepost(){
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        navigate(`/create-question?repost=${questionId}`)
    }

    async function save(){
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        const res = await dispatch(saveQuestion({
            userId: authState.data?._id,
            questionId: questionId
        }))
        if(res) await dispatch(getSaved(authState.data?._id));
    }

    async function loadVoted() {
        if(authState.isLoggedIn) await dispatch(getVoted(authState.data?._id))
    }

    async function loadQuestion() {
        const res = await dispatch(getQuestion(questionId));
        const ques = res.payload?.data?.question;
        setTotLikes(ques.likes)
        setCreatedAt(ques.createdAt);
        setCreator(ques.userId);
        setQuesImage(ques.image);
        setArr(ques.poll);
        setTopic(ques.topic);
        setTitle(ques.title);
        setQuest(ques.question);
        setOrgQues(ques.question);
    }

    async function loadSaved() {
        if(authState.isLoggedIn) await dispatch(getSaved(authState.data?._id));
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
        loadVoted(); loadSaved();
    }, [questionId, creator])

    useEffect(() => {
        loadQuestion();
    }, [selectedId, authState.voted?.length, questionId])

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
        calculateRetweets();
    }, [questionId])

    useEffect(() => {
        if(authState.isLoggedIn && authState.savedQuestions?.includes(questionId)) setCheckSaved(true);
        else setCheckSaved(false);
    }, [authState.savedQuestions?.length])

    useEffect(() => {
        loadComments();
    }, [commentState.commentList.length])

    useEffect(() => {
        findName(); getDate();
    }, [creator, createdAt, questionId])

    useEffect(() => {
        if(authState.isLoggedIn){
            const ques = authState.selectedUser?.likedQuestion?.filter((ques) => (ques.questionId === questionId));
            if(ques?.length) setIsLiked(true);
            else setIsLiked(false);
        }
        if(quest?.length > 1000){
            const newQuest = quest.substring(0, 1000) + "...";
            setQuest(newQuest); setCheck(true);
        }
    }, [authState.selectedUser.likedQuestion?.length, questionId, creator])

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
                        <img src={image} alt={name} className="mr-4 rounded-full max-w-none w-10 h-10 object-cover hover:cursor-pointer" onClick={() => imageClick(name, image)} />
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center">
                                <a onClick={userView} className="inline-block font-bold mr-2 text-sm hover:cursor-pointer hover:underline">{name}</a>
                                <h2 className="inline-block mr-2 text-xs text-[#F2BEA0]">{userName}</h2>
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
                                        onClick={onRepost}
                                    >
                                    Repost
                                    </h2>
                                    {authState.data?._id === creator && <h2
                                        className="block px-4 py-2 text-sm text-white hover:bg-gray-600 font-semibold"
                                        role="menuitem"
                                        tabIndex="-1"
                                        onClick={onDelete}
                                    >
                                    Delete
                                    </h2>}
                                </div>
                            </div>
                        )}
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
                                <h2 className="text-sm text-gray-400 mt-2">{selectedId && option.votes}</h2>
                            </div>
                            <div className="w-full bg-gray-700 rounded-sm h-2 mt-2">
                            {selectedId && <div
                                className="bg-[#F2BEA0] h-2 rounded-sm"
                                style={{
                                width: `${votes > 0 ? (option.votes / votes) * 100 : 0}%`,
                                }}
                            ></div>}
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="mt-6 text-gray-400 text-sm">
                        Total Votes: {votes}
                    </div>
                </div>
            </div>
            <div className="bg-gray-700 h-[0.1px]"/>
                <div className="w-full flex gap-4 items-center my-2 ml-2">
                    <button className="flex gap-3 justify-center items-center text-sm">
                        {isLiked ? <AiFillLike id="liked" onClick={onUnLike} title="Unlike" className="w-5 h-5"/> : <AiOutlineLike id="like" onClick={onLike} title="Like" className="w-5 h-5"/>}
                        <span className="ml-1">{totLikes}</span>
                    </button>
                    <div className="flex gap-3 justify-center items-center text-sm">
                        <AiOutlineRetweet title="Reposts" className="w-5 h-5"/>
                        <span className="ml-1">{retweets}</span>
                    </div>
                    <div className="flex gap-4 items-center text-xs hover:cursor-pointer" onClick={() => setShowComments(!showComments)}>
                    {showComments ? <MdModeComment className="w-5 h-5"/> : <MdOutlineModeComment className="w-5 h-5" />} {comments?.length}</div>
                    {checkSaved ? <FaBookmark className="w-3 hover:cursor-pointer" onClick={save} title="Save"/> : <FaRegBookmark className="w-3 hover:cursor-pointer" onClick={save}/>}
                </div>
            {authState.isLoggedIn && <div className="flex mt-2 items-center">
                <img src={authState.data?.image} alt={authState.data?.name} className="mr-4 rounded-full max-w-none w-10 h-10 object-cover hover:cursor-pointer" onClick={() => imageClick(authState.data?.name, authState.data?.image)}/>
                <textarea 
                    name="comment"
                    onChange={handleChange}
                    value={commentDetails.description}
                    className="rounded-md w-full border-[2px] border-gray-800 bg-transparent focus:outline-none p-2 text-sm resize-none" 
                    placeholder="Post comment"
                    rows="1"
                    onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                ></textarea>
                <FiSend className="w-14 text-white hover:cursor-pointer" onClick={submitComment}/>
            </div>}
            {showModal && <DeleteModal type='question' typeId={selectedQues}/>}
            {showPicModal && (<PicModal
                            picture={modalData.image}
                            name={modalData.name}
                            closeModal={closeModal} />)}
        </article>
        {showComments && <div className="w-full ml-2 my-3">
            {comments.length ? comments.map((comment, index) => {
                return (<Comment key={index} commentId={comment._id} userId={comment.userId} description={comment.description} createdAt={comment.createdAt} creator={creator} likes={comment.likes}/>)
            }) : <h2 className="text-white font-thin italic">No comments yet</h2>}
        </div>}
    </>
  );
}

export default PollCard;