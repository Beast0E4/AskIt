import { useDispatch } from "react-redux";
import { logout } from "../redux/Slices/auth.slice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "./Loader";
import { IoWarningSharp } from "react-icons/io5";

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
            setLoading(false); navigate('/');
        }
    }

    return (
        <dialog id="logoutModal" className="modal modal-bottom sm:modal-middle">
            {loading && <Loader />}
            <div className="modal-box flex items-start gap-4">
                <IoWarningSharp className="h-10 w-10 text-[#F2BEA0]"/>
                <div className="w-full">
                    <h3 className="font-bold text-lg">Are you sure ?</h3>
                    <p className="py-4">Are you sure you want to logout?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cancel</button>
                        </form>
                        <button onClick={onLogout} className="btn bg-[#f3a274] hover:bg-[#F2BEA0]">Confirm</button>
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export default LogoutModal;