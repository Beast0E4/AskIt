import { useDispatch, useSelector } from "react-redux";
import EditProfileModal from "../../layouts/EditProfileModal";
import DeleteModal from "../../layouts/DeleteModal";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/Slices/auth.slice";
import { useEffect, useState } from "react";
import useQuestions from "../../hooks/useQuestions";

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
        let len = 0;
        for(var i = 0; i < quesState.questionList?.length; i ++){
            len = len + (quesState.questionList[i].userId === authState?.data?._id);
        }
        setListLength(len);
        console.log(listLength);
    }

    function onLogout(){
        dispatch(logout());
        navigate('/');
    }

    useEffect(() => {
        if(!authState.isLoggedIn) navigate('/login');
        calculateLength();
    }, []);

    return (
        <section className="relative pt-40 pb-24">
            <div className="w-full absolute top-0 left-0 z-0 h-60 bg-gray-900"></div>
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
                        className="rounded-full py-3.5 px-5 bg-gray-100 flex items-center group transition-all duration-500 hover:bg-indigo-100 ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path className="stroke-gray-700 transition-all duration-500 group-hover:stroke-indigo-600"
                                d="M14.1667 11.6666V13.3333C14.1667 14.9046 14.1667 15.6903 13.6785 16.1785C13.1904 16.6666 12.4047 16.6666 10.8333 16.6666H7.50001C5.92866 16.6666 5.14299 16.6666 4.65483 16.1785C4.16668 15.6903 4.16668 14.9047 4.16668 13.3333V11.6666M16.6667 9.16663V13.3333M11.0157 10.434L12.5064 9.44014C14.388 8.18578 15.3287 7.55861 15.3287 6.66663C15.3287 5.77466 14.388 5.14749 12.5064 3.89313L11.0157 2.8993C10.1194 2.3018 9.67131 2.00305 9.16668 2.00305C8.66205 2.00305 8.21393 2.3018 7.31768 2.8993L5.82693 3.89313C3.9454 5.14749 3.00464 5.77466 3.00464 6.66663C3.00464 7.55861 3.9454 8.18578 5.82693 9.44014L7.31768 10.434C8.21393 11.0315 8.66205 11.3302 9.16668 11.3302C9.67131 11.3302 10.1194 11.0315 11.0157 10.434Z"
                                stroke="#374151" />
                        </svg>
                        <span
                            className="px-2 font-medium text-base leading-7 text-gray-700 transition-all duration-500 group-hover:text-indigo-600">{authState?.data?.profession}</span>
                    </button>
                </div>
                <div className="flex flex-col lg:flex-row max-lg:gap-5 items-center justify-between py-0.5">
                    <div className="flex items-center gap-4">
                        <button onClick={showModal}
                            className="py-3.5 px-5 rounded-full bg-indigo-600 text-white font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-100 hover:bg-indigo-700">Edit
                            Profile</button>
                        <button onClick={onLogout}
                            className="py-3.5 px-5 rounded-full bg-indigo-50 text-green-700 font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-100">Logout</button>
                            <button onClick={showDeleteModal}
                            className="py-3.5 px-5 rounded-full bg-indigo-50 text-red-500 font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-100">Delete account</button>
                    </div>
                    <div className="flex gap-4">
                        <button className="py-2 px-5 rounded-md bg-slate-600 text-white font-semibold text-base transition-all hover:bg-slate-700">{listLength} Questions</button>
                    </div>
                </div>
            </div>
            <EditProfileModal />
            <DeleteModal />
        </section>
                                            
    )
}

export default Profile;