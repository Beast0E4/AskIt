import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../redux/Slices/auth.slice";
import toast from "react-hot-toast";
import Loader from "../../layouts/Loader";

function SignIn() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: ""
    });

    function handleInputChange(e) {
        const {name, value} = e.target;
        setLoginDetails({
            ...loginDetails,
            [name]: value
        });
    }

    function resetLoginState() {
        setLoginDetails({
            email: "",
            password:""
        });
    }

    async function onSubmit() {
        setLoading(true);
        try {
            if(!loginDetails.email || !loginDetails.password) return;
            const response = await dispatch(login(loginDetails));
            if(!response.payload) resetLoginState();
            else navigate('/');
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyPress = useCallback((e) => {
        if(e.key === 'Enter') document.getElementById('submitButton').click();
      }, []);
    
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
          document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <section className="h-[90vh]  bg-gray-950 flex flex-col items-center pt-6 justify-center min-h-screen">
            <div className="w-[75vw] bg-gray-900 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    {loading && <Loader />}
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Log in to your account</h1>
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Id</label>
                            <input onChange={handleInputChange} value={loginDetails.email} type="email" name="email" className="text-white sm:text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 " placeholder="johndoe@enter.com" required/>
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input onChange={handleInputChange} value={loginDetails.password} type="password" name="password" id="password" placeholder="••••••••" className="text-white sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700" required/>
                        </div>
                        <button onClick={onSubmit} id="submitButton" className="w-full text-white bg-gray-700 hover:bg-gray-800 py-2 rounded-md transition-all ease-in-out">{loading ? 'Logging in ...' : 'Log In'}</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">Do not have an account? <Link to={'/signup'} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign up here</Link></p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SignIn;