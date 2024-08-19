import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Answer from "../../layouts/Answer";
import useQuestions from "../../hooks/useQuestions";
import { getUser, getUsers } from "../../redux/Slices/auth.slice";
import useAnswers from "../../hooks/useAnswers";
import UserDetailsModal from "../../layouts/UserDetailsModal";
import { useNavigate } from "react-router-dom";

function AnswerPage() {

    const [quesState] = useQuestions();
    const [ansState] = useAnswers();
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
 
    const [name, setName] = useState("m");
    const [date, setDate] = useState("");
    const [question, setQuestion] = useState("");
    const [idx, setIdx] = useState();
    const [userIdx, setUserIdx] = useState();
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png");

    async function loadUsers(){
        await dispatch(getUsers());
    }

    function loadUser() {
        const user = authState.userList?.find((user) => user._id == quesState.currentQuestion[0]?.userId)
        const userIdx = authState.userList?.findIndex((user) => user._id == quesState.currentQuestion[0]?.userId);
        const index = quesState.questionList.findIndex((question) => question._id === quesState.currentQuestion[0]?._id);
        setIdx(index); setUserIdx(userIdx);
        const dt = quesState?.currentQuestion[0]?.createdAt?.split('T')[0].split('-')
        if(dt){
            setDate(dt[2] + "-" + dt[1] + "-" + dt[0]);
            setName(user?.name); setImage(user?.image); 
            setQuestion(quesState.currentQuestion[0]?.question);
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
        if(quesState.currentQuestion[0] && authState.userList) {
            loadUsers(); loadUser();
        }
    }, [quesState.currentQuestion, authState.userList.length]);

    return (
        <div className="flex flex-col items-center w-full bg-gray-950 min-h-screen pt-[5rem]">
            <article className="w-[80vw] md:w-[50rem] sm:w-[25rem] mb-4 p-3 bg-gray-900 flex flex-col rounded-r-[2rem] rounded-bl-[2rem]">
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
                <p>
                    {question}
                </p>
                </div>
            </article>
            <div className="ml-[2rem] w-[77vw] md:w-[47rem] sm:w-[22rem] flex flex-col">
                {!ansState.solutionList[idx]?.length ? (
                    <h2 className="text-white font-thin italic mb-5">No answers yet</h2>
                ):ansState.solutionList[idx]?.map((sol) => {
                    let date = sol?.createdAt?.split('T')[0].split('-');
                    date = date[2] + "-" + date[1] + "-" + date[0];
                    return (<Answer key={sol._id} solId={sol._id} creator={sol.userId} solution={sol.solution} createdAt={date} likes={sol.likes}/>)
                })}
            </div>
            <UserDetailsModal />
        </div>
    )
}

export default AnswerPage;