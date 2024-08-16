import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import Question from "../layouts/Question";
import useQuestions from "../hooks/useQuestions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSolutions, getSolutionByQuestion } from "../redux/Slices/ans.slice";
import { getUsers } from "../redux/Slices/auth.slice";

function Home() {

    const [quesState] = useQuestions();
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    async function loadSolutions(){
        let array = [];
        let n = quesState.questionList.length
        for(let i = 0; i < n; i ++){
            const ans = await dispatch(getSolutionByQuestion(quesState.questionList[i]._id));
            array[i] = ans?.payload?.data?.data;
        }
        await dispatch(getAllSolutions(array));
    }

    async function loadUsers(){
        await dispatch(getUsers());
    }

    useEffect(() => {
        loadSolutions(); loadUsers();
    }, [quesState.questionList])

    return (
        <>
            <div className="flex gap-3 justify-center mt-20 px-2">
                <div className="w-[80vw] md:w-[50rem] sm:w-[25rem] flex flex-col items-center my-3">
                    {authState.userList.length && quesState.questionList?.map((quest) => {
                        let date = quest.createdAt?.split('T')[0].split('-');
                        date = date[2] + "-" + date[1] + "-" + date[0];
                        return (<Question key={quest._id} questionId={quest._id} creator={quest.userId} question={quest.question} createdAt={date} likes={quest.likes}/>)
                    })}
                </div>
            </div>
            <Link to={'/question'}>
                <button className="btn bg-gray-300 text-black font-bold fixed bottom-10 right-10 hover:bg-gray-400">
                    <IoMdAdd/>
                    ADD QUESTION
                </button>
            </Link>
        </>
    )
}

export default Home;