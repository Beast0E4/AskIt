import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import DeleteModal from "./DeleteModal";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { getLikedComments } from "../redux/Slices/auth.slice";
import { like, unLike  } from "../redux/Slices/ques.slice";

// eslint-disable-next-line react/prop-types
function Comment({commentId, userId, description, createdAt, creator, likes}) {

    const authState = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const dropdownRef = useRef(null);
    
    const [userIdx, setUserIdx] = useState();
    const [name, setName] = useState("");
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")
    const [isOpen, setIsOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState();
    const [showModal, setShowModal] = useState(false);
    const [totLikes, setTotLikes] = useState(likes)
    const [isLiked, setIsLiked] = useState(false);
    const [dateDiff, setDateDiff] = useState(0);

    function findName(){
        const nm = authState.userList.findIndex((e) => e._id === userId);
        setUserIdx(nm);
        setName(authState?.userList[nm]?.name.substring(0, 10));
        setImage(authState.userList[nm]?.image);
    }

    async function onDelete(){
        setIsOpen(false);
        setSelectedComment(commentId);
        setShowModal(true);
    }

    async function userView() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        if(authState.userList[userIdx]._id != authState.data?._id) navigate(`/profile?userid=${authState.userList[userIdx]._id}`);
        else navigate('/profile');
    }

    async function onLike() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        const res = await dispatch(like({
            commentId : commentId,
            userId: authState.data._id
        }));
        if(res){
            setIsLiked(true);
            setTotLikes(totLikes + 1);
            await dispatch(getLikedComments(authState.data?._id));
        }
    }

    async function onUnLike() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        const res = await dispatch(unLike({
            commentId : commentId,
            userId: authState.data._id
        }));
        if(res){
            setIsLiked(false);
            setTotLikes(totLikes - 1);
            await dispatch(getLikedComments(authState.data?._id));
        }
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
        getTimeElapsed(createdAt);
    }, [createdAt])

    useEffect(() => {
        if(authState.data){
            const check = authState.selectedUser?.likedComments?.filter((like) => (like.commentId === commentId));
            // console.log()
            if(check?.length) setIsLiked(true);
            else setIsLiked(false);
        }
    }, [authState.selectedUser?.likedComments?.length])

    useEffect(() => {
        findName();
    }, [userId])

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
        <div className="bg-transparent flex my-2">
            <a className="inline-block mr-2" href={image}>
                <img src={image} alt={name} className="rounded-full max-w-none w-8 h-8 object-cover" />
            </a>
            <div>
                <div className="bg-gray-800 rounded-lg pl-4 pt-2 pb-2.5 w-[50vw] md:w-[35vw] sm:w-[35vw]">
                    <div className="flex items-center justify-between">
                        <a onClick={userView} className="inline-block font-bold mr-2 text-sm hover:cursor-pointer hover:underline">{name}</a>
                        {(creator === authState.data?._id || userId === authState.data?._id) && <div className="relative inline-block text-left z-[0]" ref={dropdownRef}>
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
                                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-700 focus:outline-none z-10"
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
                    <div className="text-normal leading-snug md:leading-normal">{description}</div>
                </div>
                <div className="text-xs ml-4 mt-0.5 text-gray-500 dark:text-gray-400">{dateDiff}</div>
                <div className="bg-gray-600 rounded-full py-[0.5px] px-[7px] float-right gap-2  -mt-8 mr-0.5 flex shadow items-center">
                    {isLiked ? <AiFillLike id="liked" onClick={onUnLike} className="h-4 hover:cursor-pointer"/> : <AiOutlineLike id="like" onClick={onLike} className="hover:cursor-pointer"/>}
                    <span className="ml-1">{totLikes}</span>
                </div>
            </div>
            {showModal && <DeleteModal type='comment' id={selectedComment}/>}
        </div>
    )
}

export default Comment;