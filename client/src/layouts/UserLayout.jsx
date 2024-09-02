import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/Slices/auth.slice";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function UserLayout({username, profession, userId, image}) {

    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function userView(){
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        const res = await dispatch(getUser(userId));
        if(res.payload?.data?._id != authState.data?._id) navigate(`/profile?userid=${res.payload?.data?._id}`);
        else navigate('/profile');
    }

    return(
        <div className="flex my-1 p-3 bg-gray-900 ">
            <a className="grid mr-4 place-items-center" href={image}>
                <img alt={username} src={image}
                className="h-12 w-12 !rounded-full  object-cover object-center" />
            </a>
            <div>
                <h6 onClick={userView}
                className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900 hover:underline hover:cursor-pointer">
                {username}
                </h6>
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-300">
                {profession}
                </p>
            </div>
        </div>
    )
}

export default UserLayout;