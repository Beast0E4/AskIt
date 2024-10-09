import { useDispatch, useSelector } from "react-redux";
import DeleteAccModal from "../../layouts/DeleteAccModal";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useQuestions from "../../hooks/useQuestions";
import useLikes from '../../hooks/useLikes'
import { MdDelete, MdDone, MdLogout } from "react-icons/md";
import useAnswers from "../../hooks/useAnswers";
import LogoutModal from "../../layouts/LogoutModal";
import { getFollowing, getSaved, getUsers, login, toggleFollowUser, updateUser } from "../../redux/Slices/auth.slice";
import toast from "react-hot-toast";
import Loader from "../../layouts/Loader";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropUtils';
import { RiUserFollowFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { BiSolidImageAdd } from "react-icons/bi";
import PicModal from "../../layouts/PicModal";
 
function Profile() {

    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const [quesState] = useQuestions();
    const [ansState] = useAnswers();
    useLikes();

    const authState = useSelector((state) => state.auth); 

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const [check, setCheck] = useState(false);
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [quesLength, setQuesLength] = useState(0)
    const [quesLikes, setQuesLikes] = useState(0);
    const [solLikes, setSolLikes] = useState(0);
    const [solLength, setSolLength] = useState(0);
    const [topicsCount, setTopicsCount] = useState([]);
    const [croppedFile, setCroppedFile] = useState(null);
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [date, setDate] = useState();
    const [file, setFile] = useState();
    const [name, setName] = useState(authState.data?.name);
    const [profession, setProfession] = useState(authState.data?.profession);
    const [followers, setFollowers] = useState(0);
    const [imageName, setImageName] = useState();
    const [showPicModal, setShowPicModal] = useState(false);
    const [modalData, setModalData] = useState({ image: '', name: '' });

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

    const handleIconClick = () => {
        fileInputRef.current.click(); 
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0]; 
        setCropping(true); setFile(file);
        setImageName(file?.name.toString().substring(0, 16) + "..."); 
    };

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
        const ques = quesState.downloadedQuestions?.filter((ques) => ques.userId === user?._id);
        let quesLikes = 0;
        ques.map((ques) => quesLikes += ques.likes);
        ques.map((quest) => {
            const idx = topics.findIndex((topic) => topic === quest.topic);
            incrementValueAtIndex(idx);
        })
        setQuesLikes(quesLikes);
        if(ques.length) setQuesLength(ques.length);
        const newArr = ansState.solutionList.flat();
        const arr = newArr.filter((ans) => ans?.userId === user?._id);
        let ansLikes = 0;
        arr.map((ans) => ansLikes += ans.likes); setSolLikes(ansLikes);
        const lt = newArr.filter(sol => sol?.userId === user?._id).length;
        setSolLength(lt);
    }

    async function onLogout(){
        document.getElementById('logoutModal').showModal();
    }

    function handleChange(e) {
        if(e.target.name === 'image'){
            setFile(e.target.files[0]);
            setCropping(true);
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
            if(e.target.id === 'image'&& croppedFile){
                const formData = new FormData();
                formData.append('image', croppedFile);
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
            setLoading(false); location.reload();
        }
    }

    function isFollowing(){
        setCheck(false);
        authState.following?.map((user) => {
            if(user === searchParams.get('userid')){
                setCheck(true); return;
            }
        })
    }

    function handleCancelCrop() {
        setFile(null);
        setCropping(false);
        document.getElementById('fileInput').value = ""; 
    }

    function followerCount(){
        authState.userList?.map((user) => {
            if(searchParams.get('userid')){
                if(user.following?.includes(searchParams.get('userid')))
                setFollowers(followers => followers + 1);
            }
            else if(user.following?.includes(authState.data?._id)){
                setFollowers(followers => followers + 1);
            }
        })
    }

    async function toggleFollow() {
        const res = await dispatch(toggleFollowUser({
            userId: searchParams.get('userid'),
            myId: authState.data?._id
        }));
        if(res) getFollowings();
    }

    async function getFollowings() {
        await dispatch(getFollowing(authState.data?._id));
    }

    async function loadSaved() {
        await dispatch(getSaved(authState.data?._id));
    }

    const closeModal = () => {
        setShowPicModal(false);
    };

    const imageClick = (name, image) => {
        console.log('haha' ,name, image)
        setModalData({
            name: name,
            image: image
        });
        setShowPicModal(true);
    }

    useEffect(() => {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        getFollowings(); loadSaved(); calculateLength();
    }, [])

    useEffect(() => {
        loadUser(); followerCount();
    }, [authState.userList?.length]);

    useEffect(() => {
        loadUsers();
    }, [quesState.questionList?.length]);

    useEffect(() => {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        if(searchParams.get('userid')) isFollowing();
        const len = topics.length;
        for(var i = 0; i < len; i ++){
            updateArrayAtIndex(i, 0);
        }
        calculateLength();
        let date = user?.createdAt.split('T')[0].split('-');
        if(date) date = date[2] + "-" + date[1] + "-" + date[0];
        setDate(date);
    }, [quesState.questionList?.length, ansState.solutionList?.length,  authState.following?.length, location.pathname]);

    return (
        <section className="min-h-screen relative pt-5 bg-gray-950">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
                <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
                    <img src={user?.image} alt={user?.name} className="rounded-full w-32 h-32 object-cover hover:cursor-pointer" onClick={() => imageClick(user?.name, user?.image)} />
                </div>
                <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center sm:items-end justify-between mb-3">
                    <div className="block">
                        <h3 className="font-manrope font-bold text-4xl text-white mb-1">{user?.name}</h3>
                        <p className="font-normal text-base leading-7 text-[#F2BEA0]">{user?.username}</p>
                        {!searchParams.get('userid') && <p className="font-normal text-base leading-7 text-gray-500">{user?.email}</p>}
                        <div className="flex items-center gap-4">
                            <p className="mt-2 font-normal text-base leading-7 text-gray-400">{followers} Followers</p>
                            <span className="font-bold text-gray-400">.</span>
                            <p className="mt-2 font-normal text-base leading-7 text-gray-400">{user?.following?.length} Following</p>
                        </div>
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
                            {!searchParams.get('userid') && <>
                                <div onClick={onLogout} className="hover:cursor-pointer text-light-blue-light rounded-md bg-gray-800 hover:text-white inline-flex items-center mr-4 px-4 py-2 text-gray-400 gap-4" title="Logout">
                                    <MdLogout className="w-5 h-5"/> Logout
                                </div>
                                <div onClick={showDeleteModal} className="hover:cursor-pointer text-light-blue-light bg-gray-800 hover:text-white inline-flex items-center mr-4 px-4 rounded-md py-2 text-gray-400 gap-4" title="Delete account">
                                    <MdDelete className="w-5 h-5"/> Delete Account
                                </div>
                                <Link to={`/following`} className="hover:cursor-pointer text-light-blue-light bg-gray-800 hover:text-white inline-flex items-center mr-4 px-4 rounded-md py-2 text-gray-400 gap-4" title="Following">
                                    <RiUserFollowFill className="w-5 h-5"/> Following
                                </Link>
                                <Link to={`/followers`} className="hover:cursor-pointer text-light-blue-light bg-gray-800 hover:text-white inline-flex items-center mr-4 px-4 rounded-md py-2 text-gray-400 gap-4" title="Followers">
                                    <IoPerson className="w-5 h-5"/> Followers
                                </Link>
                            </>}
                            {!check && searchParams.get('userid') && <button className="border-gray-800 border-2 px-4 py-2 rounded-full font-bold font-inconsolata hover:bg-gray-800 transition-all ease-in-out" onClick={toggleFollow}>+ Follow</button>}
                            {check && <button className="bg-gray-800 px-4 py-2 rounded-full font-bold font-inconsolata flex gap-2 items-center" onClick={toggleFollow}><MdDone/> Following</button>}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link to={`/questions?userid=${user?._id}`}><button className="py-2 px-5 rounded-md bg-gray-800 text-white text-base transition-all hover:bg-slate-700">{quesLength} Questions</button></Link>
                        <Link to={`/answers?userid=${user?._id}`}><button className="py-2 px-5 rounded-md bg-gray-800 text-white text-base transition-all hover:bg-slate-700">{solLength} Solutions</button></Link>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex-wrap w-[90vw] sm:w-[60vw] h-max mt-8 flex gap-4">
                        {topicsCount.map((count, index) => {
                            if(count > 0) return (<p key={index} className="flex-grow-0 text-[0.8rem] rounded-2xl border-[0.1px] w-max px-2 py-1 hover:cursor-pointer border-[#F2BEA0]">{topics[index]} x {count}</p>)
                        })}
                    </div>
                    <div className="flex flex-col sm:items-end items-center">
                        {!searchParams.get('userid') && <Link to={'/liked'}><div className="py-2 px-5 mt-[1rem] rounded-md bg-gray-800 text-white text-base hover:cursor-pointer hover:bg-slate-700" title="Liked questions">{authState.selectedUser?.likedQuestion?.length} like(s) provided</div></Link>}
                        <div className="py-2 px-5 mt-[1rem] rounded-md bg-gray-800 text-white text-base">{solLikes + quesLikes} like(s) recieved</div>
                        {!searchParams.get('userid') && <Link to={'/saved'} className="py-2 px-5 mt-[1rem] rounded-md bg-gray-800 text-white text-base">{authState.savedQuestions?.length} saved question(s)</Link>}
                    </div>
                </div>
                <div className="w-full bg-gray-800 h-[1px] mb-2 mt-4"></div>
                {loading && <Loader/>}
                {authState.data?._id === user?._id && <div className="w-full">
                    {cropping && file && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
                                <div className="relative w-full max-w-md h-[80vh] bg-white rounded-lg">
                                    <Cropper
                                        image={URL.createObjectURL(file)}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={(_, croppedAreaPixels) => {
                                            getCroppedImg(URL.createObjectURL(file), croppedAreaPixels)
                                                .then((croppedImage) => setCroppedFile(croppedImage))
                                                .catch((error) => console.error(error));
                                        }}
                                    />
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                                        <button 
                                            onClick={() => setCropping(false)} 
                                            className="text-green-500 bg-gray-700 px-4 py-2 rounded"
                                        >
                                            Done
                                        </button>
                                        <button 
                                            onClick={handleCancelCrop} 
                                            className="text-red-500 bg-gray-700 px-4 py-2 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    <h1 className="px-4 text-lg font-inconsolata font-bold mt-4 ">Update Information :</h1>
                    <div className="w-full flex flex-col sm:flex-row justify-between p-4 gap-4">
                        <h2 className="text-gray-400 font-inconsolata flex items-center">Update image</h2>
                        <div className="w-max flex flex-col sm:flex-row sm:items-center items-start gap-4">
                            <div className="flex gap-4">
                                {imageName && <h2>{imageName}</h2>}
                                <BiSolidImageAdd className="h-6 w-6 hover:cursor-pointer" onClick={handleIconClick}/>
                            </div>
                            <input id="fileInput" type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
                            <button onClick={onSubmit} id="image" className="text-sm border-[1px] border-white p-2 rounded-md hover:bg-white hover:text-black transition-all ease-in-out font-semibold px-4">Update</button>
                        </div>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-between p-4 gap-4">
                        <h2 className="text-gray-400 font-inconsolata flex items-center">Update name</h2>
                        <div className="w-max flex flex-col sm:flex-row sm:items-center gap-4 items-start">
                            <input onChange={handleChange} type="text" name="name" value={name} className="bg-gray-900 text-white sm:text-sm rounded-lg block p-2.5 border-[2px] border-gray-800 focus:outline-none" placeholder="John Doe" required/>
                            <button onClick={onSubmit} id="name" className="text-sm border-[1px] border-white p-2 rounded-md font-semibold px-4 hover:bg-white hover:text-black transition-all ease-in-out">Update</button>
                        </div>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-between p-4 gap-4">
                        <h2 className="text-gray-400 flex font-inconsolata items-center">Update profession</h2>
                        <div className="w-max flex flex-col sm:flex-row sm:items-center items-start gap-4">
                            <input onChange={handleChange} type="text" name="profession" value={profession} className="bg-gray-900 border-[2px] border-gray-800 text-white sm:text-sm rounded-lg block p-2.5 focus:outline-none" placeholder="Profession" required/>
                            <button onClick={onSubmit} id="profession" className="text-sm border-[1px] border-white p-2 rounded-md font-semibold px-4 hover:bg-white hover:text-black transition-all ease-in-out">Update</button>
                        </div>
                    </div>
                </div>}
            </div>
            <DeleteAccModal />
            <LogoutModal />
            {showPicModal && (<PicModal
                            picture={modalData.image}
                            name={modalData.name}
                            closeModal={closeModal} />)}
        </section>   
    )
}

export default Profile;