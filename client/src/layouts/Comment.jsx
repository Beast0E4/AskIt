import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import DeleteModal from "./DeleteModal";

// eslint-disable-next-line react/prop-types
function Comment({commentId, userId, description, createdAt}) {

    const authState = useSelector((state) => state.auth);

    const navigate = useNavigate();

    const dropdownRef = useRef(null);
    
    const [userIdx, setUserIdx] = useState();
    const [name, setName] = useState("");
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png")
    const [isOpen, setIsOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState();
    const [showModal, setShowModal] = useState(false);

    function findName(){
        const nm = authState.userList.findIndex((e) => e._id === userId);
        setUserIdx(nm);
        setName(authState?.userList[nm]?.name.substring(0, 10));
        setImage(authState.userList[nm]?.image);
    }

    async function onDelete(){
        setIsOpen(false);
        setSelectedComment(commentId);
        setShowModal(true);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
        if (isOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [isOpen]);

    return (
        <div className="bg-transparent flex my-2">
            <a className="inline-block mr-4" href={image}>
                <img src={image} alt={name} className="rounded-full max-w-none w-8 h-8 object-cover" />
            </a>
            <div>
                <div className="bg-gray-800 rounded-lg px-4 pt-2 pb-2.5 w-[50vw] md:w-[35vw] sm:w-[35vw]">
                    <div className="flex items-center justify-between">
                        <div className="mb-2">
                            <a onClick={userView} className="inline-block font-bold mr-2 text-sm hover:cursor-pointer hover:underline">{name}</a>
                            <h2 className="text-slate-300 text-xs">{createdAt.toString()?.split('T')[0].split('-').reverse().join("-")}</h2>
                        </div>
                        {userId === authState.data?._id && <div className="relative inline-block text-left z-[0]" ref={dropdownRef}>
                            <div>
                                <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex justify-center w-full shadow-sm px-4 py-2 focus:outline-none"
                                >
                                <BsThreeDotsVertical className="h-5 w-5" />
                                </button>
                            </div>

                            {isOpen && (
                                <div
                                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-700 focus:outline-none z-10"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="menu-button"
                                tabIndex="-1"
                                >
                                    <div className="py-1" role="none">
                                        <h2
                                            className="block px-4 py-2 text-sm text-white hover:bg-gray-600 font-semibold"
                                            role="menuitem"
                                            tabIndex="-1"
                                            onClick={onDelete}
                                        >
                                        Delete
                                        </h2>
                                    </div>
                                </div>
                            )}
                        </div>}
                    </div>
                    <div className="text-normal leading-snug md:leading-normal">{description}</div>
                </div>
                {/* <div className="text-sm ml-4 mt-0.5 text-gray-500 dark:text-gray-400">14 w</div> */}
            </div>
            {showModal && <DeleteModal type='comment' id={selectedComment}/>}
        </div>
    )
}

export default Comment;