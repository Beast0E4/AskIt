import { IoMdAdd } from "react-icons/io";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Question from "../layouts/Question";
import useQuestions from "../hooks/useQuestions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLikedQuestions, getLikedSolutions, getUsers } from "../redux/Slices/auth.slice";
import Loader from "../layouts/Loader";
import toast from "react-hot-toast";
import useAnswers from "../hooks/useAnswers";
import Answer from "../layouts/Answer";
import { getSolutionByUser } from "../redux/Slices/ans.slice";
import TopicsBar from "../layouts/TopicsBar";

function Home() {

    const [quesState] = useQuestions();
    const [ansState] = useAnswers();
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const location = useLocation();

    const [searchParams] = useSearchParams();

    const [loading, setLoading] = useState(false);

    async function loadUsers(){
        setLoading(true);
        try {
            await dispatch(getUsers());
            if(authState.data?._id){
                await dispatch(getLikedQuestions(authState.data?._id));
                await dispatch(getLikedSolutions(authState.data?._id));
            }
        } catch (error) {
            toast.error('Something went wrong'); setLoading(false);
        } finally{
            setLoading(false);
        }
    }

    async function loadSolutions(){
        await dispatch(getSolutionByUser(authState.data?._id));
    }

    useEffect(() => {
        loadSolutions();
    }, [ansState.solutionList?.length, searchParams.get('topic')])

    useEffect(() => {
        loadUsers();
    }, [quesState.questionList?.length, location.pathname, searchParams.get('topic'), searchParams.get('id')])

    return (
        <>
            <div className="flex gap-3 bg-gray-950 pt-[4rem] overflow-hidden min-h-screen px-2 justify-center">
                {location.pathname !== '/answers' && <TopicsBar />}
                <div className="w-[75vw] md:w-[50vw] sm:w-[50vw] flex flex-col items-center my-3">
                    {(location.pathname === '/questions' || location.pathname === '/') && (loading ? <Loader /> : (quesState.questionList?.length ? quesState.questionList?.map((quest) => {
                        let date = quest.createdAt?.split('T')[0].split('-');
                        date = date[2] + "-" + date[1] + "-" + date[0];
                        return (<Question key={quest._id} questionId={quest._id} creator={quest.userId} question={quest.question} createdAt={date} likes={quest.likes} topic={quest.topic}/>)
                    }) : (
                        <h2 className="text-white font-thin italic">No questions yet</h2>
                    )))}
                    {location.pathname === '/answers' && (loading ? <Loader /> : ansState.userSolutions?.length ? ansState.userSolutions?.map((ans) => {
                        let date = ans.createdAt?.split('T')[0].split('-');
                        if(date) {
                            date = date[2] + "-" + date[1] + "-" + date[0];
                            return (<Answer key={date} solId={ans._id} creator={ans.userId} solution={ans.solution} createdAt={date} likes={ans.likes}/>)
                        }
                    }) : (
                        <h2 className="text-white font-thin italic">No solutions yet</h2>
                    ))}
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