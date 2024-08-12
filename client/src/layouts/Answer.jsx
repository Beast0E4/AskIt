import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteSol } from "../redux/Slices/ans.slice";
import { useNavigate } from "react-router-dom";
import { TbPencil } from "react-icons/tb";
import EditAnswerModal from "./EditAnswerModal";

// eslint-disable-next-line react/prop-types
function Answer({solId, solution, createdAt, creator}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authState = useSelector((state) => state.auth);

    const [name, setName] = useState("");

    function findName(){
        const nm = authState.userList.find((e) => e._id === creator)?.name;
        setName(nm);
    }

    async function onDelete(){
        const res = await dispatch(deleteSol(solId));
        if(res.payload) navigate('/');
    }

    async function editAnswer(){
        document.getElementById('answerModal').showModal()
    }

    useEffect(() => {
        findName();
    }, []);

    return (
        <article className="mb-4 w-[90vw] break-inside p-6 bg-gray-700 flex flex-col bg-clip-border">
            <div className="flex pb-6 items-center justify-between">
            <div className="w-full flex justify-between items-center">
                {/* <a className="inline-block mr-4" href="#">
                <img className="rounded-full max-w-none w-14 h-14" src="https://randomuser.me/api/portraits/men/33.jpg" />
                </a> */}
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <a className="inline-block text-lg font-bold mr-2 text-md" href="#">{name}</a>
                    </div>
                    <div className="text-slate-500 text-sm dark:text-slate-300">
                        {createdAt}
                    </div>
                </div>
                <div className="flex gap-3">
                    {authState.data.name === name && <TbPencil onClick={editAnswer} className="w-[1.5rem] h-[1.5rem] hover:cursor-pointer"/>}
                    {authState.data.name === name && <MdDelete className="hover:cursor-pointer w-[1.5rem] h-[1.5rem]" onClick={onDelete}/>}
                </div>
            </div>
            </div>
            <hr className="bg-white"/>
            {/* <div className="py-4">
            <div className="flex justify-between gap-1 mb-1">
                <a className="flex" href="#">
                <img className="max-w-full rounded-l-lg"
                    src="https://images.pexels.com/photos/2128028/pexels-photo-2128028.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
                </a>
                <a className="flex" href="#">
                <img className="max-w-full rounded-r-lg"
                    src="https://images.pexels.com/photos/6145852/pexels-photo-6145852.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
                </a>
            </div>
            </div> */}
            {/* <h2 className="text-3xl font-extrabold">
            Web Design templates Selection
            </h2> */}
            <div className="py-4">
                <p>
                    {solution}
                </p>
            </div>
            <EditAnswerModal solution={solution} solutionId={solId}/>
        </article>
    )
}

export default Answer;