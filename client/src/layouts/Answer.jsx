import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteSol, getSolution, likeSolution, unLikeSolution } from "../redux/Slices/ans.slice";
import { useNavigate } from "react-router-dom";
import { TbPencil } from "react-icons/tb";
import EditAnswerModal from "./EditAnswerModal";
import { getLikedSolutions, getUser } from "../redux/Slices/auth.slice";
import UserDetailsModal from "./UserDetailsModal";
import { BiSolidUpvote, BiUpvote } from "react-icons/bi";

// eslint-disable-next-line react/prop-types
function Answer({solId, solution, createdAt, creator, likes}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authState = useSelector((state) => state.auth);

    const [name, setName] = useState("");
    const [userIdx, setUserIdx] = useState();
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")
    const [totLikes, setTotLikes] = useState(likes)
    const [isLiked, setIsLiked] = useState(false);
    const [ans, setAns] = useState(solution);

    function findName(){
        const nm = authState.userList.findIndex((e) => e._id === creator);
        setName(authState.userList[nm]?.name); setUserIdx(nm);
        if(authState.userList[nm]?.image) setImage(authState.userList[nm].image);
    }

    async function onAnswerView(){
        const res = await dispatch(getSolution(solId));
        if(res) document.getElementById('answerModal').showModal();
    }

    async function onDelete(){
        const res = await dispatch(deleteSol(solId));
        if(res.payload) navigate('/');
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
        const res = await dispatch(getUser(authState.userList[userIdx]._id));
        if(res) document.getElementById('userModal').showModal();
    }

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

    return (
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
                <div className="flex gap-3">
                    {authState.data?._id === creator && <TbPencil onClick={onAnswerView} className="w-[1rem] h-[1rem] hover:cursor-pointer"/>}
                    {authState.data?._id === creator && <MdDelete className="hover:cursor-pointer w-[1rem] h-[1rem]" onClick={onDelete}/>}
                </div>
            </div>
            </div>
            <hr className="bg-white"/>
            <div className="py-4">
                <p>
                    {ans}
                </p>
            </div>
            <div>
                <button className="flex gap-3 justify-center items-center text-sm">
                    <span className="ml-1">{totLikes}</span>
                    {isLiked ? <BiSolidUpvote id="liked" onClick={onUnLike}/> : <BiUpvote id="like" onClick={onLike}/>}
                </button>
            </div>
            <UserDetailsModal />
            <EditAnswerModal />
        </article>
    )
}

export default Answer;