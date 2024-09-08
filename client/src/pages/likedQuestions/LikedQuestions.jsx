import useQuestions from "../../hooks/useQuestions";
import { useEffect, useState } from "react";
import Question from "../../layouts/Question";
import TopicsBar from "../../layouts/TopicsBar";
import toast from "react-hot-toast";
import Loader from "../../layouts/Loader";
import useLikes from "../../hooks/useLikes";
import { useDispatch } from "react-redux";
import { getUsers } from "../../redux/Slices/auth.slice";
import { useSearchParams } from "react-router-dom";

function LikedQuestions() {

    const [quesState] = useQuestions();
    const [authState] = useLikes();

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const [likedQuestions, setLikedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    function loadQuestions(){
        setLoading(true);
        try {
            setLikedQuestions([]);
            authState.selectedUser?.likedQuestion?.map((ques) => {
                const question = quesState.downloadedQuestions.find(quest => (quest._id === ques.questionId && (searchParams.get('topic') ? quest.topic === searchParams.get('topic') : 1)));
                if(question) setLikedQuestions(likedQuestions => [... likedQuestions, question]);
            });
        } catch (error) {
            setLoading(false); toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    async function loadUsers() {
        setLoading(true);
        try {
            await dispatch(getUsers());
        } catch (error) {
            setLoading(false); toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, [authState.userList?.length]);

    useEffect(() => {
        loadQuestions(); 
    }, [authState.selectedUser?.likedQuestion?.length, searchParams.get('topic')])

    return(
        <>
            <div className="flex gap-3 bg-gray-950 pt-[4rem] overflow-hidden min-h-screen px-2 justify-center">
                {location.pathname !== '/answers' && <TopicsBar />}
                <div className="w-[75vw] md:w-[50vw] sm:w-[50vw] flex flex-col items-center my-3">
                    {(!authState.isLoggedIn ? (<h2 className="text-white font-thin italic">No questions yet</h2>) : loading ? <Loader /> : (likedQuestions?.length ? likedQuestions.reverse()?.map((quest, index) => {
                        let date = quest?.createdAt?.split('T')[0].split('-');
                        if(date) date = date[2] + "-" + date[1] + "-" + date[0];
                        return (<Question key={index} questionId={quest?._id} title={quest?.title} creator={quest?.userId} question={quest?.question} createdAt={date} likes={quest?.likes} topic={quest?.topic}/>)
                    }) : (
                        <h2 className="text-white font-thin italic">No questions yet</h2>
                    )))}
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
            </div>
            </div>
        </>
    )
}

export default LikedQuestions;