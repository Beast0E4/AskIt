import { useDispatch } from "react-redux";
import { useState } from "react";
import Loader from "./Loader";
import { deleteQues } from "../redux/Slices/ques.slice";
import toast from "react-hot-toast";
import { deleteSol } from "../redux/Slices/ans.slice";
import { deleteComment } from "../redux/Slices/comment.slice";
import { IoWarningSharp } from "react-icons/io5";

// eslint-disable-next-line react/prop-types
function DeleteModal({ type, id }) {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    async function onDelete() {
        setLoading(true);
        try {
            let res;
            if(type === 'question') res = await dispatch(deleteQues(id));
            else if(type === 'solution') res = await dispatch(deleteSol(id));
            else res = await dispatch(deleteComment(id));
            if(res.payload) location.reload();
        } catch (error) {
            setLoading(false); toast.error('Something went wrong');
        } finally {
            setLoading(false); 
        }
    }

    return (
        <dialog open className="modal modal-bottom sm:modal-middle">
            {loading && <Loader />}
            <div className="modal-box flex items-start gap-4">
                <IoWarningSharp className="h-10 w-10 text-[#F2BEA0]"/>
                <div>
                    <h3 className="font-bold text-lg">Are you sure ?</h3>
                    <p className="py-4">Are you sure you want to delete the selected {type}?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cancel</button>
                        </form>
                        <button onClick={onDelete} className="btn bg-[#f3a274] hover:bg-[#F2BEA0]">Confirm</button>
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export default DeleteModal;