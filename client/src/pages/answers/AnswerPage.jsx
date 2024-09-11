import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Answer from "../../layouts/Answer";
import useQuestions from "../../hooks/useQuestions";
import { getUsers } from "../../redux/Slices/auth.slice";
import useAnswers from "../../hooks/useAnswers";
import { useNavigate } from "react-router-dom";

function AnswerPage() {

    const [quesState] = useQuestions();
    const [ansState] = useAnswers();
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
 
    const [name, setName] = useState("m");
    const [isMyQues, setIsMyQues] = useState(false);
    const [date, setDate] = useState("");
    const [question, setQuestion] = useState("");
    const [idx, setIdx] = useState();
    const [quesImage, setQuesImage] = useState();
    const [userIdx, setUserIdx] = useState();
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png");

    async function loadUsers(){
        await dispatch(getUsers());
    }

    function loadUser() {
        const user = authState.userList?.find((user) => user._id == quesState.currentQuestion[0]?.userId)
        if(quesState.currentQuestion[0]?.userId === authState.data?._id) setIsMyQues(true);
        const userIdx = authState.userList?.findIndex((user) => user._id == quesState.currentQuestion[0]?.userId);
        const index = quesState.downloadedQuestions.findIndex((question) => question._id === quesState.currentQuestion[0]?._id);
        setIdx(index); setUserIdx(userIdx);
        const dt = quesState?.currentQuestion[0]?.createdAt;
        if(dt){
            const now = new Date(); 
            const questionTime = new Date(dt);
            const elapsedTime = now - questionTime;

            const seconds = Math.floor(elapsedTime / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
        
            if (days > 0) {
                setDate(`${days} day(s) ago`);
            } else if (hours > 0) {
                setDate(`${hours} hour(s) ago`);
            } else if (minutes > 0) {
                setDate(`${minutes} minute(s) ago`);
            } else {
                setDate(`${seconds} second(s) ago`);
            }
            setName(user?.name); setImage(user?.image); 
            setQuestion(quesState.currentQuestion[0]?.question);
            setQuesImage(quesState.currentQuestion[0]?.image);
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
        if(quesState.currentQuestion[0] && authState.userList) {
            loadUsers(); loadUser();
        }
    }, [quesState.currentQuestion, authState.userList.length, ansState.solutionList, idx]);

    return (
        <div className="flex flex-col items-center w-full bg-gray-950 min-h-screen pt-[5rem]">
            <article className="w-[80vw] md:w-[50rem] sm:w-[25rem] mb-4 p-3 bg-gray-900 flex flex-col rounded-r-[1rem] rounded-bl-[1rem]">
                <div className="flex pb-6 items-center justify-between">
                    <div className="flex">
                        <a className="inline-block mr-4" href={image}>
                            <img src={image} alt={name} className="rounded-full max-w-none w-10 h-10" />
                        </a>
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center">
                                <a onClick={userView} className="inline-block text-sm font-bold mr-2 hover:underline hover:cursor-pointer">{name}</a>
                            </div>
                            <div className="text-slate-500 text-xs dark:text-slate-300">
                                {date}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-700 h-[0.1px]"/>
                <div className="py-4">
                    {quesState.currentQuestion[0]?.title && <h2 className="mb-2 text-lg font-bold">{quesState.currentQuestion[0].title}</h2>}
                    <p>{question}</p>
                    {quesImage && <div className="w-full flex justify-center"><a href={quesImage}><img src={quesImage} className="py-2"/></a></div>}
                </div>
            </article>
            <div className="ml-[2rem] w-[77vw] md:w-[47rem] sm:w-[22rem] flex flex-col">
                {!ansState.solutionList[idx]?.length ? (
                    <h2 className="text-white font-thin italic mb-5">No answers yet</h2>
                ):ansState.solutionList[idx]?.map((sol) => {
                    return (<Answer key={sol._id} solId={sol._id} creator={sol.userId} solution={sol.solution} createdAt={sol.createdAt} likes={sol.likes} isMyQues={isMyQues}/>)
                })}
            </div>
        </div>
    )
}

export default AnswerPage;