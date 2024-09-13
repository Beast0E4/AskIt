import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdExplore, MdOutlineTrendingUp } from "react-icons/md";
import { FaHome } from "react-icons/fa";

function Navbar(){

    const authState = useSelector((state) => state.auth);

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState();
    const topics = ["All", "Miscellaneous", "Technology", "Science and Mathematics", "Health and Medicine", "Education and Learning", "Business and Finance", "Arts and Culture", "History and Geography", "Entertainment and Media", "Current Affairs and Politics", "Philosophy and Ethics", "Lifestyle", "Psychology", "Legal and Regulatory"];

    function toggle() {
        setOpen(!open);
    }

    useEffect(() => {
        if(location.pathname === '/questions') {
            if(topic === "All") navigate(`${location.pathname}?userid=${authState.data?._id}`);
            else if(topic) navigate(`${location.pathname}?userid=${authState.data?._id}&topic=${topic}`); toggle();
            return;
        }
        if(topic === "All") navigate(`${location.pathname}`);
        else if(topic) navigate(`${location.pathname}?topic=${topic}`);
        toggle();
    }, [topic, location.pathname])

    return (
        <div className="navbar bg-gray-900 shadow-2xl border-b-[3px] border-black fixed top-0 z-[100]">
            <div className="navbar-start">
                <div className="dropdown">
                <div onClick={() => toggle()} tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                    <li onClick={toggle}><Link to={'/'} id="Home">Home</Link></li>
                    <li onClick={toggle}><Link to={'/explore'}>Explore</Link></li>
                    <li onClick={toggle}><Link to={'/trending'}>Trending</Link></li>
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
                <Link to={'/'} className="ml-[2rem] flex items-end gap-4 text-2xl bg-transparent hover:bg-transparent hover:cursor-pointer font-bold text-[#F2BEA0] font-inconsolata">
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
            <div className="navbar-end gap-5">
                <Link className="mr-[2rem] bg-transparent hover:bg-transparent hover:cursor-pointer hover:border-b-2 hover:border-[#F2BEA0] hover:text-[#F2BEA0] font-bold" to={`/profile`} title="Profile">{authState.isLoggedIn ? authState.data?.name.substring(0, 10) : "Log In"}</Link>
            </div>
        </div>
    )
}

export default Navbar;