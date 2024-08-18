import { useDispatch, useSelector } from "react-redux";
import EditProfileModal from "../../layouts/EditProfileModal";
import DeleteModal from "../../layouts/DeleteModal";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useQuestions from "../../hooks/useQuestions";
import { MdDelete, MdLogout, MdOutlineModeEdit } from "react-icons/md";
import useAnswers from "../../hooks/useAnswers";
import { logout } from "../../redux/Slices/auth.slice";
import useLikes from '../../hooks/useLikes'
 
function Profile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [quesState] = useQuestions();
    const [ansState] = useAnswers();
    const [likesState] = useLikes();

    const authState = useSelector((state) => state.auth); 

    const [quesLength, setQuesLength] = useState(0)
    const [quesLikes, setQuesLikes] = useState(0);
    const [solLikes, setSolLikes] = useState(0);
    const [solLength, setSolLength] = useState(0);
    const [date, setDate] = useState();

    function showModal() {
        document.getElementById('profileModal').showModal();
    }

    function showDeleteModal() {
        document.getElementById('deleteModal').showModal();
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

    async function onLogout(){
        await dispatch(logout());
        navigate('/');
    }

    useEffect(() => {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        calculateLength();
        let date = authState.data?.createdAt.split('T')[0].split('-');
        date = date[2] + "-" + date[1] + "-" + date[0];
        setDate(date);
    }, [quesState.questionList.length, ansState.solutionList?.length]);

    return (
        <section className="min-h-screen relative pt-32 pb-24 bg-gray-950">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
                <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
                    <a href={authState.data?.image} className="w-max"><img src={authState?.data?.image} alt="user-avatar-image" className="rounded-full w-32 h-32 object-cover" /></a>
                </div>
                <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-between mb-5">
                    <div className="block">
                        <h3 className="font-manrope font-bold text-4xl text-white mb-1">{authState?.data?.name}</h3>
                        <p className="font-normal text-base leading-7 text-gray-500">{authState?.data?.email}</p>
                    </div>
                    <div
                        className="rounded-md py-3.5 px-5 bg-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path className="stroke-white transition-all duration-500"
                                d="M14.1667 11.6666V13.3333C14.1667 14.9046 14.1667 15.6903 13.6785 16.1785C13.1904 16.6666 12.4047 16.6666 10.8333 16.6666H7.50001C5.92866 16.6666 5.14299 16.6666 4.65483 16.1785C4.16668 15.6903 4.16668 14.9047 4.16668 13.3333V11.6666M16.6667 9.16663V13.3333M11.0157 10.434L12.5064 9.44014C14.388 8.18578 15.3287 7.55861 15.3287 6.66663C15.3287 5.77466 14.388 5.14749 12.5064 3.89313L11.0157 2.8993C10.1194 2.3018 9.67131 2.00305 9.16668 2.00305C8.66205 2.00305 8.21393 2.3018 7.31768 2.8993L5.82693 3.89313C3.9454 5.14749 3.00464 5.77466 3.00464 6.66663C3.00464 7.55861 3.9454 8.18578 5.82693 9.44014L7.31768 10.434C8.21393 11.0315 8.66205 11.3302 9.16668 11.3302C9.67131 11.3302 10.1194 11.0315 11.0157 10.434Z"
                                stroke="#374151" />
                        </svg>
                        <span
                            className="px-2 font-medium text-base leading-7 text-white transition-all duration-500">{authState?.data?.profession}</span>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row max-lg:gap-5 items-center justify-between py-0.5">
                    <div className="flex flex-col px-1.25 py-1.25">
                        <div className="flex flex-col bg-gray-800 sm:flex-row rounded-md w-full px-1.5 py-1.5 md:px-3 md:py-3">
                            <a onClick={showModal} className="hover:cursor-pointer text-light-blue-light hover:text-white inline-flex items-center mr-4 p-2.5 text-gray-400 gap-4" title="Edit profile">
                                <MdOutlineModeEdit className="h-5 w-5"/> Edit account
                            </a>
                            <a onClick={onLogout} className="hover:cursor-pointer text-light-blue-light hover:text-white inline-flex items-center mr-4 p-2.5 text-gray-400 gap-4" title="Logout">
                                <MdLogout className="w-5 h-5"/> Logout
                            </a>
                            <a onClick={showDeleteModal} className="hover:cursor-pointer text-light-blue-light hover:text-white inline-flex items-center mr-4 p-2.5 text-gray-400 gap-4" title="Delete account">
                                <MdDelete className="w-5 h-5"/> Delete Account
                            </a>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link to={`/questions?userid=${authState?.data?._id}`}><button className="py-2 px-5 rounded-md bg-gray-800 text-white font-semibold text-base transition-all hover:bg-slate-700">{quesLength} Questions</button></Link>
                        <Link to={`/answers?userid=${authState?.data?._id}`}><button className="py-2 px-5 rounded-md bg-gray-800 text-white text-base transition-all hover:bg-slate-700">{solLength} Solutions</button></Link>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mt-[2rem] py-2 sm:w-[40vw]">
                        <h2 className="p-2 font-semibold bg-gray-800 w-full">My summary</h2>
                        <div className="flex items-center justify-between">
                            <h3 className="p-2 mt-2">Upvotes on my questions</h3>
                            <h3 className="p-2 mt-2 font-semibold">{quesLikes}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="p-2 mt-2">Upvotes on my solutions</h3>
                            <span className="p-2 mt-2 font-semibold">{solLikes}</span>
                        </div>
                        <hr/>
                        <div className="flex items-center justify-between">
                            <h3 className="p-2 mt-2">Total recieved upvotes</h3>
                            <span className="p-2 mt-2 font-semibold">{solLikes + quesLikes}</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:items-end items-center">
                        <div className="py-2 px-5 mt-[2rem] rounded-md bg-gray-800 text-white text-base">Registered {date}</div>
                        <div className="py-2 px-5 mt-[2rem] rounded-md bg-gray-800 text-white text-base">{likesState.selectedUser?.likedQuestion?.length} upvote(s) by me on questions</div>
                        <div className="py-2 px-5 mt-[2rem] rounded-md bg-gray-800 text-white text-base">{likesState.selectedUser?.likedSolution?.length} upvote(s) by me on solutions</div>
                    </div>
                </div>
            </div>
            <EditProfileModal />
            <DeleteModal />
        </section>   
    )
}

export default Profile;