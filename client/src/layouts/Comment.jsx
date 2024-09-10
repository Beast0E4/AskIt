import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Comment({userId, description}) {

    const authState = useSelector((state) => state.auth);

    const navigate = useNavigate();
    
    const [userIdx, setUserIdx] = useState();
    const [name, setName] = useState("");
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")

    function findName(){
        const nm = authState.userList.findIndex((e) => e._id === userId);
        setUserIdx(nm);
        setName(authState?.userList[nm]?.name.substring(0, 10));
        setImage(authState.userList[nm]?.image);
    }

    async function userView() {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
        if(authState.userList[userIdx]._id != authState.data?._id) navigate(`/profile?userid=${authState.userList[userIdx]._id}`);
        else navigate('/profile');
    }

    useEffect(() => {
        findName();
    }, [userId])

    return (
        <div className="bg-transparent flex my-2">
            <a className="inline-block mr-4" href={image}>
                <img src={image} alt={name} className="rounded-full max-w-none w-8 h-8 object-cover" />
            </a>
            <div>
                <div className="bg-gray-800 rounded-lg px-4 pt-2 pb-2.5 w-[50vw] md:w-[35vw] sm:w-[35vw]">
                    <div className="flex items-center">
                        <a onClick={userView} className="inline-block font-bold mr-2 text-sm hover:cursor-pointer hover:underline">{name}</a>
                    </div>
                    <div className="text-normal leading-snug md:leading-normal">{description}</div>
                </div>
                {/* <div className="text-sm ml-4 mt-0.5 text-gray-500 dark:text-gray-400">14 w</div> */}
            </div>
        </div>
    )
}

export default Comment;