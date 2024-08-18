import { IoMdAdd } from "react-icons/io";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLikedQuestions, getLikedSolutions, getUsers } from "../../redux/Slices/auth.slice";
import Loader from "../../layouts/Loader";
import toast from "react-hot-toast";
import Answer from "../../layouts/Answer";
import useAnswers from '../../hooks/useAnswers'
import { filterSolutionByUser, getSolutionByUser } from "../../redux/Slices/ans.slice";

function Solutions() {

    const [ansState] = useAnswers();
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const location = useLocation();

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
        if(location.pathname === '/answers') await dispatch(getSolutionByUser(authState.data?._id));
    }
    

    useEffect(() => {
        loadSolutions();
    }, [location.pathname])

    useEffect(() => {
        loadUsers();
    }, [location.pathname])

    return (
        <>
            <div className="flex gap-3 bg-gray-950 justify-center pt-[4rem] min-h-screen px-2">
                <div className="w-[80vw] md:w-[50rem] sm:w-[25rem] flex flex-col items-center my-3">
                    <Home/>
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

export default Solutions;