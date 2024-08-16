import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteSol, likeSolution, unLikeSolution } from "../redux/Slices/ans.slice";
import { useNavigate } from "react-router-dom";
import { TbPencil } from "react-icons/tb";
import EditAnswerModal from "./EditAnswerModal";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { getLiked } from "../redux/Slices/auth.slice";

// eslint-disable-next-line react/prop-types
function Answer({solId, solution, createdAt, creator, likes}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authState = useSelector((state) => state.auth);

    const [name, setName] = useState("");
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")
    const [totLikes, setTotLikes] = useState(likes)
    const [isLiked, setIsLiked] = useState(false);
    const [ans, setAns] = useState(solution);

    function findName(){
        const nm = authState.userList.findIndex((e) => e._id === creator);
        setName(authState.userList[nm]?.name);
        if(authState.userList[nm]?.image) setImage(authState.userList[nm].image);
    }

    async function onDelete(){
        const res = await dispatch(deleteSol(solId));
        if(res.payload) navigate('/');
    }

    async function editAnswer(){
        document.getElementById('answerModal').showModal()
    }

    async function countLikes() {
        await dispatch(getLiked());
    }

    async function onLike() {
        if(!authState.data) navigate('/login')
        const res = await dispatch(likeSolution({
            solId : solId,
            userId: authState.data._id
        }));
        if(res){
            setIsLiked(true);
            setTotLikes(totLikes + 1);
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
        }
    }

    useEffect(() => {
        findName(); 
        if(authState.data){
            countLikes();
            const sol = authState.selectedUser?.liked?.filter((like) => (like.solutionId === solId && like.userId === authState.data._id));
            if(sol.length) setIsLiked(true);
            else setIsLiked(false);
        }
        if(ans.length > 1000){
            const newAns = ans.substring(0, 1000) + "...";
            setAns(newAns);
        }
    }, []);

    return (
        <article className="mb-4 w-[90vw] break-inside p-6 bg-gray-700 flex flex-col bg-clip-border">
            <div className="flex pb-6 items-center justify-between">
            <div className="w-full flex justify-between items-center">
                <div className="flex">
                    <a className="inline-block mr-4" href={image}>
                        <img src={image} alt="user-avatar-image" className="rounded-full max-w-none w-14 h-14 object-cover" />
                    </a>
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <a className="inline-block text-lg font-bold mr-2 text-md" href="#">{name}</a>
                        </div>
                        <div className="text-slate-500 text-sm dark:text-slate-300">
                            {createdAt}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    {authState.data.name === name && <TbPencil onClick={editAnswer} className="w-[1.5rem] h-[1.5rem] hover:cursor-pointer"/>}
                    {authState.data.name === name && <MdDelete className="hover:cursor-pointer w-[1.5rem] h-[1.5rem]" onClick={onDelete}/>}
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
                    {isLiked ? <AiFillLike id="liked" onClick={onUnLike}/> : <AiOutlineLike id="like" onClick={onLike}/>}
                </button>
            </div>
            <EditAnswerModal solution={solution} solutionId={solId}/>
        </article>
    )
}

export default Answer;