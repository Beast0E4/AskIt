import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../layouts/UserLayout";
import { getUsers } from "../../redux/Slices/auth.slice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../layouts/Loader";

function Following() {

    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    async function loadUsers(){
        setLoading(true);
        try {
            await dispatch(getUsers());
            let newUsers;
            if(location.pathname === '/following') newUsers = authState.userList?.filter((user) => authState.data?.following?.includes(user._id));
            else newUsers = authState.userList?.filter((user) => user.following?.includes(authState.data?._id));
            setUsers(users => [...users, ...newUsers]);
        } catch (error) {
            toast.error('Something went wrong'); setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    let filteredUsers = users;
    if(searchQuery) filteredUsers = users?.filter((user) =>
        user.name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );

    useEffect(() => {
        loadUsers();
    }, [authState.userList?.length])

    return (
        <div className="flex flex-col bg-gray-950 items-center text-white w-full min-h-screen pt-[4rem]">
            <div className="flex w-[75vw] md:w-[50vw] sm:w-[50vw] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700 my-3 items-center">
                {loading && <Loader />}
                {filteredUsers?.length ? filteredUsers?.map((user) => {
                    return (<UserLayout key={user._id} userId={user._id} username={user.name} profession={user.profession} image={user.image || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"}/>)
                }) : <h2 className="text-white font-thin italic">No users available</h2>}
            </div>
            <div className="fixed sm:right-5">
                <div className="hidden lg:flex mt-5 relative text-gray-600 w-[14.5rem]">
                    <input
                        className="bg-gray-900 text-white border-[2px] border-gray-800 placeholder:text-gray-300 h-10 px-5 pr-8 rounded-lg text-sm w-[14.7rem] focus:outline-none"
                        name="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                    <div className="absolute right-2 top-3">
                        <svg className="text-white h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
                            version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Following;