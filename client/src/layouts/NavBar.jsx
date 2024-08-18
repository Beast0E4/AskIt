import { useSelector } from "react-redux";
import { Link, useLocation, useSearchParams } from "react-router-dom";

function Navbar(){

    const authState = useSelector((state) => state.auth);
    const location = useLocation();
    const [searchParams] = useSearchParams();

    return (
        <div className="navbar bg-gray-900 shadow-lg fixed top-0">
            <div className="navbar-start">
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                <ul
                    tabIndex={0}
                    className="menu menu-sm bg-gray-900 dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow gap-3 font-medium">
                    <li><Link to={'/'} id="Home">Home</Link></li>
                    <li><Link to={`/questions?userid=${authState?.data?._id}`}>My Questions</Link></li>
                    <li><Link to={`/answers?userid=${authState?.data?._id}`}>My Solutions</Link></li>
                    <li><Link to={'/users'}>Users</Link></li>
                </ul>
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