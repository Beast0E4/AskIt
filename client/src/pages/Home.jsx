import { IoMdAdd } from "react-icons/io";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Question from "../layouts/Question";
import useQuestions from "../hooks/useQuestions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowing, getLikedComments, getLikedQuestions, getLikedSolutions, getUsers } from "../redux/Slices/auth.slice";
import Loader from "../layouts/Loader";
import toast from "react-hot-toast";
import useAnswers from "../hooks/useAnswers";
import Answer from "../layouts/Answer";
import { getSolutionByUser } from "../redux/Slices/ans.slice";
import TopicsBar from "../layouts/TopicsBar";
import PollCard from "../layouts/PollCard";

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
    const [searchQuery, setSearchQuery] = useState("");

    async function loadUsers(){
        setLoading(true);
        try {
            await dispatch(getUsers());
            if(authState.data?._id){
                await dispatch(getLikedQuestions(authState.data?._id));
                await dispatch(getLikedSolutions(authState.data?._id));
                await dispatch(getLikedComments(authState.data?._id));
            }
        } catch (error) {
            toast.error('Something went wrong'); setLoading(false);
        } finally{
            setLoading(false);
        }
    }

    function calculateLength(){
        const ques = quesState.questionList?.filter((ques) => ques?.userId === authState?.data?._id);
        let quesLikes = 0;
        ques.map((ques) => quesLikes += ques.likes);
        setQuesLikes(quesLikes);
        if(ques.length) setQuesLength(ques.length);
        const newArr = ansState.solutionList.flat();
        const arr = newArr.filter((ans) => ans?.userId === authState.data?._id);
        let ansLikes = 0;
        arr.map((ans) => ansLikes += ans.likes); setSolLikes(ansLikes);
        const lt = newArr.filter(sol => sol?.userId === authState.data?._id).length;
        setSolLength(lt);
    }

    let filteredQuestions = quesState.questionList;
    if(searchQuery) filteredQuestions = quesState.questionList?.filter((quest) =>
        quest.title?.toLowerCase().includes(searchQuery?.toLowerCase())
    );

    const filteredSolutions = ansState.userSolutions?.filter((sol) =>
        sol.solution?.toLowerCase().includes(searchQuery?.toLowerCase())
    );

    async function loadFollowing() {
        if(authState.isLoggedIn) await dispatch(getFollowing(authState.data?._id));
    }

    async function loadSolutions(){
        await dispatch(getSolutionByUser(searchParams.get('userid')));
    }

    useEffect(() => {
        calculateLength();
    }, [searchParams.get('topic'), quesState.questionList?.length])

    useEffect(() => {
        loadFollowing();
    }, [])

    useEffect(() => {
        if(location.pathname === '/answers'){
            loadSolutions(); 
        }
    }, [location.pathname])

    useEffect(() => {
        loadUsers();
    }, [quesState.downloadedQuestions?.length])

    return (
        <>
            <div className="flex gap-3 bg-gray-950 pt-[4rem] overflow-hidden min-h-screen px-2 justify-center">
                {location.pathname !== '/answers' && <TopicsBar />}
                <div className="w-[75vw] md:w-[50vw] sm:w-[50vw] flex flex-col items-center my-3">
                    {(location.pathname === '/questions' || location.pathname === '/' || location.pathname === '/trending') && (loading ? <Loader /> : (filteredQuestions?.length ? filteredQuestions?.map((quest, key) => {
                        if(!quest.poll?.length) return (<Question key={key} questionId={quest._id} title={quest.title} creator={quest.userId} question={quest.question} createdAt={quest.createdAt} likes={quest.likes} topic={quest.topic} quesImage={quest.image} repost={quest.repost}/>)
                        return (<PollCard key={key} questionId={quest._id}/>)
                    }) : (
                        <h2 className="text-white font-thin italic">No questions yet</h2>
                    )))}
                    {location.pathname === '/answers' && (loading ? <Loader /> : filteredSolutions?.length ? filteredSolutions?.map((ans, index) => {
                        return (<Answer key={index} solId={ans._id} creator={ans.userId} solution={ans.solution} createdAt={ans.createdAt} likes={ans.likes}/>)
                    }) : (
                        <h2 className="text-white font-thin italic">No solutions yet</h2>
                    ))}
                </div>
                <div className="fixed sm:right-5">
                    <div className="hidden lg:flex mt-5 relative text-gray-600 w-[14.5rem]">
                        <input
                            className="bg-gray-900 text-white border-[2px] border-gray-800 placeholder:text-gray-300 h-10 px-5 pr-8 rounded-lg text-sm w-[14.7rem] focus:outline-none"
                            name="search"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                        <div className="absolute right-2 top-3">
                            <svg className="text-white h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
                                version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-5 h-max w-[14.5rem] rounded-md hidden lg:flex flex-col border-[2px] border-gray-800">
                        <h1 className=" p-2 font-bold bg-gray-900 font-sans border-b-[1px] border-gray-800">User details</h1>
                        <h2 className="p-2 border-b-[1px] border-gray-800 text-sm flex justify-between px-2"><span>Following</span><span>{authState.following?.length || 0}</span></h2>
                        <h2 className="p-2 border-b-[1px] border-gray-800 text-sm flex justify-between px-2"><span>Total questions asked</span><span>{quesLength}</span></h2>
                        <h2 className="p-2 border-b-[1px] border-gray-800 text-sm flex justify-between px-2"><span>Total solutions provided</span><span>{solLength}</span></h2>
                        <h3 className="p-2 border-b-[1px] border-gray-800 text-sm flex justify-between px-2"><span>Likes recieved on questions</span><span>{quesLikes}</span></h3>
                        <h2 className="p-2 border-b-[1px] border-gray-800 text-sm flex justify-between px-2"><span>Likes recieved on answers</span><span>{solLikes}</span></h2>
                    </div>
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