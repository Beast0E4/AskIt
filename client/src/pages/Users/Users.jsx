import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../layouts/UserLayout";
import { getUsers } from "../../redux/Slices/auth.slice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../layouts/Loader";

function Users() {

    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    async function loadUsers(){
        setLoading(true);
        try {
            await dispatch(getUsers());
        } catch (error) {
            toast.error('Something went wrong'); setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, [])

    return (
        <div className="flex flex-col bg-gray-950 items-center text-white w-full min-h-screen pt-[4rem]">
            <div className="flex w-[80vw] md:w-[50rem] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700 my-3">
                {loading && <Loader />}
                {authState.userList?.map((user) => {
                    return (<UserLayout key={user._id} userId={user._id} username={user.name} profession={user.profession} image={user.image || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"}/>)
                })}
            </div>
        </div>
    )
}

export default Users;