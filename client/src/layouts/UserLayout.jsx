import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/Slices/auth.slice";
import UserDetailsModal from "./UserDetailsModal";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function UserLayout({username, profession, userId}) {

    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function userView(){
        if(!authState.isLoggedIn) navigate('/login');
        const res = await dispatch(getUser(userId));
        if(res){
            document.getElementById('userModal').showModal();
        }
    }

    return(
        <div role="button"
            className="flex my-1 p-3 bg-gray-700 ">
            <div className="grid mr-4 place-items-center">
                <img alt="profile" src="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
                className="h-12 w-12 !rounded-full  object-cover object-center" />
            </div>
            <div>
                <h6 onClick={userView}
                className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900 hover:underline">
                {username}
                </h6>
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-300">
                {profession}
                </p>
            </div>
            <UserDetailsModal />
        </div>
    )
}

export default UserLayout;