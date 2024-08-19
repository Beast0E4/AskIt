import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteQues, likeQuestion, unLikeQuestion } from "../redux/Slices/ques.slice";
import { useEffect, useState } from "react";
import { getLikedQuestions, getUser } from "../redux/Slices/auth.slice";
import UserDetailsModal from "./UserDetailsModal";
import { MdDelete } from "react-icons/md";
import useAnswers from "../hooks/useAnswers";
import { BiSolidUpvote, BiUpvote } from "react-icons/bi";

// eslint-disable-next-line react/prop-types
function Question({questionId,  question, createdAt, creator, likes, topic}) {

    const [ansState] = useAnswers();
    const quesState = useSelector((state) => state.ques);
    const authState = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [idx, setIdx] = useState();
    const [userIdx, setUserIdx] = useState();
    const [name, setName] = useState("");
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")
    const [totLikes, setTotLikes] = useState(likes)
    const [isLiked, setIsLiked] = useState(false);
    const [quest, setQuest] = useState(question)

    async function answer() {
        navigate(`/create-answer?question=${questionId}`);
    }

    function filterquestion() {
        const n = quesState.questionList.length;
        let index = 0;
        for(var i = 0; i < n; i ++){
            if(quesState.questionList[i]._id === questionId){
                index = i; break;
            }
        }
        setIdx(index);
    }

    async function findName(){
        const nm = authState.userList.findIndex((e) => e._id === creator);
        setUserIdx(nm);
        setName(authState.userList[nm].name);
        setImage(authState.userList[nm].image);
    }

    async function userView() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        const res = await dispatch(getUser(authState.userList[userIdx]._id));
        if(res){
            document.getElementById('userModal').showModal();
        }
    }

    async function onDelete(){
        const res = await dispatch(deleteQues(questionId));
        if(res.payload) location.reload();
    }

    async function onView() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        navigate(`/answer?question=${questionId}`); 
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

    useEffect(() => {
        filterquestion(); findName(); 
        if(authState.data){
            const ques = authState.selectedUser?.likedQuestion?.filter((ques) => (ques.questionId === questionId));
            if(ques?.length) setIsLiked(true);
            else setIsLiked(false);
        }
        if(quest.length > 1000){
            const newQuest = quest.substring(0, 1000) + "...";
            setQuest(newQuest);
        }
    }, [authState.selectedUser.likedQuestion?.length])

    return (
        <article className="mb-4 w-full break-inside p-3 bg-gray-900 flex flex-col bg-clip-border">
            <div className="flex flex-col pb-3">
                <div className="flex">
                    <a className="inline-block mr-4" href={image}>
                        <img src={image} alt={name} className="rounded-full max-w-none w-10 h-10 object-cover" />
                    </a>
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center">
                            <a onClick={userView} className="inline-block font-bold mr-2 text-sm hover:cursor-pointer hover:underline">{name}</a>
                        </div>
                        <div className="text-slate-500 text-xs dark:text-slate-300">
                            {createdAt}
                        </div>
                    </div>
                </div>
                {topic && 
                <div className="mt-4">
                    <p className="text-[0.5rem] rounded-2xl border-[0.1px] w-max px-2 py-1 hover:bg-gray-800 hover:cursor-pointer">{topic}</p>
                </div>}
            </div>
            <div className="bg-gray-700 h-[0.1px]"/>
            <div onClick={onView} className="py-3 hover:cursor-pointer">
                <p className="ml-2 text-md">
                    {quest}
                </p>
            </div>
            <div className="bg-gray-700 h-[0.1px]"/>
            <div className="flex">
                <div className="w-full flex gap-4">
                    <button onClick={answer} className="p-2 text-xs hover:bg-gray-800 rounded-md">Add answer
                        <span className="ml-3">{ansState.solutionList[idx]?.length}</span>
                    </button>
                    <button onClick={onView} className="font-medium text-xs text-white hover:underline">View Answers</button>
                    <button className="flex gap-3 justify-center items-center text-sm">
                        <span className="ml-1">{totLikes}</span>
                        {isLiked ? <BiSolidUpvote id="liked" onClick={onUnLike}/> : <BiUpvote id="like" onClick={onLike}/>}
                    </button>
                </div>
                {creator === authState?.data?._id && <div className="flex items-center justify-end w-16">
                    <MdDelete className="hover:cursor-pointer" onClick={onDelete}/>
                </div>}
            </div>
            <UserDetailsModal />
        </article>
    )
}

export default Question;