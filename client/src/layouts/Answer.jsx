import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSolution, likeSolution, unLikeSolution } from "../redux/Slices/ans.slice";
import { useNavigate } from "react-router-dom";
import EditAnswerModal from "./EditAnswerModal";
import { getLikedSolutions } from "../redux/Slices/auth.slice";
import { BiSolidUpvote, BiUpvote } from "react-icons/bi";
import DeleteModal from './DeleteModal'
import { createComment, getComments } from "../redux/Slices/comment.slice";
import { FiSend } from "react-icons/fi";
import useComments from "../hooks/useComments";
import Comment from "./Comment";
import { BsThreeDotsVertical } from "react-icons/bs";

// eslint-disable-next-line react/prop-types
function Answer({solId, solution, createdAt, creator, likes, isMyQues}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [commentState] = useComments();

    const authState = useSelector((state) => state.auth);

    const dropdownRef = useRef(null);

    const [name, setName] = useState("");
    const [userIdx, setUserIdx] = useState();
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")
    const [totLikes, setTotLikes] = useState(likes)
    const [isLiked, setIsLiked] = useState(false);
    const [ans, setAns] = useState(solution);
    const [selectedSol, setSelectedSol] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [commentDetails, setCommentDetails] = useState({
        userId:authState.data?._id,
        solutionId: solId,
        description: ""
    })

    function findName(){
        const nm = authState.userList.findIndex((e) => e._id === creator);
        setName(authState.userList[nm]?.name); setUserIdx(nm);
        if(authState.userList[nm]?.image) setImage(authState.userList[nm].image);
    }

    function loadComments() {
        setComments(commentState.commentList.filter((comment) => comment.solutionId === solId));
        setComments(comments => comments.reverse());
    }

    async function onAnswerView(){
        const res = await dispatch(getSolution(solId));
        if(res) document.getElementById('answerModal').showModal();
    }

    async function onDelete(){
        setSelectedSol(solId);
        setShowModal(true);
    }

    async function onLike() {
        if(!authState.data){
            navigate('/login'); return;
        }
        const res = await dispatch(likeSolution({
            solId : solId,
            userId: authState.data._id
        }));
        if(res){
            setIsLiked(true);
            setTotLikes(totLikes + 1);
            await dispatch(getLikedSolutions(authState.data?._id));
        }
    }

    async function handleChange(e) {
        setCommentDetails({
            ...commentDetails,
            description: e.target.value
        })
    }

    async function submitComment(){
        const res = await dispatch(createComment(commentDetails));
        if(res){
            setCommentDetails({
                ...commentDetails, description: ""
            })
            await dispatch(getComments());
            setShowComments(true);
        }
    }

    async function onUnLike() {
        const res = await dispatch(unLikeSolution({
            solId : solId,
            userId: authState.data._id
        }));
        if(res){
            setIsLiked(false);
            setTotLikes(totLikes - 1);
            await dispatch(getLikedSolutions(authState.data?._id));
        }
    }

    async function userView(){
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        if(authState.userList[userIdx]._id != authState.data?._id) navigate(`/profile?userid=${authState.userList[userIdx]._id}`);
        else navigate('/profile');
    }

    useEffect(() => {
        loadComments();
    }, [commentState.commentList.length])

    useEffect(() => {
        findName(); 
        if(authState.data){
            const sol = authState.selectedUser?.likedSolution?.filter((like) => (like.solutionId === solId && like.userId === authState.data._id));
            if(sol?.length) setIsLiked(true);
            else setIsLiked(false);
        }
        if(ans?.length > 1000){
            const newAns = ans.substring(0, 1000) + "...";
            setAns(newAns);
        }
    }, [authState.selectedUser?.likedSolution?.length]);

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
            <article className="mb-4 w-full break-inside p-4 bg-gray-800 flex flex-col bg-clip-border">
                <div className="flex pb-3 items-center justify-between">
                <div className="w-full flex justify-between items-center">
                    <div className="flex">
                        <a className="inline-block mr-4" href={image}>
                            <img src={image} alt="user-avatar-image" className="rounded-full max-w-none w-10 h-10 object-cover" />
                        </a>
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center">
                                <a onClick={userView} className="inline-block text-sm font-bold mr-2 hover:underline hover:cursor-pointer">{name}</a>
                            </div>
                            <div className="text-slate-500 text-xs dark:text-slate-300">
                                {createdAt}
                            </div>
                        </div>
                    </div>
                    {(creator === authState.data?._id || isMyQues) && <div className="relative inline-block text-left z-[0]" ref={dropdownRef}>
                            <div>
                                <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex justify-center w-full shadow-sm px-4 py-2 focus:outline-none"
                                >
                                <BsThreeDotsVertical className="h-8 w-8 p-2 rounded-full hover:bg-gray-900" />
                                </button>
                            </div>

                            {isOpen && (
                                <div
                                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-900 focus:outline-none z-10"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="menu-button"
                                tabIndex="-1"
                                >
                                    <div className="py-1">
                                        <h2
                                            className="block px-4 py-2 text-sm text-white hover:bg-gray-600 font-semibold"
                                            role="menuitem"
                                            tabIndex="-1"
                                            onClick={onDelete}
                                        >
                                        Delete
                                        </h2>
                                        {creator === authState.data?._id && <h2
                                            className="block px-4 py-2 text-sm text-white hover:bg-gray-600 font-semibold"
                                            role="menuitem"
                                            tabIndex="-1"
                                            onClick={onAnswerView}
                                        >
                                        Edit answer
                                        </h2>}
                                    </div>
                                </div>
                            )}
                        </div>}
                    </div>
                </div>
                <div className="py-4">
                    <p>
                        {ans}
                    </p>
                </div>
                <div className="bg-gray-700 h-[0.1px]"/>
                <div className="mb-2">
                    <div className="flex items-center gap-4 mt-2">
                        <button className="flex gap-3 justify-center items-center text-sm">
                            <span className="ml-1">{totLikes}</span>
                            {isLiked ? <BiSolidUpvote id="liked" onClick={onUnLike}/> : <BiUpvote id="like" onClick={onLike}/>}
                        </button>
                        <h2 className="text-sm hover:cursor-pointer" onClick={() => setShowComments(!showComments)}>Comments {comments?.length}</h2>
                    </div>
                    <div className="flex mt-2 items-center">
                        <a className="inline-block mr-4" href={authState.data?.image}>
                            <img src={authState.data?.image} alt={authState.data?.name} className="rounded-full max-w-none w-10 h-10 object-cover" />
                        </a>
                        <textarea 
                            name="comment"
                            onChange={handleChange}
                            value={commentDetails.description}
                            className="rounded-md w-full border-[2px] border-gray-600 bg-transparent focus:outline-none p-2 text-sm resize-none" 
                            placeholder="Post comment"
                            rows="1"
                            onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                        ></textarea>
                        <FiSend className="w-14 text-white hover:cursor-pointer" onClick={submitComment}/>
                    </div>
                </div>
                {showModal && <DeleteModal type="solution" id={selectedSol}/>}
                <EditAnswerModal />
            </article>
            {showComments && <div className="w-full ml-2 my-3">
                {comments.length ? comments.map((comment, index) => {
                    return (<Comment key={index} commentId={comment._id} userId={comment.userId} description={comment.description} createdAt={comment.createdAt}/>)
                }) : <h2 className="text-white font-thin italic">No comments yet</h2>}
            </div>}
        </>
    )
}

export default Answer;