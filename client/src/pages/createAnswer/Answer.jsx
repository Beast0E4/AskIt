import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAnswer } from "../../redux/Slices/ans.slice";
import useQuestions from "../../hooks/useQuestions";
import toast from "react-hot-toast";
import { BiSolidImageAdd } from "react-icons/bi";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "../../utils/cropUtils";

function Answer() {

    const authState = useSelector((state) => state.auth);
    const [quesState] = useQuestions();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [searchParams] = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [imageName, setImageName] = useState();
    const [file, setFile] = useState();
    const [croppedFile, setCroppedFile] = useState(null);
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [ans, setAns] = useState({
        userId: authState.data?._id,
        solution: "",
        questionId: searchParams.get('question')
    })

    const handleIconClick = () => {
        fileInputRef.current.click(); 
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0]; 
        setCropping(true); setFile(file);
        setImageName(file?.name.toString().substring(0, 16) + "..."); 
    };

    function handleChange(e){
        const {name, value} = e.target;
        setAns({
            ...ans,
            [name]: value.charAt(0).toUpperCase() + value.slice(1)
        });
    }

    async function onSubmit(){
        if(!ans.solution.toString().trim()) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('userId', ans.userId);
            formData.append('solution', ans.solution);
            formData.append('questionId', ans.questionId);
            if(file) formData.append('image', croppedFile);
            if(ans.solution.toString().trim()) await dispatch(createAnswer(formData));
        } catch (error) {
            toast.error('Could not create your answer'); setLoading(false);
        } finally {
            setLoading(false); navigate(`/answer?question=${searchParams.get('question')}`);
        }
    }

    function handleCancelCrop() {
        setFile(null); 
        setCropping(false); 
        setImageName(""); 
    }

    useEffect(() => {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
    }, []);

    return(
        <section className="h-full bg-gray-950 flex flex-col items-center py-6 justify-center min-h-screen">
            <div className="w-[20rem] sm:w-[50rem] h-full bg-gray-900 rounded-lg  md:mt-0 xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className="flex">
                        <h1 className="text-3xl uppercase font-bold">Create your answer</h1>
                    </div>
                    <div>
                        <p className="my-2 py-3 px-2">
                            {quesState?.currentQuestion[0]?.question}
                        </p>
                        {quesState?.currentQuestion[0]?.image && <a href={quesState?.currentQuestion[0]?.image} className="flex justify-center"><img src={quesState?.currentQuestion[0]?.image} /></a>}
                    </div>
                    <div className="flex justify-between items-center">
                        <h3>Add answer here</h3>
                        <div className="flex gap-4">
                            {imageName && <h2>{imageName}</h2>}
                            <BiSolidImageAdd className="h-6 w-6 hover:cursor-pointer" onClick={handleIconClick}/>
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
                        <input id="fileInput" type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
                    </div>
                    <textarea onChange={handleChange} name="solution" value={ans.solution} className="textarea textarea-bordered w-full resize-none" rows={10}></textarea>
                    <button onClick={onSubmit} className="btn btn-primary bg-gray-700 hover:bg-gray-800 hover:border-transparent border-transparent w-full font-bold text-white">{loading ? 'Uploading answer ...' : 'CREATE'}</button>
                </div>
            </div>
        </section>
    )
}

export default Answer;