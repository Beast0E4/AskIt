import { useDispatch } from "react-redux";
import { useState } from "react";
import Loader from "./Loader";
import { deleteQues } from "../redux/Slices/ques.slice";
import toast from "react-hot-toast";
import { deleteSol } from "../redux/Slices/ans.slice";
import { deleteComment } from "../redux/Slices/comment.slice";

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
            <div className="modal-box">
                <h3 className="font-bold text-lg">WARNING !</h3>
                <p className="py-4">Are you sure you want to delete the selected {type}?</p>
                <div className="modal-action">
                <form method="dialog">
                    <button className="btn">CANCEL</button>
                </form>
                <button onClick={onDelete} className="btn text-red-500">DELETE</button>
                </div>
            </div>
        </dialog>
    )
}

export default DeleteModal;