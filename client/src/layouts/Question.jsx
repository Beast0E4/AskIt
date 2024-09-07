import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likeQuestion, unLikeQuestion } from "../redux/Slices/ques.slice";
import { useEffect, useState } from "react";
import { getLikedQuestions } from "../redux/Slices/auth.slice";
import { MdDelete } from "react-icons/md";
import useAnswers from "../hooks/useAnswers";
import { BiSolidUpvote, BiUpvote } from "react-icons/bi";
import DeleteModal from "./DeleteModal";

// eslint-disable-next-line react/prop-types
function Question({questionId,  question, createdAt, creator, likes, topic, title, quesImage}) {

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
    const [selectedQues, setSelectedQues] = useState();
    const [showModal, setShowModal] = useState(false);

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
        setSelectedQues(questionId);
        setShowModal(true);
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
        if(quest?.length > 1000){
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
            <div className="flex">
                <div className="w-full flex gap-4 items-center">
                    <button onClick={answer} className="p-2 text-xs hover:bg-gray-800 rounded-md">Add answer
                        <span className="ml-3">{ansState.solutionList[idx]?.length}</span>
                    </button>
                    <button onClick={onView} className="h-max text-xs hover:underline">View Answers</button>
                    <button className="flex gap-3 justify-center items-center text-sm">
                        <span className="ml-1">{totLikes}</span>
                        {isLiked ? <BiSolidUpvote id="liked" onClick={onUnLike}/> : <BiUpvote id="like" onClick={onLike}/>}
                    </button>
                </div>
                {creator === authState?.data?._id && <div className="flex items-center justify-end w-16" title="Delete question">
                    <MdDelete className="hover:cursor-pointer" onClick={onDelete}/>
                </div>}
            </div>
            {showModal && <DeleteModal type='question' id={selectedQues}/>}
        </article>
    )
}

export default Question;