import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
        <div className="navbar bg-gray-900 shadow-2xl fixed top-0">
            <div className="navbar-start">
                <div className="dropdown">
                <div onClick={() => setOpen(true)} tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                    <li onClick={toggle}><Link to={`/questions?userid=${authState?.data?._id}`}>My Questions</Link></li>
                    <li onClick={toggle}><Link to={`/answers?userid=${authState?.data?._id}`}>My Solutions</Link></li>
                    <li onClick={toggle}><Link to={'/users'}>Users</Link></li>
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
                <Link to={'/'} className="ml-[2rem] text-xl bg-transparent hover:bg-transparent hover:cursor-pointer font-bold">AskIt</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="flex text-base font-medium px-1 gap-5">
                    <li><Link to={'/'} id="Home" className={`${location.pathname === '/' && !searchParams.get('userid') ? 'border-b-2' : ''}`}>Home</Link></li>
                    <li><Link to={`/questions?userid=${authState?.data?._id}`} className={`${location.pathname === `/questions` && searchParams.get('userid') ? 'border-b-2' : ''}`}>My Questions</Link></li>
                    <li><Link to={`/answers?userid=${authState?.data?._id}`} className={`${location.pathname === `/answers` && searchParams.get('userid') ? 'border-b-2' : ''}`}>My Solutions</Link></li>
                    <li><Link to={'/users'} className={`${location.pathname === `/users` ? 'border-b-2' : ''}`}>Users</Link></li>
                </ul>
            </div>
            <div className="navbar-end gap-5">
                <Link className="mr-[2rem] bg-transparent hover:bg-transparent hover:cursor-pointer hover:border-b-2 font-bold" to={'/profile'}>{authState?.data ? authState.data.name.substring(0, 10) : "Log In"}</Link>
            </div>
            </div>
    )
}

export default Navbar;