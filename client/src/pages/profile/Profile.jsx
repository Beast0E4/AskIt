import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../../layouts/DeleteModal";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useQuestions from "../../hooks/useQuestions";
import { MdDelete, MdLogout } from "react-icons/md";
import useAnswers from "../../hooks/useAnswers";
import useLikes from '../../hooks/useLikes'
import LogoutModal from "../../layouts/LogoutModal";
import { getUsers, login, updateUser } from "../../redux/Slices/auth.slice";
import toast from "react-hot-toast";
import Loader from "../../layouts/Loader";
 
function Profile() {

    const navigate = useNavigate();

    const [quesState] = useQuestions();
    const [ansState] = useAnswers();
    const [likesState] = useLikes();

    const authState = useSelector((state) => state.auth); 

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [quesLength, setQuesLength] = useState(0)
    const [quesLikes, setQuesLikes] = useState(0);
    const [solLikes, setSolLikes] = useState(0);
    const [solLength, setSolLength] = useState(0);
    const [topicsCount, setTopicsCount] = useState([]);
    const [date, setDate] = useState();
    const [file, setFile] = useState();
    const [name, setName] = useState(authState.data?.name);
    const [profession, setProfession] = useState(authState.data?.profession);

    const topics = ["Miscellaneous", "Technology", "Science and Mathematics", "Health and Medicine", "Education and Learning", "Business and Finance", "Arts and Culture", "History and Geography", "Entertainment and Media", "Current Affairs and Politics", "Philosophy and Ethics", "Lifestyle", "Psychology", "Legal and Regulatory", "Sports"];

    function loadUser(){
        let currUser;
        if(!searchParams.get('userid')) currUser = authState.userList?.find((user) => user._id === authState.data?._id);
        else currUser = authState.userList?.find((user) => user._id === searchParams.get('userid'));
        setUser(currUser); 
    }

    function showDeleteModal() {
        document.getElementById('deleteModal').showModal();
    }

    const incrementValueAtIndex = (index) => {
        setTopicsCount(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = newArray[index] + 1; 
            return newArray;
        });
    };

    const updateArrayAtIndex = (index, newValue) => {
        setTopicsCount(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = newValue; 
            return newArray;
        });
    };

    function calculateLength(){
        const ques = quesState.questionList?.filter((ques) => ques.userId === user?._id);
        let quesLikes = 0;
        ques.map((ques) => quesLikes += ques.likes);
        ques.map((quest) => {
            const idx = topics.findIndex((topic) => topic === quest.topic);
            incrementValueAtIndex(idx);
        })
        setQuesLikes(quesLikes);
        if(ques.length) setQuesLength(ques.length);
        const newArr = ansState.solutionList.flat();
        const arr = newArr.filter((ans) => ans.userId === user?._id);
        let ansLikes = 0;
        arr.map((ans) => ansLikes += ans.likes); setSolLikes(ansLikes);
        const lt = newArr.filter(sol => sol.userId === user?._id).length;
        setSolLength(lt);
    }

    async function onLogout(){
        document.getElementById('logoutModal').showModal();
    }

    function handleChange(e) {
        if(e.target.name === 'image'){
            setFile(e.target.files[0])
            return;
        }
        if(e.target.name === 'name'){
            setName(e.target.value); return;
        }
        if(e.target.name === 'profession'){
            setProfession(e.target.value); return;
        }
    }

    async function loadUsers(){
        setLoading(true);
        try {
            await dispatch(getUsers());
        } catch (error) {
            toast.error('Something went wrong'); setLoading(false);
        } finally{
            setLoading(false);
        }
    }

    async function onSubmit(e){
        setLoading(true);
        try {
            if(e.target.id === 'image'){
                const formData = new FormData();
                formData.append('image', file);
                formData.append('email', authState.data?.email);
                await dispatch(updateUser(formData));
            }
            if(e.target.id === 'name'){
                await dispatch(updateUser({
                    name: name,
                    email: authState.data?.email
                }))
            }
            if(e.target.id === 'profession'){
                await dispatch(updateUser({
                    profession: profession,
                    email: authState.data?.email
                }))
            }
        } catch (error) {
            toast.error('Something went wrong'); setLoading(false);
        } finally {
            await dispatch(login({
                email: authState.data?.email
            })); 
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, [authState.userList?.length]);

    useEffect(() => {
        loadUsers();
    }, [quesState.questionList?.length]);

    useEffect(() => {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        const len = topics.length;
        for(var i = 0; i < len; i ++){
            updateArrayAtIndex(i, 0);
        }
        calculateLength();
        let date = user?.createdAt.split('T')[0].split('-');
        if(date) date = date[2] + "-" + date[1] + "-" + date[0];
        setDate(date);
    }, [quesState.questionList.length, ansState.solutionList?.length]);

    return (
        <section className="min-h-screen relative pt-5 bg-gray-950">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
                <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
                    <a href={user?.image} className="w-max"><img src={user?.image} alt="user-avatar-image" className="rounded-full w-32 h-32 object-cover" /></a>
                </div>
                <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center sm:items-end justify-between mb-5">
                    <div className="block">
                        <h3 className="font-manrope font-bold text-4xl text-white mb-1">{user?.name}</h3>
                        <p className="font-normal text-base leading-7 text-gray-500">{user?.email}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="py-2 px-5 text-sm text-gray-300 items-center border-r-[1px] border-gray-300">Registered {date}</div>
                        <div className="rounded-md px-5 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18"  fill="none">
                                <path className="stroke-gray-300 transition-all duration-500"
                                    d="M14.1667 11.6666V13.3333C14.1667 14.9046 14.1667 15.6903 13.6785 16.1785C13.1904 16.6666 12.4047 16.6666 10.8333 16.6666H7.50001C5.92866 16.6666 5.14299 16.6666 4.65483 16.1785C4.16668 15.6903 4.16668 14.9047 4.16668 13.3333V11.6666M16.6667 9.16663V13.3333M11.0157 10.434L12.5064 9.44014C14.388 8.18578 15.3287 7.55861 15.3287 6.66663C15.3287 5.77466 14.388 5.14749 12.5064 3.89313L11.0157 2.8993C10.1194 2.3018 9.67131 2.00305 9.16668 2.00305C8.66205 2.00305 8.21393 2.3018 7.31768 2.8993L5.82693 3.89313C3.9454 5.14749 3.00464 5.77466 3.00464 6.66663C3.00464 7.55861 3.9454 8.18578 5.82693 9.44014L7.31768 10.434C8.21393 11.0315 8.66205 11.3302 9.16668 11.3302C9.67131 11.3302 10.1194 11.0315 11.0157 10.434Z"
                                    stroke="#374151" />
                            </svg>
                            <p className="px-2 py-2 text-sm font-medium items-center text-gray-300">{user?.profession}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-gray-800 h-[1px] mb-2"></div>
                <div className="flex flex-col lg:flex-row max-lg:gap-5 items-center justify-between py-0.5">
                    <div className="flex flex-col">
                        <div className="flex flex-col sm:flex-row rounded-md w-full py-1.5 md:py-3">
                            <div onClick={onLogout} className="hover:cursor-pointer text-light-blue-light rounded-md bg-gray-800 hover:text-white inline-flex items-center mr-4 px-4 py-2 text-gray-400 gap-4" title="Logout">
                                <MdLogout className="w-5 h-5"/> Logout
                            </div>
                            <div onClick={showDeleteModal} className="hover:cursor-pointer text-light-blue-light bg-gray-800 hover:text-white inline-flex items-center mr-4 px-4 rounded-md py-2 text-gray-400 gap-4" title="Delete account">
                                <MdDelete className="w-5 h-5"/> Delete Account
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link to={`/questions?userid=${user?._id}`}><button className="py-2 px-5 rounded-md bg-gray-800 text-white font-semibold text-base transition-all hover:bg-slate-700">{quesLength} Questions</button></Link>
                        <Link to={`/answers?userid=${user?._id}`}><button className="py-2 px-5 rounded-md bg-gray-800 text-white text-base transition-all hover:bg-slate-700">{solLength} Solutions</button></Link>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex-wrap w-[90vw] sm:w-[60vw] h-max mt-8 flex gap-4">
                        {topicsCount.map((count, index) => {
                            if(count > 0) return (<p key={index} className="flex-grow-0 text-[0.8rem] rounded-2xl border-[0.1px] w-max px-2 py-1 hover:bg-[#F2BEA0] hover:text-black hover:font-bold hover:cursor-pointer border-[#F2BEA0]">{topics[index]} x {count}</p>)
                        })}
                    </div>
                    <div className="flex flex-col sm:items-end items-center">
                        {!searchParams.get('userid') && <Link to={'/liked'}><div className="py-2 px-5 mt-[1rem] rounded-md bg-gray-800 text-white text-base hover:cursor-pointer">{authState.selectedUser?.likedQuestion?.length} upvote(s) provided on questions</div></Link>}
                        <div className="py-2 px-5 mt-[1rem] rounded-md bg-gray-800 text-white text-base">{solLikes + quesLikes} upvote(s) on my interactions</div>
                        <div className="py-2 px-5 mt-[1rem] rounded-md bg-gray-800 text-white text-base">{likesState.selectedUser?.likedQuestion?.length + likesState.selectedUser?.likedSolution?.length} upvote(s) by user</div>
                    </div>
                </div>
                <div className="w-full bg-gray-800 h-[1px] mb-2 mt-4"></div>
                {loading && <Loader/>}
                {authState.data?._id === user?._id && <div className="w-full">
                    <h1 className="px-4 text-lg font-inconsolata font-bold mt-4 ">Update Information :</h1>
                    <div className="w-full flex flex-col sm:flex-row justify-between p-4 gap-4">
                        <h2 className="text-gray-400 font-inconsolata flex items-center">Update image</h2>
                        <div className="w-max flex flex-col sm:flex-row sm:items-center items-start gap-4">
                            <input onChange={handleChange} type="file" name="image" encType="multipart/form-data" required></input>
                            <button onClick={onSubmit} id="image" className="text-sm border-[1px] border-white p-2 rounded-md hover:bg-white hover:text-black transition-all ease-in-out font-semibold px-4">Update</button>
                        </div>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-between p-4 gap-4">
                        <h2 className="text-gray-400 font-inconsolata flex items-center">Update name</h2>
                        <div className="w-max flex flex-col sm:flex-row sm:items-center gap-4 items-start">
                            <input onChange={handleChange} type="text" name="name" value={name} className="bg-gray-900 border text-white sm:text-sm rounded-lg block p-2.5" placeholder="John Doe" required/>
                            <button onClick={onSubmit} id="name" className="text-sm border-[1px] border-white p-2 rounded-md font-semibold px-4 hover:bg-white hover:text-black transition-all ease-in-out">Update</button>
                        </div>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-between p-4 gap-4">
                        <h2 className="text-gray-400 flex font-inconsolata items-center">Update profession</h2>
                        <div className="w-max flex flex-col sm:flex-row sm:items-center items-start gap-4">
                            <input onChange={handleChange} type="text" name="profession" value={profession} className="bg-gray-900 border text-white sm:text-sm rounded-lg block p-2.5" placeholder="John Doe" required/>
                            <button onClick={onSubmit} id="profession" className="text-sm border-[1px] border-white p-2 rounded-md font-semibold px-4 hover:bg-white hover:text-black transition-all ease-in-out">Update</button>
                        </div>
                    </div>
                </div>}
            </div>
            <DeleteModal />
            <LogoutModal />
        </section>   
    )
}

export default Profile;