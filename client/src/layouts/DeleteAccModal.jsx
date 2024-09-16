import { useDispatch, useSelector } from "react-redux";
import { deleteUser, logout } from "../redux/Slices/auth.slice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "./Loader";
import { IoWarningSharp } from "react-icons/io5";

function DeleteAccModal() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authState = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false);

    async function onDelete() {
        setLoading(true);
        try {
            const res = await dispatch(deleteUser(authState.data._id));
            if(res) await dispatch(logout());
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false); navigate('/login'); 
        }
    }

    return (
        <dialog id="deleteModal" className="modal modal-bottom sm:modal-middle">
            {loading && <Loader />}
            <div className="modal-box flex items-start gap-4">
                <IoWarningSharp className="h-10 w-10 text-[#F2BEA0]"/>
                <div className="w-full">
                    <h3 className="font-bold text-lg">Are you sure ?</h3>
                    <p className="py-4">Are you sure you want to delete your account?</p>
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

export default DeleteAccModal;