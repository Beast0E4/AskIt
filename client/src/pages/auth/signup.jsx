import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../redux/Slices/auth.slice";
import toast from "react-hot-toast";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropUtils';

function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [file, setFile] = useState(null);
    const [croppedFile, setCroppedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        profession: "",
        password: "",
    });
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    function handleChange(e) {
        if (e.target.name === 'image') {
            setFile(e.target.files[0]);
            setCropping(true); 
            return;
        }
        const { name, value } = e.target;
        if (name === 'confirmPassword') setPassword(value);
        else setUserDetails({
            ...userDetails,
            [name]: value
        });
    }

    function resetDetails() {
        setUserDetails({
            name: "",
            email: "",
            profession: "",
            password: "",
        });
        setPassword("");
        setCroppedFile(null);
        setFile(null);
    }

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') document.getElementById('submitButton').click();
    }, []);

    async function onSubmit() {
        setLoading(true);
        try {
            if (!userDetails.email.toString().trim() || !userDetails.name.toString().trim() || !userDetails.password.toString().trim() || !userDetails.profession.toString().trim()) return;
            if (userDetails.password !== password) {
                toast.error('The passwords do not match');
                return;
            }
            const formData = new FormData();
            for (var key in userDetails) {
                formData.append(key, userDetails[key]);
            }
            if (croppedFile) {
                formData.append('image', croppedFile);
            }
            const response = await dispatch(signup(formData));
            if (response.payload) navigate('/login');
            else resetDetails();
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleCancelCrop() {
        setFile(null);
        setCropping(false);
        document.getElementById('fileInput').value = ""; 
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
                            <input id="fileInput" onChange={handleChange} type="file" name="image" encType="multipart/form-data" required />
                        </div>
                        {cropping && file && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
                                <div className="relative w-full max-w-md h-[80vh] bg-white rounded-lg">
                                    <Cropper
                                        image={URL.createObjectURL(file)}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={(_, croppedAreaPixels) => {
                                            getCroppedImg(URL.createObjectURL(file), croppedAreaPixels)
                                                .then((croppedImage) => setCroppedFile(croppedImage))
                                                .catch((error) => console.error(error));
                                        }}
                                    />
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                                        <button 
                                            onClick={() => setCropping(false)} 
                                            className="bg-gray-700 text-green-600 px-4 py-2 rounded"
                                        >
                                            Done
                                        </button>
                                        <button 
                                            onClick={handleCancelCrop} 
                                            className="text-red-500 bg-gray-700 px-4 py-2 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input onChange={handleChange} type="text" name="name" value={userDetails.name} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Id</label>
                            <input onChange={handleChange} type="email" name="email" value={userDetails.email} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="johndoe@enter.com" required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profession</label>
                            <input onChange={handleChange} type="text" name="profession" value={userDetails.profession} placeholder="Engineer" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input onChange={handleChange} type="password" name="password" value={userDetails.password} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                            <input onChange={handleChange} type="password" value={password} name="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <button onClick={onSubmit} id="submitButton" className="w-full text-white bg-gray-700 hover:border-gray-600 hover:border-[1px] hover:bg-transparent py-2 rounded-md transition-all ease-in-out">{loading ? 'Submitting...' : 'Create an account'}</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">Already have an account? <Link to={'/login'} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign in here</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignUp;
