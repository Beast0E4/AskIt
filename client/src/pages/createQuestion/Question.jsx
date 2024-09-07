import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../../redux/Slices/ques.slice";
import toast from "react-hot-toast";
import { BiSolidImageAdd } from "react-icons/bi";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropUtils';

function Question() {

    const authState = useSelector((state) => state.auth)
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const topics = ["Miscellaneous", "Technology", "Science and Mathematics", "Health and Medicine", "Education and Learning", "Business and Finance", "Arts and Culture", "History and Geography", "Entertainment and Media", "Current Affairs and Politics", "Philosophy and Ethics", "Lifestyle", "Psychology", "Legal and Regulatory", "Sports"];
    const [loading, setLoading] = useState(false);
    const [imageName, setImageName] = useState();
    const [file, setFile] = useState();
    const [selectedTopic, setSelectedTopic] = useState(topics[0]);
    const [question, setQuestion] = useState({
        title: "",
        question: "",
        topic: ""
    })
    const [croppedFile, setCroppedFile] = useState(null);
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const handleIconClick = () => {
        fileInputRef.current.click(); 
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0]; 
        setCropping(true); setFile(file);
        setImageName(file?.name.toString().substring(0, 16) + "..."); 
    };

    function handleONChange(e) {
        const {name, value} = e.target;
        if(name === 'topic'){
            setSelectedTopic(value); return;
        }
        setQuestion({
            ...question,
            [name]: value
        })
    }

    async function handleSubmit() {
        setLoading(true);
        try {
            if(!question.question.toString().trim() || !question.title.toString().trim()) throw 'Error';
            const formData = new FormData();
            formData.append('userId', authState.data._id);
            formData.append('title', question.title.toString().trim());
            formData.append('question', question.question.toString().trim());
            formData.append('topic', selectedTopic);
            if(file) formData.append('image', croppedFile);
            await dispatch(createQuestion(formData));
        } catch (error) {
            toast.error('Could not create your question'); setLoading(false);
        } finally {
            navigate('/'); setLoading(false);
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

    return (
        <section className="h-[90vh] bg-gray-950 flex flex-col items-center min-h-screen py-6 justify-center">
            <div className="w-[25rem] sm:w-[50rem] bg-gray-900 rounded-lg shadow md:mt-0 xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-3xl uppercase font-bold">Create your question</h1>
                    <div className="my-4 bg-gray-800 py-5 px-2">
                        <label>Tips on getting good answers quickly</label>
                        <ul className="list-disc ml-4 text-sm">
                            <li>Make sure your question has not been asked already</li>
                            <li>Keep your question short and to the point</li>
                            <li>Double-check grammar and spelling</li>
                        </ul>
                    </div>
                    <h3 className="mt-10">Add question here</h3>
                    <div className="flex gap-40 items-end justify-between">
                        <select onChange={handleONChange} name="topic" value={selectedTopic} className="select select-bordered w-full max-w-xs">
                            {topics.map((topic) => (
                                <option key={topic}>{topic}</option>
                            ))}
                        </select>
                        <div className="flex gap-4">
                            {imageName && <h2>{imageName}</h2>}
                            <BiSolidImageAdd className="h-6 w-6 hover:cursor-pointer" onClick={handleIconClick}/>
                        </div>
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
                    <input name="title" onChange={handleONChange} value={question.title} className="textarea w-full" placeholder="Title for question"/>
                    <textarea name="question" onChange={handleONChange} value={question.question} className="textarea textarea-bordered w-full resize-none" placeholder="Your question" rows={5}></textarea>
                    <button onClick={handleSubmit} className="btn btn-primary bg-gray-700 hover:bg-gray-800 hover:border-transparent border-transparent w-full font-bold text-white">{loading ? 'Uploading question ...' : 'CREATE'}</button>
                </div>
            </div>
        </section>
    )
}

export default Question;