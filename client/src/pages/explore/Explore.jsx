import { IoMdAdd } from "react-icons/io";
import { Link, useSearchParams } from "react-router-dom";
import Question from "../../layouts/Question";
import TopicsBar from "../../layouts/TopicsBar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLikedQuestions, getLikedSolutions, getUsers } from "../../redux/Slices/auth.slice";
import toast from "react-hot-toast";
import Loader from "../../layouts/Loader";
import useQuestions from "../../hooks/useQuestions";
import useAnswers from "../../hooks/useAnswers";

function Explore() {

    const authState = useSelector(state => state.auth);
    const [quesState] = useQuestions();
    const [ansState] = useAnswers();
    
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const [loading, setLoading] = useState();
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
    }, [searchParams.get('topic')])

    useEffect(() => {
        loadUsers();
    }, [])

    return (
        <>
            <div className="flex gap-3 bg-gray-950 pt-[4rem] overflow-hidden min-h-screen px-2 justify-center">
                {location.pathname !== '/answers' && <TopicsBar />}
                <div className="w-[75vw] md:w-[50vw] sm:w-[50vw] flex flex-col items-center my-3">
                    {loading ? <Loader /> : (quesState.questionList?.length ? quesState.questionList?.map((quest) => {
                        let date = quest.createdAt?.split('T')[0].split('-');
                        date = date[2] + "-" + date[1] + "-" + date[0];
                        return (<Question key={quest._id} questionId={quest._id} title={quest.title} creator={quest.userId} question={quest.question} createdAt={date} likes={quest.likes} topic={quest.topic} quesImage={quest.image}/>)
                    }) : (
                        <h2 className="text-white font-thin italic">Follow users to see questions here</h2>
                    ))}
                </div>
                <div className="fixed h-max w-[14.5rem] rounded-md sm:right-5 mt-3 hidden lg:flex flex-col border-[2px] border-gray-800">
                    <h1 className=" p-2 font-bold bg-gray-900 font-sans border-b-[1px] border-gray-800">User details</h1>
                    <h2 className="p-2 border-b-[1px] border-gray-800 text-sm flex justify-between px-2"><span>Following</span><span>{authState.data?.following?.length}</span></h2>
                    <h2 className="p-2 border-b-[1px] border-gray-800 text-sm flex justify-between px-2"><span>Total questions asked</span><span>{quesLength}</span></h2>
                    <h2 className="p-2 border-b-[1px] border-gray-800 text-sm flex justify-between px-2"><span>Total solutions provided</span><span>{solLength}</span></h2>
                    <h3 className="p-2 border-b-[1px] border-gray-800 text-sm flex justify-between px-2"><span>Upvotes recieved on questions</span><span>{quesLikes}</span></h3>
                    <h2 className="p-2 border-b-[1px] border-gray-800 text-sm flex justify-between px-2"><span>Upvotes recieved on answers</span><span>{solLikes}</span></h2>
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

export default Explore;