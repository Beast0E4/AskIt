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
                        console.log(likedQuestions.length);
                        let date = quest?.createdAt?.split('T')[0].split('-');
                        if(date) date = date[2] + "-" + date[1] + "-" + date[0];
                        return (<Question key={index} questionId={quest?._id} title={quest?.title} creator={quest?.userId} question={quest?.question} createdAt={date} likes={quest?.likes} topic={quest?.topic}/>)
                    }) : (
                        <h2 className="text-white font-thin italic">No questions yet</h2>
                    )))}
                </div>
            </div>
        </>
    )
}

export default LikedQuestions;