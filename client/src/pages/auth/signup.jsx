import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../redux/Slices/auth.slice";
import toast from "react-hot-toast";

function SignUp() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        profession: "",
        password: "",
    })

    function handleChange(e) {
        const {name, value} = e.target;
        if(name === 'confirmPassword') setPassword(value);
        else setUserDetails({
            ...userDetails,
            [name] : value
        })
    }

    function resetDetails() {
        setUserDetails({
            name: "",
            email: "",
            profession: "",
            password: "",
        })
        setPassword("");
    }

    const handleKeyPress = useCallback((e) => {
        if(e.key === 'Enter') document.getElementById('submitButton').click();
      }, []);
    

    async function onSubmit() {
        if(!userDetails.email.toString().trim() || !userDetails.name.toString().trim() || !userDetails.password.toString().trim() || !userDetails.profession.toString().trim()) return;
        if(userDetails.password !== password){
            toast.error('The passwords do not match'); return;
        }
        const response = await dispatch(signup(userDetails));
        if(response.payload) navigate('/login');
        else resetDetails();
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <section className="h-[100vh] flex flex-col items-center pt-6 justify-center">
            <div className="w-full bg-gray-800 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Create an account</h1>
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input onChange={handleChange} type="text" name="name" value={userDetails.name} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Id</label>
                            <input onChange={handleChange} type="email" name="email" value={userDetails.email} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="johndoe@enter.com" required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profession</label>
                            <input onChange={handleChange} type="text" name="profession" value={userDetails.profession} placeholder="Engineer" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input onChange={handleChange} type="password" name="password" value={userDetails.password} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                            <input onChange={handleChange} type="password"  value={password} name="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                        </div>
                        <button onClick={onSubmit} id="submitButton" className="w-full text-white bg-gray-800 border py-2 rounded-md hover:bg-gray-900 transition-all ease-in-out">Create an account</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">Already have an account? <Link to={'/login'} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign in here</Link></p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SignUp;