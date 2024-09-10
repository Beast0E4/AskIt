import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likeQuestion, unLikeQuestion } from "../redux/Slices/ques.slice";
import { useEffect, useRef, useState } from "react";
import { getLikedQuestions } from "../redux/Slices/auth.slice";
import useAnswers from "../hooks/useAnswers";
import { BiSolidUpvote, BiUpvote } from "react-icons/bi";
import DeleteModal from "./DeleteModal";
import { FiSend } from "react-icons/fi";
import { createComment, getComments } from "../redux/Slices/comment.slice";
import useComments from "../hooks/useComments";
import Comment from "./Comment";
import { BsThreeDotsVertical } from "react-icons/bs";

// eslint-disable-next-line react/prop-types
function Question({questionId,  question, createdAt, creator, likes, topic, title, quesImage}) {

    const [ansState] = useAnswers();
    const quesState = useSelector((state) => state.ques);
    const authState = useSelector((state) => state.auth);
    const [commentState] = useComments();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const dropdownRef = useRef(null);

    const [idx, setIdx] = useState();
    const [userIdx, setUserIdx] = useState();
    const [name, setName] = useState("");
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")
    const [totLikes, setTotLikes] = useState(likes)
    const [isLiked, setIsLiked] = useState(false);
    const [quest, setQuest] = useState(question)
    const [selectedQues, setSelectedQues] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [commentDetails, setCommentDetails] = useState({
        userId:authState.data?._id,
        questionId: questionId,
        description: ""
    })

    function loadComments() {
        setComments(commentState.commentList.filter((comment) => comment.questionId === questionId));
    }

    async function answer() {
        navigate(`/create-answer?question=${questionId}`);
    }

    function filterquestion() {
        const n = quesState.downloadedQuestions.length;
        let index = 0;
        for(var i = 0; i < n; i ++){
            if(quesState.downloadedQuestions[i]._id === questionId){
                index = i; break;
            }
        }
        setIdx(index);
    }

    async function findName(){
        const nm = authState.userList.findIndex((e) => e._id === creator);
        setUserIdx(nm);
        setName(authState?.userList[nm]?.name.substring(0, 10));
        setImage(authState.userList[nm]?.image);
    }

    async function userView() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        if(authState.userList[userIdx]._id != authState.data?._id) navigate(`/profile?userid=${authState.userList[userIdx]._id}`);
        else navigate('/profile');
    }

    async function onDelete(){
        setIsOpen(false);
        setSelectedQues(questionId);
        setShowModal(true);
    }

    async function onView() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        navigate(`/answer?question=${questionId}`); 
    }

    async function handleChange(e) {
        setCommentDetails({
            ...commentDetails,
            description: e.target.value
        })
    }

    async function onLike() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        const res = await dispatch(likeQuestion({
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
        const res = await dispatch(unLikeQuestion({
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
        const res = await dispatch(createComment(commentDetails));
        if(res){
            setCommentDetails({
                ...commentDetails, description: ""
            })
            await dispatch(getComments());
        }
    }

    useEffect(() => {
        loadComments();
    }, [commentState.commentList.length])

    useEffect(() => {
        filterquestion(); findName(); 
        if(authState.data){
            const ques = authState.selectedUser?.likedQuestion?.filter((ques) => (ques.questionId === questionId));
            if(ques?.length) setIsLiked(true);
            else setIsLiked(false);
        }
        if(quest?.length > 1000){
            const newQuest = quest.substring(0, 1000) + "...";
            setQuest(newQuest);
        }
    }, [authState.selectedUser.likedQuestion?.length])

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
            <article className="mb-2 w-full break-inside p-3 bg-gray-900 flex flex-col bg-clip-border">
                <div className="flex flex-col pb-3">
                    <div className="flex justify-between">
                        <div className="flex">
                            <a className="inline-block mr-4" href={image}>
                                <img src={image} alt={name} className="rounded-full max-w-none w-10 h-10 object-cover" />
                            </a>
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center">
                                    <a onClick={userView} className="inline-block font-bold mr-2 text-sm hover:cursor-pointer hover:underline">{name}</a>
                                </div>
                                <div className="text-slate-300 text-xs">
                                    {createdAt}
                                </div>
                            </div>
                        </div>
                        {creator === authState.data?._id && <div className="relative inline-block text-left z-[0]" ref={dropdownRef}>
                            <div>
                                <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex justify-center w-full shadow-sm px-4 py-2 focus:outline-none"
                                >
                                <BsThreeDotsVertical className="h-5 w-5" />
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
                                            className="block px-4 py-2 text-sm text-white hover:bg-gray-600 font-semibold"
                                            role="menuitem"
                                            tabIndex="-1"
                                            onClick={onDelete}
                                        >
                                        Delete
                                        </h2>
                                    </div>
                                </div>
                            )}
                        </div>}
                    </div>
                    {topic && 
                    <div className="mt-4">
                        <p className="text-[0.5rem] rounded-2xl border-[0.1px] w-max px-2 py-1 hover:cursor-pointer border-[#F2BEA0] font-inconsolata">{topic}</p>
                    </div>}
                </div>
                <div onClick={onView} className="pb-2 hover:cursor-pointer">
                    {title && <h2 className="ml-2 text-lg font-bold mb-2">{title}</h2>}
                    <p className="ml-2 text-md">
                        {quest}
                    </p>
                    {quesImage && <div className="flex justify-center"><img src={quesImage} className="py-2"/></div>}
                </div>
                <div className="bg-gray-700 h-[0.1px]"/>
                <div className="w-full flex gap-4 items-center">
                    <button onClick={answer} className="p-2 text-xs hover:bg-gray-800 rounded-md">Add answer
                        <span className="ml-3">{ansState.solutionList[idx]?.length}</span>
                    </button>
                    <button onClick={onView} className="h-max text-xs hover:underline">View Answers</button>
                    <button className="flex gap-3 justify-center items-center text-sm">
                        <span className="ml-1">{totLikes}</span>
                        {isLiked ? <BiSolidUpvote id="liked" onClick={onUnLike}/> : <BiUpvote id="like" onClick={onLike}/>}
                    </button>
                    <h2 className="text-xs hover:cursor-pointer" onClick={() => setShowComments(!showComments)}>Comments</h2>
                </div>
                <div className="flex mt-2 items-center">
                    <a className="inline-block mr-4" href={authState.data?.image}>
                        <img src={authState.data?.image} alt={authState.data?.name} className="rounded-full max-w-none w-10 h-10 object-cover" />
                    </a>
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
                </div>
                {showModal && <DeleteModal type='question' id={selectedQues}/>}
            </article>
            {showComments && <div className="w-full ml-2 my-3">
                {comments.length ? comments.map((comment, index) => {
                    return (<Comment key={index} commentId={comment._id} userId={comment.userId} description={comment.description} createdAt={comment.createdAt}/>)
                }) : <h2 className="text-white font-thin italic">No comments yet</h2>}
            </div>}
        </>
    )
}

export default Question;