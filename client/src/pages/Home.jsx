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
    const [quesLength, setQuesLength] = useState(0)
    const [quesLikes, setQuesLikes] = useState(0);
    const [solLikes, setSolLikes] = useState(0);
    const [solLength, setSolLength] = useState(0);

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

    function calculateLength(){
        const ques = quesState.questionList?.filter((ques) => ques.userId === authState?.data?._id);
        let quesLikes = 0;
        ques.map((ques) => quesLikes += ques.likes);
        setQuesLikes(quesLikes);
        if(ques.length) setQuesLength(ques.length);
        const newArr = ansState.solutionList.flat();
        const arr = newArr.filter((ans) => ans.userId === authState.data?._id);
        let ansLikes = 0;
        arr.map((ans) => ansLikes += ans.likes); setSolLikes(ansLikes);
        const lt = newArr.filter(sol => sol.userId === authState.data?._id).length;
        setSolLength(lt);
    }

    useEffect(() => {
        calculateLength();
    }, [searchParams.get('userid')])

    async function loadSolutions(){
        await dispatch(getSolutionByUser(searchParams.get('userid')));
    }

    useEffect(() => {
        if(location.pathname === '/answers'){
            loadSolutions(); 
        }
    }, [location.pathname])

    useEffect(() => {
        loadUsers();
    }, [])

    return (
        <>
            <div className="flex gap-3 bg-gray-950 pt-[4rem] overflow-hidden min-h-screen px-2 justify-center">
                {location.pathname !== '/answers' && <TopicsBar />}
                <div className="w-[75vw] md:w-[50vw] sm:w-[50vw] flex flex-col items-center my-3">
                    {(location.pathname === '/questions' || location.pathname === '/') && (loading ? <Loader /> : (quesState.questionList?.length ? quesState.questionList?.map((quest) => {
                        let date = quest.createdAt?.split('T')[0].split('-');
                        date = date[2] + "-" + date[1] + "-" + date[0];
                        return (<Question key={quest._id} questionId={quest._id} title={quest.title} creator={quest.userId} question={quest.question} createdAt={date} likes={quest.likes} topic={quest.topic} quesImage={quest.image}/>)
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
                <div className="fixed h-max w-[14.5rem] rounded-md sm:right-5 mt-3 hidden lg:flex flex-col border-[2px] border-gray-800">
                    <h1 className=" p-2 font-bold bg-gray-900 font-sans border-b-[1px] border-gray-800">User details</h1>
                    <h2 className="p-2 border-b-[1px] border-gray-800 text-sm">Total questions asked - {quesLength}</h2>
                    <h2 className="p-2 border-b-[1px] border-gray-800 text-sm">Total solutions provided - {solLength}</h2>
                    <h3 className="p-2 border-b-[1px] border-gray-800 text-sm">Upvotes recieved on questions - {quesLikes}</h3>
                    <h2 className="p-2 border-b-[1px] border-gray-800 text-sm">Upvotes recieved on answers - {solLikes}</h2>
                </div>
            </div>
            <Link to={'/create-question'}>
                <button className="btn bg-gray-800 text-white font-bold fixed bottom-10 right-10 hover:bg-gray-700">
                    <IoMdAdd/>
                    ADD QUESTION
                </button>
            </Link>
        </>
    )
}

export default Home;