import { useDispatch } from "react-redux";
import { logout } from "../redux/Slices/auth.slice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "./Loader";

function LogoutModal() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    async function onLogout() {
        setLoading(true);
        try {
            await dispatch(logout());
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false); navigate('/login'); 
        }
    }

    return (
        <dialog id="logoutModal" className="modal modal-bottom sm:modal-middle">
            {loading && <Loader />}
            <div className="modal-box">
                <h3 className="font-bold text-lg">WARNING !</h3>
                <p className="py-4">Are you sure you want to logout?</p>
                <div className="modal-action">
                <form method="dialog">
                    <button className="btn">CANCEL</button>
                </form>
                <button onClick={onLogout} className="btn text-green-500">LOGOUT</button>
                </div>
            </div>
        </dialog>
    )
}

export default LogoutModal;