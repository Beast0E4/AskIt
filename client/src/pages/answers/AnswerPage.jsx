import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Answer from "../../layouts/Answer";
import useQuestions from "../../hooks/useQuestions";
import { getLikedComments, getLikedQuestions, getLikedSolutions, getUsers } from "../../redux/Slices/auth.slice";
import useAnswers from "../../hooks/useAnswers";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillLike, AiOutlineLike, AiOutlineRetweet } from "react-icons/ai";
import { like, unLike } from "../../redux/Slices/ques.slice";
import { FaComment, FaRegComment } from "react-icons/fa";
import { createComment, getComments } from "../../redux/Slices/comment.slice";
import { FiSend } from "react-icons/fi";
import DeleteModal from "../../layouts/DeleteModal";
import Comment from "../../layouts/Comment";
import RepostCard from "../../layouts/RepostCard";
import toast from "react-hot-toast";
import Loader from "../../layouts/Loader";

function AnswerPage() {

    const [quesState] = useQuestions();
    const [ansState] = useAnswers();
    const authState = useSelector((state) => state.auth);
    const commentState = useSelector((state) => state.comment);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("Anonymous");
    const [isMyQues, setIsMyQues] = useState(false);
    const [date, setDate] = useState("");
    const [idx, setIdx] = useState();
    const [userIdx, setUserIdx] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [totLikes, setTotLikes] = useState(0)
    const [selectedQues, setSelectedQues] = useState();
    const [showModal, setShowModal] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState();
    const [retweets, setRetweets] = useState(0);
    const [answers, setAnswers] = useState(0);
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png");
    const [commentDetails, setCommentDetails] = useState({
        userId:authState.data?._id,
        questionId: quesState.currentQuestion[0]?._id,
        description: ""
    })

    async function loadUsers(){
        setLoading(true);
        try {
            await dispatch(getUsers());
            if(authState.data?._id){
                await dispatch(getLikedQuestions(authState.data?._id));
                await dispatch(getLikedSolutions(authState.data?._id));
                await dispatch(getLikedComments(authState.data?._id));
            }
        } catch (error) {
            toast.error('Something went wrong'); setLoading(false);
        } finally{
            setLoading(false);
        }
    }

    function countSolutions(){
        const list = ansState.downloadedAnswers.flat().filter((ans) => ans.questionId === quesState.currentQuestion[0]?._id);
        setAnswers(list?.length);
    }

    function calculateRetweets(){
        const list = quesState.downloadedQuestions.filter((ques) => ques.repost === quesState.currentQuestion[0]?._id);
        setRetweets(list?.length);
    }


    function loadComments() {
        const list = commentState.commentList.filter((comment) => comment.questionId === quesState.currentQuestion[0]?._id);
        list.reverse();
        setComments(list);
    }

    function loadUser() {
        const user = authState.userList?.find((user) => user._id == quesState.currentQuestion[0]?.userId)
        if(quesState.currentQuestion[0]?.userId === authState.data?._id) setIsMyQues(true);
        const userIdx = authState.userList?.findIndex((user) => user._id == quesState.currentQuestion[0]?.userId);
        const index = quesState.downloadedQuestions.findIndex((question) => question._id === quesState.currentQuestion[0]?._id);
        setIdx(index); setUserIdx(userIdx);
        setTotLikes(quesState.currentQuestion[0]?.likes)
        const dt = quesState?.currentQuestion[0]?.createdAt;
        if(dt){
            const now = new Date(); 
            const questionTime = new Date(dt);
            const elapsedTime = now - questionTime;

            const seconds = Math.floor(elapsedTime / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const months = Math.floor(days / 30);
            const years = Math.floor(months / 12);

            if(years > 0){
                setDate(`${years} year(s) ago`)
            }
            else if(months > 0){
                setDate(`${months} month(s) ago`)
            }
            else if (days > 0) {
                setDate(`${days} day(s) ago`);
            } else if (hours > 0) {
                setDate(`${hours} hour(s) ago`);
            } else if (minutes > 0) {
                setDate(`${minutes} minute(s) ago`);
            } else {
                setDate(`${seconds} second(s) ago`);
            }
            if(user?.name) setName(user?.name); 
            if(user?.image) setImage(user?.image); 
        }
    }

    async function answer() {
        navigate(`/create-answer?question=${quesState.currentQuestion[0]?._id}`);
    }

    async function onDelete(){
        setIsOpen(false);
        setSelectedQues(quesState.currentQuestion[0]?._id);
        setShowModal(true);
    }

    async function userView(){
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        if(!authState.userList[userIdx]?._id) return;
        if(authState.userList[userIdx]._id != authState.data?._id) navigate(`/profile?userid=${authState.userList[userIdx]._id}`);
        else navigate('/profile');
    }

    async function onLike() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        const res = await dispatch(like({
            quesId : quesState.currentQuestion[0]?._id,
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
            quesId : quesState.currentQuestion[0]?._id,
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

    async function handleChange(e) {
        setCommentDetails({
            ...commentDetails,
            description: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
        })
    }

    useEffect(() => {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        loadUsers();
    }, [])

    useEffect(() => {
        countSolutions();
    }, [ansState.downloadedAnswers.flat().length, quesState.currentQuestion[0]?._id])


    useEffect(() => {
        loadComments();
    }, [comments?.length])
    
    useEffect(() => {
        calculateRetweets();
        if (quesState.currentQuestion[0] && authState.userList) {
            loadUsers(); 
            loadUser();
        }
        if(authState.data){
            const ques = authState.selectedUser?.likedQuestion?.filter((ques) => (ques.questionId === quesState.currentQuestion[0]?._id));
            if(ques?.length) setIsLiked(true);
            else setIsLiked(false);
        }
    }, [quesState.currentQuestion, authState.userList.length]);

    return (
        <div className="flex flex-col items-center w-full bg-gray-950 min-h-screen pt-[5rem]">
            <div>
                {loading && <Loader />}
                <article className="mb-2 w-[75vw] md:w-[50vw] sm:w-[50vw] break-inside p-3 bg-gray-900 flex flex-col bg-clip-border rounded-md border-[1.5px] border-gray-800">
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
                                        {date}
                                    </div>
                                </div>
                            </div>
                            {authState.data?._id === quesState.currentQuestion[0]?.userId && <div className="relative inline-block text-left z-[0]" ref={dropdownRef}>
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
                        {quesState.currentQuestion[0]?.topic && 
                        <div className="mt-4">
                            <p className="text-[0.5rem] rounded-2xl border-[0.1px] w-max px-2 py-1 hover:cursor-pointer border-[#F2BEA0] font-inconsolata">{quesState.currentQuestion[0]?.topic}</p>
                        </div>}
                    </div>
                    <div className="pb-2">
                        {quesState.currentQuestion[0]?.title && <h2 className="ml-2 text-lg font-bold mb-2">{quesState.currentQuestion[0]?.title}</h2>}
                        <p className="text-md ml-2"> 
                                {quesState.currentQuestion[0]?.question}
                            </p>
                        {quesState.currentQuestion[0]?.image && <div className="flex justify-center px-2"><img src={quesState.currentQuestion[0]?.image} className="py-2"/></div>}
                    </div>
                    {quesState.currentQuestion[0]?.repost !== 'none' && <RepostCard questionId={quesState.currentQuestion[0]?.repost}/>}
                    <div className="bg-gray-700 h-[0.1px]"/>
                    <div className="w-full flex gap-4 items-center">
                        <button onClick={answer} className="p-2 text-xs hover:bg-gray-800 rounded-md">Add answer
                            <span className="ml-3">{answers}</span>
                        </button>
                        <button className="flex gap-3 justify-center items-center text-sm">
                            {isLiked ? <AiFillLike id="liked" onClick={onUnLike}/> : <AiOutlineLike id="like" onClick={onLike}/>}
                            <span className="ml-1">{totLikes}</span>
                        </button>
                        <div className="flex gap-3 justify-center items-center text-sm">
                            <AiOutlineRetweet title="Reposts"/>
                            <span className="ml-1">{retweets}</span>
                        </div>
                        <div className="flex gap-4 items-center text-xs hover:cursor-pointer" onClick={() => setShowComments(!showComments)}>
                            {showComments ? <FaComment/> : <FaRegComment />} {comments?.length}</div>
                    </div>
                    {authState.isLoggedIn && <div className="flex mt-2 items-center">
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
                    </div>}
                    {showModal && <DeleteModal type='question' id={selectedQues}/>}
                </article>
                {showComments && <div className="w-full ml-2 my-3">
                    {comments.length ? comments.map((comment, index) => {
                        return (<Comment key={index} commentId={comment._id} userId={comment.userId} description={comment.description} createdAt={comment.createdAt} creator={quesState.currentQuestion[0]?.userId} likes={comment.likes}/>)
                    }) : <h2 className="text-white font-thin italic">No comments yet</h2>}
                </div>}
            </div>
            <div className="ml-[4rem] w-[70vw] md:w-[45vw] sm:w-[45vw] flex flex-col">
                {!ansState.solutionList[idx]?.length ? (
                    <h2 className="text-white font-thin italic mb-5">No answers yet</h2>
                ):ansState.solutionList[idx]?.map((sol) => {
                    return (<Answer 
                        key={sol._id} 
                        solId={sol._id} 
                        creator={sol.userId} 
                        solution={sol.solution} 
                        createdAt={sol.createdAt} 
                        likes={sol.likes} 
                        isMyQues={isMyQues}
                        solImage={sol.image}
                        isVerified={sol.verified}/>)
                })}
            </div>
        </div>
    )
}

export default AnswerPage;