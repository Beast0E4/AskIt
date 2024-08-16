import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Answer from "../../layouts/Answer";
import { getAllSolutions, getSolutionByQuestion } from "../../redux/Slices/ans.slice";
import useQuestions from "../../hooks/useQuestions";
import { getUsers } from "../../redux/Slices/auth.slice";

function AnswerPage() {

    const [quesState] = useQuestions();
    const authState = useSelector((state) => state.auth);
    const ansState = useSelector((state) => state.ans);

    const dispatch = useDispatch();
 
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [question, setQuestion] = useState("");
    const [idx, setIdx] = useState();
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png");

    async function loadUsers(){
        await dispatch(getUsers());
    }

    async function loadSolutions(){
        let array = [];
        let n = quesState.questionList.length
        for(let i = 0; i < n; i ++){
            const ans = await dispatch(getSolutionByQuestion(quesState.questionList[i]._id));
            array[i] = ans?.payload?.data?.data;
        }
        await dispatch(getAllSolutions(array));
    }

    function loadUser() {
        const user = authState.userList?.find((user) => user._id == quesState.currentQuestion[0]?.userId)
        const index = quesState.questionList.findIndex((question) => question._id === quesState.currentQuestion[0]?._id);
        setIdx(index);
        const dt = quesState?.currentQuestion[0]?.createdAt?.split('T')[0].split('-')
        if(dt){
            setDate(dt[2] + "-" + dt[1] + "-" + dt[0]);
            setName(user?.name); setImage(user?.image); 
            setQuestion(quesState.currentQuestion[0]?.question);
        }
    }

    useEffect(() => {
        if(quesState.currentQuestion[0] && authState.userList) {
            loadUsers(); loadUser(); loadSolutions();
        }
    }, [quesState.currentQuestion, authState.userList.length]);

    return (
        <div className="w-full p-4">
            <article className="mb-4 break-inside p-6 bg-gray-800 border-2 flex flex-col bg-clip-border">
                <div className="flex pb-6 items-center justify-between">
                <div className="flex">
                    <a className="inline-block mr-4" href="#">
                        <img src={image} alt={name} className="rounded-full max-w-none w-14 h-14" />
                    </a>
                    <div className="flex flex-col">
                    <div className="flex items-center">
                        <a className="inline-block text-lg font-bold mr-2 text-md" href="#">{name}</a>
                    </div>
                    <div className="text-slate-500 text-sm dark:text-slate-300">
                        {date}
                    </div>
                    </div>
                </div>
                </div>
                <hr className="bg-white"/>
                <div className="py-4">
                <p>
                    {question}
                </p>
                </div>
            </article>
            <div className="flex flex-col items-end">
                {!ansState.solutionList[idx]?.length ? (
                    <h2 className="text-white font-thin italic">No answers yet</h2>
                ):ansState.solutionList[idx]?.map((sol) => {
                    let date = sol?.createdAt?.split('T')[0].split('-');
                    date = date[2] + "-" + date[1] + "-" + date[0];
                    return (<Answer key={sol._id} solId={sol._id} creator={sol.userId} solution={sol.solution} createdAt={date} likes={sol.likes}/>)
                })}
            </div>
        </div>
    )
}

export default AnswerPage;