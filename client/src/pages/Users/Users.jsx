import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../layouts/UserLayout";
import { getUsers } from "../../redux/Slices/auth.slice";
import { useEffect } from "react";

function Users() {

    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    async function loadUsers(){
        await dispatch(getUsers());
    }

    useEffect(() => {
        loadUsers();
    }, [])

    return (
        <div className="flex flex-col items-center text-white w-full mt-20">
            <nav className="flex md:w-[50rem] sm:w-[25rem] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700 my-3">
                {authState.userList?.map((user) => {
                    return (<UserLayout key={user._id} userId={user._id} username={user.name} profession={user.profession}/>)
                })}
            </nav>
        </div>
    )
}

export default Users;