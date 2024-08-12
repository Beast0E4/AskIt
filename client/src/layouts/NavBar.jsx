import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar(){

    const authState = useSelector((state) => state.auth);

    return (
        <div className="navbar bg-base-100 shadow-lg fixed top-0">
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
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow gap-3">
                    <li><Link to={'/'} id="Home">Home</Link></li>
                    <li><Link to={`/?userid=${authState?.data?._id}`}>My Questions</Link></li>
                    <li><Link to={'/users'}>Users</Link></li>
                </ul>
                </div>
                <Link to={'/'} className="ml-[2rem] text-xl bg-transparent hover:bg-transparent hover:cursor-pointer font-bold">AskIt</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="flex text-base font-medium px-1 gap-5">
                    <li><Link to={'/'} id="Home">Home</Link></li>
                    <li><Link to={`/?userid=${authState?.data?._id}`}>My Questions</Link></li>
                    <li><Link to={'/users'}>Users</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <Link className="mr-[2rem] bg-transparent hover:bg-transparent hover:cursor-pointer hover:underline" to={'/profile'}>{authState?.data ? authState.data.name : "Log In"}</Link>
            </div>
            </div>
    )
}

export default Navbar;