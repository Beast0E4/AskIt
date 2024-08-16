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
            <div className="flex w-[80vw] md:w-[50rem] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700 my-3">
                {authState.userList?.map((user) => {
                    return (<UserLayout key={user._id} userId={user._id} username={user.name} profession={user.profession} image={user.image || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"}/>)
                })}
            </div>
        </div>
    )
}

export default Users;