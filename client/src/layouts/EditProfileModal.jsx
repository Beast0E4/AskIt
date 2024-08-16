import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, updateUser } from "../redux/Slices/auth.slice";

function EditProfileModal() {

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    const [file, setFile] = useState();
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: authState?.data?.email,
        password: "",
        profession: ""
    })

    function handleChange(e) {
        if(e.target.name === 'image'){
            setFile(e.target.files[0])
            return;
        }
        const {name, value} = e.target;
        setUserDetails({
            ...userDetails,
            [name] : value
        })
    }

    function resetDetails() {
        setUserDetails({
            ...userDetails,
            name: "",
            password: "",
            profession: ""
        })
    }

    const handleKeyPress = useCallback((e) => {
        if(e.key === 'Enter') document.getElementById('submitButton').click();
      }, []);
    

    async function onSubmit() {
        if(!userDetails.name || !userDetails.password) return;
        const formData = new FormData();
        for(var key in userDetails){
            formData.append(key, userDetails[key]);
        }
        if(file){
            formData.append('image', file);
        }
        console.log(...formData);
        const response = await dispatch(updateUser(formData));
        if(response) await dispatch(login(userDetails));
        resetDetails();
        if(response.payload) location.reload();
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <dialog id="profileModal" className="modal">
            <section className="h-[90vh] lg:w-[30vw] md:w-[80vw] flex flex-col items-center pt-6 justify-center">
                <div className="modal-box w-full bg-gray-800 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Update your username</h1>
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <input onChange={handleChange} type="file" name="image" encType="multipart/form-data"></input>
                            </div>
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <input onChange={handleChange} type="text" name="name" value={userDetails.name} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required/>
                            </div>
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profession</label>
                                <input onChange={handleChange} type="text" name="profession" value={userDetails.profession} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required/>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input onChange={handleChange} type="password" name="password" value={userDetails.password} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                            </div>
                            <button onClick={onSubmit} id="submitButton" className="w-full text-white bg-gray-800 border py-2 rounded-md hover:bg-gray-900 transition-all ease-in-out">Update account</button>
                            
                        </div>
                    </div>
                </div>
            </section>
        </dialog>
    )
}

export default EditProfileModal;