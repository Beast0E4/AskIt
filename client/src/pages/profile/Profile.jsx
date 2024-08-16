import { useDispatch, useSelector } from "react-redux";
import EditProfileModal from "../../layouts/EditProfileModal";
import DeleteModal from "../../layouts/DeleteModal";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/Slices/auth.slice";
import { useEffect, useState } from "react";
import useQuestions from "../../hooks/useQuestions";
import { MdDelete, MdLogout, MdOutlineModeEdit } from "react-icons/md";

function Profile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [quesState] = useQuestions();

    const authState = useSelector((state) => state.auth); 

    const [listLength, setListLength] = useState(0)

    function showModal() {
        document.getElementById('profileModal').showModal();
    }

    function showDeleteModal() {
        document.getElementById('deleteModal').showModal();
    }

    function calculateLength(){
        const len = quesState.questionList?.filter((ques) => ques.userId === authState?.data?._id);
        if(len.length) setListLength(len.length);
        console.log(listLength);
    }

    function onLogout(){
        dispatch(logout());
        navigate('/');
    }

    useEffect(() => {
        if(!authState.isLoggedIn) navigate('/login');
        calculateLength();
    }, [quesState.questionList.length]);

    return (
        <section className="h-[100vh] relative pt-32 pb-24 bg-gray-950">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
                <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
                    <img src={authState?.data?.image} alt="user-avatar-image" className="rounded-full w-32 h-32 object-cover" />
                </div>
                <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-between mb-5">
                    <div className="block">
                        <h3 className="font-manrope font-bold text-4xl text-white mb-1">{authState?.data?.name}</h3>
                        <p className="font-normal text-base leading-7 text-gray-500">{authState?.data?.email}</p>
                    </div>
                    <button
                        className="rounded-md py-3.5 px-5 bg-gray-100 flex items-center group transition-all duration-500 hover:bg-indigo-100 ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path className="stroke-gray-700 transition-all duration-500"
                                d="M14.1667 11.6666V13.3333C14.1667 14.9046 14.1667 15.6903 13.6785 16.1785C13.1904 16.6666 12.4047 16.6666 10.8333 16.6666H7.50001C5.92866 16.6666 5.14299 16.6666 4.65483 16.1785C4.16668 15.6903 4.16668 14.9047 4.16668 13.3333V11.6666M16.6667 9.16663V13.3333M11.0157 10.434L12.5064 9.44014C14.388 8.18578 15.3287 7.55861 15.3287 6.66663C15.3287 5.77466 14.388 5.14749 12.5064 3.89313L11.0157 2.8993C10.1194 2.3018 9.67131 2.00305 9.16668 2.00305C8.66205 2.00305 8.21393 2.3018 7.31768 2.8993L5.82693 3.89313C3.9454 5.14749 3.00464 5.77466 3.00464 6.66663C3.00464 7.55861 3.9454 8.18578 5.82693 9.44014L7.31768 10.434C8.21393 11.0315 8.66205 11.3302 9.16668 11.3302C9.67131 11.3302 10.1194 11.0315 11.0157 10.434Z"
                                stroke="#374151" />
                        </svg>
                        <span
                            className="px-2 font-medium text-base leading-7 text-gray-700 transition-all duration-500">{authState?.data?.profession}</span>
                    </button>
                </div>
                <div className="flex flex-col lg:flex-row max-lg:gap-5 items-center justify-between py-0.5">
                    <div className="flex bg-gray-900 w-fit px-1.25 py-1.25 rounded-md">
                        <div className="rounded-2xl w-full px-1.5 py-1.5 md:px-3 md:py-3">
                            <a onClick={showModal} className="hover:cursor-pointer text-light-blue-light hover:text-white dark:text-gray-400 border-2 inline-flex items-center mr-4 last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:border-2 hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:border-2 active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center dark:bg-button-curved-default-dark dark:shadow-button-curved-default-dark dark:hover:bg-button-curved-pressed-dark dark:hover:shadow-button-curved-pressed-dark dark:active:bg-button-curved-pressed-dark dark:active:shadow-button-curved-pressed-dark dark:focus:bg-button-curved-pressed-dark dark:focus:shadow-button-curved-pressed-dark dark:border-0 gap-4" title="Edit profile">
                                <MdOutlineModeEdit className="h-5 w-5 text-white"/> Edit account
                            </a>
                            <a onClick={showDeleteModal} className="hover:cursor-pointer text-light-blue-light hover:text-white dark:text-gray-400 border-2 inline-flex items-center mr-4 last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:border-2 hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:border-2 active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center dark:bg-button-curved-default-dark dark:shadow-button-curved-default-dark dark:hover:bg-button-curved-pressed-dark dark:hover:shadow-button-curved-pressed-dark dark:active:bg-button-curved-pressed-dark dark:active:shadow-button-curved-pressed-dark dark:focus:bg-button-curved-pressed-dark dark:focus:shadow-button-curved-pressed-dark dark:border-0 gap-4" title="Delete account">
                                <MdDelete className="w-5 h-5 text-white"/> Delete Account
                            </a>
                            <a onClick={onLogout} className="hover:cursor-pointer text-light-blue-light hover:text-white dark:text-gray-400 border-2 inline-flex items-center mr-4 last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:border-2 hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:border-2 active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center dark:bg-button-curved-default-dark dark:shadow-button-curved-default-dark dark:hover:bg-button-curved-pressed-dark dark:hover:shadow-button-curved-pressed-dark dark:active:bg-button-curved-pressed-dark dark:active:shadow-button-curved-pressed-dark dark:focus:bg-button-curved-pressed-dark dark:focus:shadow-button-curved-pressed-dark dark:border-0 gap-4" title="Logout">
                                <MdLogout className="w-5 h-5 text-white"/> Logout
                            </a>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="py-2 px-5 rounded-md bg-gray-800 text-white font-semibold text-base transition-all hover:bg-slate-700">{listLength} Questions</button>
                    </div>
                </div>
            </div>
            <EditProfileModal />
            <DeleteModal />
        </section>
                                            
    )
}

export default Profile;