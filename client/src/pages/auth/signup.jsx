import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, sendOtp, signup, verifyOtp } from "../../redux/Slices/auth.slice";
import toast from "react-hot-toast";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropUtils';
import Loader from "../../layouts/Loader";

function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [file, setFile] = useState(null);
    const [croppedFile, setCroppedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [otp, setOtp] = useState ();
    const [clicked, setClicked] = useState (false);
    const [isVerified, setVerified] = useState (false);
    const [isOtpSending, setOtpSending] = useState (false);
    const [isVerifying, setVerifying] = useState (false);
    const [isOtpSent, setOtpSent] = useState (false);
    const [timer, setTimer] = useState (() => {
        // Load timer from localStorage or default to 20 seconds
        const savedTime = localStorage.getItem("otpTimer");
        return savedTime ? Math.max(0, Number(savedTime) - (Date.now() - Number(localStorage.getItem("otpStartTime"))) / 1000) : 20;
    });
    const [canResend, setCanResend] = useState (false);

    function handleChange(e) {
        if (e.target.name === 'image') {
            setFile(e.target.files[0]);
            setCropping(true); 
            return;
        }
        const { name, value } = e.target;
        if (name === 'confirmPassword') setPassword(value);
        else if (name === 'name' || name === 'profession') setUserDetails({
            ...userDetails,
            [name]: value.charAt(0).toUpperCase() + value.slice(1)
        });
        else setUserDetails({
            ...userDetails,
            [name]: value
        });
    }

    function handleOtpChange (e) {
        const isNum = /^\d*$/.test(e.target.value);
        if (!isNum) return;

        if (isNum) setOtp (e.target.value);
    }

    function resetDetails() {
        setUserDetails({
            ...userDetails,
            name: "",
            username: "",
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
            if (!isVerified) {
                toast.error ('OTP not verified'); return;
            }

            if (!userDetails.username.toString().trim() || !userDetails.password.toString().trim() || !userDetails.name.toString().trim()) return;

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
            
            if (response.payload) {
                const res = await dispatch (login (userDetails));
                if (res.payload) {
                    navigate('/', { replace: true });
                }
            }
            else resetDetails();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    function handleCancelCrop() {
        setFile(null);
        setCropping(false);
        document.getElementById('fileInput').value = ""; 
    }

    async function submitEmail () {
        if (isOtpSent) {
            resendOtp (); return;
        }

        setOtpSending (true);
        try {
            await dispatch (sendOtp ({ email: userDetails.email }));
        } catch (error) {
            toast.error (error.message);
            setOtpSending (false);
        } finally {
            setClicked (true);
            setOtpSending (false);
            setOtpSent (true);

            setTimer (20);
            localStorage.setItem("otpTimer", 20);
            localStorage.setItem("otpStartTime", Date.now());
        }
    }

    async function verify () {
        let response;
        setVerifying (true);
        try {
            response = await dispatch (verifyOtp ({ email: userDetails.email, otp }));
        } catch (error) {
            setVerifying (false);
            toast.error (error.message);
        } finally {
            if (!response.payload.data.error) {
                setVerified (true);
                document.getElementById ('verifyButton').disabled = true;
                document.getElementById ('otpInput').disabled = true;
                document.getElementById ('emailInput').disabled = true;
            }
            setVerifying (false);
        }
    }

    const resendOtp = async () => {
        setOtpSending (true); // Start loader
        try {
            await dispatch(sendOtp ({ email: userDetails.email }));
        } catch (error) {
            toast.error("Failed to resend OTP");
        } finally {
            setOtp ("");
            setOtpSending (false); // Stop loader
            toast.success("New OTP sent to your email!"); 

            setCanResend(false);
            setTimer(20); // Reset timer
            localStorage.setItem("otpTimer", 20);
            localStorage.setItem("otpStartTime", Date.now());
        }
    };

    useEffect(() => {
        if (!isOtpSent) return;

        if (timer > 0) {
            localStorage.setItem("otpTimer", timer);
            localStorage.setItem("otpStartTime", Date.now());

            document.getElementById ('sendOtp').disabled = true;

            const interval = setInterval(() => {
                setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setCanResend(true);
            document.getElementById ('sendOtp').disabled = false;
        }
    }, [timer, dispatch, isOtpSent]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <section className="flex h-[100vh] bg-gray-950 flex-col items-center pt-6 justify-center">
            {loading && <Loader />}
            <div className=" bg-gray-900 rounded-lg shadow md:mt-0 xl:p-0 w-full sm:w-[50%] lg:w-[35%]">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Create an account</h1>
                    <div className="flex flex-col gap-4">
                            <div className="flex flex-col items-center">
                                <div 
                                    onClick={() => document.getElementById('hiddenFileInput').click()}
                                    className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-300 cursor-pointer border-2 border-gray-500">
                                    {croppedFile ? (
                                    <img 
                                        src={URL.createObjectURL(croppedFile) || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"} 
                                        alt="Profile Preview" 
                                        className="object-cover w-full h-full" 
                                    />
                                    ) : (
                                    <img 
                                        src={"https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"} 
                                        alt="Profile Preview" 
                                        className="object-cover w-full h-full" 
                                    />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById("hiddenFileInput").click()}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white p-1 px-2 rounded-[50%]"
                                    >
                                        <i className="fa-solid fa-pencil text-gray-700 text-2xl"></i>
                                    </button>
                                    
                                </div>
                                <input 
                                    id="hiddenFileInput" 
                                    type="file" 
                                    name="image" 
                                    accept="image/*" 
                                    onChange={handleChange} 
                                    className="hidden" 
                                />
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
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Id</label>
                                <div className="flex bg-gray-700 border border-gray-600 rounded-lg">
                                    <input onChange={handleChange} type="email" id="emailInput" name="email" value={userDetails.email} className="text-gray-900 sm:text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none" placeholder="johndoe@enter.com" required />
                                    {userDetails.email?.includes ('@') && !isVerified && <button onClick={submitEmail}  id="sendOtp" className={`w-[25%] bg-transparent font-semibold border-l-2 flex items-center justify-center ${isOtpSent && timer ? `bg-gray-950 text-xs text-red-400` : ``}`}>
                                         {isOtpSending ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></div>
                                            ) : !isOtpSent ? (
                                                "Send OTP"
                                            ) : timer ? (
                                                `Resend OTP in ${Math.floor(timer)}s`
                                            ) : (
                                                "Send OTP"
                                            )}
                                    </button>}
                                </div>
                            </div>
                            {clicked && <div>
                                <label className="block mb-2 text-sm font-medium text-[#F2BEA0]">Enter OTP</label>
                                <div className="flex bg-gray-700 border border-gray-600 rounded-lg">
                                    <input onChange={handleOtpChange} maxLength={6} id="otpInput" type="text" name="otp" value={otp} placeholder="••••••" className="text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none" required />
                                    {otp?.toString().length == 6 && <button onClick={verify} className="w-[25%] text-sm font-bold text-green-600 flex justify-center items-center" id="verifyButton">
                                        {isVerifying ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></div>
                                            ) : isVerified ? (
                                                "Verified"
                                            ) : (
                                                "Verify OTP"
                                            )}
                                    </button>}
                                </div>
                            </div>}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input onChange={handleChange} type="text" name="name" value={userDetails.name} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="John Doe" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <input onChange={handleChange} type="text" name="username" value={userDetails.username} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white " placeholder="johndoe" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input onChange={handleChange} type="password" name="password" value={userDetails.password} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white " required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                <input onChange={handleChange} type="password" value={password} name="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white " required />
                            </div>
                    </div>
                    <div className="w-full flex flex-col items-end gap-2">
                        <button onClick={onSubmit} id="submitButton" className="text-white font-semibold bg-gray-700 hover:border-gray-600 hover:border-[1px] hover:bg-transparent p-2 px-4 rounded-md transition-all ease-in-out">{loading ? 'Submitting...' : 'Create Account'}</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">Already have an account? <Link to={'/login'} className="font-medium text-[#F2BEA0] hover:underline">Sign in here</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignUp;
