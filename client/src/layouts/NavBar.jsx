import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MdExplore, MdOutlineTrendingUp } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { readNotifications } from "../redux/Slices/notification.slice";

function Navbar () {

    const authState = useSelector((state) => state.auth);
    const notificationState = useSelector ((state) => state.notification);

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch ();

    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState();
    const [notificationCount, setNotificationCount] = useState (0);
    const [showNotifications, setShowNotifications] = useState(false);

    const userMapRef = useRef (new Map());
    const notificationRef = useRef ();

    const topics = ["All", "Miscellaneous", "Technology", "Science and Mathematics", "Health and Medicine", "Education and Learning", "Business and Finance", "Arts and Culture", "History and Geography", "Entertainment and Media", "Current Affairs and Politics", "Philosophy and Ethics", "Lifestyle", "Psychology", "Legal and Regulatory"];

    function openNotifications () {
        if (!authState.isLoggedIn) return;
        
        if (notificationState.notificationList?.length > 0) {
            setShowNotifications (!showNotifications);
        }
        dispatch (readNotifications ());
    }

    function getUsers () {
        const map = new Map();
        for (const user of authState.userList || []) {
            if (user?._id) map.set(user._id, user);
        }
        userMapRef.current = map;
    }

    function getTimeDifference(dateString) {
        const now = new Date();
        const targetDate = new Date(dateString);

        const nowUTC = Date.UTC(
            now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()
        );

        const targetDateUTC = Date.UTC(
            targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(),
            targetDate.getUTCHours(), targetDate.getUTCMinutes(), targetDate.getUTCSeconds()
        );

        const diffInSeconds = Math.floor((nowUTC - targetDateUTC) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} s`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} m`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} h`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} d`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} mo`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} y`;
    }

    useEffect(() => {
        if (authState.userList?.length) {
            getUsers();
        }
    }, [authState.userList]);


    useEffect (() => {
        setNotificationCount (localStorage.getItem ('readNotifications') || 0);
    }, [localStorage.getItem ('readNotifications')]);

    useEffect(() => {
        if(location.pathname === '/questions') {
            if(topic === "All") navigate(`${location.pathname}?userid=${authState.data?._id}`);
            else if(topic) navigate(`${location.pathname}?userid=${authState.data?._id}&topic=${topic}`); 
            setOpen (false);
            return;
        }
        if(topic === "All") navigate(`${location.pathname}`);
        else if(topic) navigate(`${location.pathname}?topic=${topic}`);
    }, [topic, location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setShowNotifications(false);
          }
        };
        if (showNotifications) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <div className="navbar bg-gray-900 shadow-2xl border-b-[3px] border-black fixed top-0 z-[100]">
            <div className="navbar-start">
                <div className="dropdown">
                <div onClick={() => setOpen(!open)} tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </div>
                {open && <ul
                    tabIndex={0}
                    className="min-h-screen menu menu-sm bg-gray-900 dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow gap-3 font-medium">
                    <li onClick={() => setOpen (!open)}><Link to={'/'} id="Home">Home</Link></li>
                    <li onClick={() => setOpen (!open)}><Link to={'/explore'}>Explore</Link></li>
                    <li onClick={() => setOpen (!open)}><Link to={'/trending'}>Trending</Link></li>
                    <li>
                        <details className="dropdown h-max">
                            <summary className="dropdown bg-gray-800">Topics</summary>
                            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 shadow">
                                {topics.map((item) => {
                                    return (<li key={item} onClick={() => {
                                        setTopic(item);
                                    }} className="my-1">{item}</li>)
                                })}
                            </ul>
                        </details>
                    </li>
                </ul>}
                </div>
                <Link to={'/'} className="ml-[1rem] md:ml-[2rem] flex items-end gap-4 text-2xl bg-transparent hover:bg-transparent hover:cursor-pointer font-bold text-[#F2BEA0] font-inconsolata">
                                <img src="https://res.cloudinary.com/dnaznkzoy/image/upload/v1724169395/Untitled_design-removebg-preview_osnjam.png" className="h-10"></img>
                                AskIt
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="flex text-base font-medium px-1 gap-5">
                    <li className="flex items-center gap-2"><FaHome className={`${location.pathname === '/' && !searchParams.get('userid') && !searchParams.get('trending') ? 'text-[#F2BEA0]' : ''}`}/><Link to={'/'} id="Home" className={`${location.pathname === '/' && !searchParams.get('userid') && !searchParams.get('trending') ? 'border-b-2 border-[#F2BEA0] text-[#F2BEA0]' : ''}`} title="Home">Home</Link></li>
                    <li className="flex items-center gap-2"><MdExplore className={`${location.pathname === `/explore` ? 'text-[#F2BEA0]' : ''}`}/><Link to={'/explore'} className={`${location.pathname === `/explore` ? 'border-b-2 border-[#F2BEA0] text-[#F2BEA0]' : ''}`} title="Explore">Explore</Link></li>
                    <li className="flex items-center gap-2"><MdOutlineTrendingUp className={`${location.pathname === `/trending` ? 'text-[#F2BEA0]' : ''}`}/><Link to={'/trending'} className={`${location.pathname === `/trending` ? 'border-b-2 border-[#F2BEA0] text-[#F2BEA0]' : ''}`} title="Trending">Trending</Link></li>
                    <li className={`${location.pathname === `/following` ? 'block border-b-2 border-[#F2BEA0] text-[#F2BEA0]' : 'hidden'}`}><h2 title="Following">Following</h2></li>
                    <li className={`${location.pathname === `/followers` ? 'block border-b-2 border-[#F2BEA0] text-[#F2BEA0]' : 'hidden'}`}><h2 title="Followers">Followers</h2></li>
                </ul>
            </div>
            <div className="navbar-end gap-5 flex items-center">
                <div className="relative">
                    <i className="fa-solid fa-bell text-gray-300 rounded-md p-2 hover:cursor-pointer hover:bg-gray-800" onClick={openNotifications}></i>
                    {notificationCount > 0 && <div className="absolute top-0 right-0 bg-red-500 text-white text-[0.5rem] h-2 px-1 py-1.5 flex items-center justify-center rounded-full min-w-2">
                        {notificationCount}
                    </div>}

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-64 md:w-80 bg-gray-800 shadow-lg rounded-lg z-50 text-sm" ref={notificationRef}>
                        <div className="px-4 py-2 font-semibold border-b text-[#F2BEA0]">Notifications</div>
                        <ul className="max-h-60 overflow-y-auto text-xs">
                            {notificationState.notificationList.map ((notification, index) => {
                                if (notification.type === 'follow-user') {
                                    if (notification.sender === authState.data?._id) return null
                                    return (
                                        <li className="px-4 py-2 hover:cursor-pointer text-white flex justify-between items-end" key={index}>
                                            <div>
                                                <Link to={`/profile?userid=${notification.sender}`} className="font-semibold font-inconsolata hover:underline">{userMapRef.current.get(notification.sender)?.name}</Link> stated following you
                                            </div>
                                            <div className="text-xs font-extralight">
                                                {getTimeDifference (notification.createdAt)}
                                            </div>
                                        </li>
                                    )
                                }
                                if (notification.type === 'like-question') {
                                    return (
                                        <li className="px-4 py-2 hover:cursor-pointer text-white flex justify-between items-end" key={index}>
                                            <div className="flex">
                                                <Link to={`/profile?userid=${notification.sender}`} className="font-semibold font-inconsolata hover:underline mr-1">{userMapRef.current.get(notification.sender)?.name}</Link> liked your question
                                                <div className="mx-1">•</div>
                                                <Link to={`/answer?question=${notification.questionId}`} className="text-xs font-extralight hover:underline text-[#F2BEA0]">View</Link>
                                            </div>
                                            <div className="text-xs font-extralight">
                                                {getTimeDifference (notification.createdAt)}
                                            </div>
                                        </li>
                                    )
                                }
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{notification.type}</li>
                            })}
                        </ul>
                        </div>
                    )}
                </div>
                <Link className="mr-[2rem] bg-transparent hover:bg-transparent hover:cursor-pointer hover:border-b-2 hover:border-[#F2BEA0] hover:text-[#F2BEA0] font-bold" to={`/profile`} title="Profile">{authState.isLoggedIn ? authState.data?.name.substring(0, 10) : "Log In"}</Link>
            </div>
        </div>
    )
}

export default Navbar;