import { useSelector } from "react-redux";

function UserDetailsModal() {

    const authState = useSelector((state) => state.auth);

    return (
        <dialog id="userModal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{authState.selectedUser.name}</h3>
                <div className="flex gap-4 mt-3">
                    <label>Registered:</label>
                    <p>{authState.selectedUser.registered[2] + "-" + authState.selectedUser.registered[1] + "-" + authState.selectedUser.registered[0]}</p>
                </div>
                <div className="flex gap-4 mt-3">
                    <label>Profession:</label>
                    <p>{authState.selectedUser.profession}</p>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default UserDetailsModal;