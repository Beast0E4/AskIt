import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../redux/Slices/auth.slice";
import toast from "react-hot-toast";

function SignUp() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        profession: "",
        password: "",
    })

    function handleChange(e) {
        if(e.target.name === 'image'){
            setFile(e.target.files[0])
            return;
        }
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
        setLoading(true);
        try {
            if(!userDetails.email.toString().trim() || !userDetails.name.toString().trim() || !userDetails.password.toString().trim() || !userDetails.profession.toString().trim()) return;
            if(userDetails.password !== password){
                toast.error('The passwords do not match'); return;
            }
            const formData = new FormData();
            for(var key in userDetails){
                console.log(userDetails[key]);
                formData.append(key, userDetails[key]);
            }
            if(file){
                formData.append('image', file);
            }
            const response = await dispatch(signup(formData));
            if(response.payload) navigate('/login');
            else resetDetails();
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <section className="h-[100vh] bg-gray-950 flex flex-col items-center pt-6 justify-center">
            <div className="w-[75vw] bg-gray-900 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Create an account</h1>
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <input onChange={handleChange} type="file" name="image" encType="multipart/form-data"></input>
                        </div>
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
                        <button onClick={onSubmit} id="submitButton" className="w-full text-white bg-gray-700 hover:bg-gray-800 py-2 rounded-md hover:bg-gray-900 transition-all ease-in-out">{loading ? 'Submitting...' : 'Create an account'}</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">Already have an account? <Link to={'/login'} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign in here</Link></p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SignUp;