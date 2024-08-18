import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import Question from "../layouts/Question";
import useQuestions from "../hooks/useQuestions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLikedQuestions, getLikedSolutions, getUsers } from "../redux/Slices/auth.slice";
import Loader from "../layouts/Loader";
import toast from "react-hot-toast";

function Home() {

    const [quesState] = useQuestions();
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();

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

    useEffect(() => {
        loadUsers();
    }, [quesState.questionList.length])

    return (
        <>
            <div className="flex gap-3 bg-gray-950 justify-center pt-[4rem] min-h-screen px-2">
                <div className="w-[80vw] md:w-[50rem] sm:w-[25rem] flex flex-col items-center my-3">
                    {loading ? <Loader /> : (quesState.questionList?.length ? quesState.questionList?.map((quest) => {
                        let date = quest.createdAt?.split('T')[0].split('-');
                        date = date[2] + "-" + date[1] + "-" + date[0];
                        return (<Question key={quest._id} questionId={quest._id} creator={quest.userId} question={quest.question} createdAt={date} likes={quest.likes}/>)
                    }) : (
                        <h2 className="text-white font-thin italic">No questions yet</h2>
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