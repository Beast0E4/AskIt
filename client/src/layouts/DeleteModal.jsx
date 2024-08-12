import { useDispatch, useSelector } from "react-redux";
import { deleteUser, logout } from "../redux/Slices/auth.slice";
import { useNavigate } from "react-router-dom";

function DeleteModal() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authState = useSelector((state) => state.auth);

    async function onDelete() {
        const res = await dispatch(deleteUser(authState.data._id));
        let fRes = null;
        if(res) fRes = await dispatch(logout());
        if(fRes) navigate('/login');
    }

    return (
        <dialog id="deleteModal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">WARNING !</h3>
                <p className="py-4">Are you sure you want to delete your account?</p>
                <div className="modal-action">
                <form method="dialog">
                    <button className="btn">Cancel</button>
                </form>
                <button onClick={onDelete} className="btn">DELETE</button>
                </div>
            </div>
        </dialog>
    )
}

export default DeleteModal;