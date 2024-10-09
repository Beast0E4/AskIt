import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createQuestion } from "../../redux/Slices/ques.slice";
import toast from "react-hot-toast";
import { BiSolidImageAdd } from "react-icons/bi";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropUtils';
import Loader from "../../layouts/Loader";

function Question() {

    const authState = useSelector((state) => state.auth)
    const fileInputRef = useRef(null);
    const [searchParams] = useSearchParams();

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
        topic: "",
        repost: searchParams.get('repost') ? searchParams.get('repost') : null
    })
    const [croppedFile, setCroppedFile] = useState(null);
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isPoll, setPoll] = useState(false);
    const [options, setOptions] = useState([{ option: '', votes: 0 }]);

    const handleIconClick = () => {
        fileInputRef.current.click(); 
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0]; 
        setCropping(true); setFile(file);
        setImageName(file?.name.toString().substring(0, 16) + "..."); 
        console.log(imageName)
    };

    const handleOptionChange = (index, e) => {
        const updatedOptions = [...options];
        updatedOptions[index].option = e.target.value.toString().trim();
        setOptions(updatedOptions);
        if(options?.length <= index + 1) setOptions([...options, { option: '', votes: 0 }])
    };

    function handleONChange(e) {
        const {name, value} = e.target;
        if(name === 'topic'){
            setSelectedTopic(value); return;
        }
        setQuestion({
            ...question,
            [name]: value.charAt(0).toUpperCase() + value.slice(1)
        })
    }

    function changeComponent() {
        if(!isPoll){
            document.getElementById('problem').style.display = 'none';
            document.getElementById('poll').style.display = 'block';
        }
        else {
            document.getElementById('problem').style.display = 'block';
            document.getElementById('poll').style.display = 'none';
        }
        setPoll(!isPoll)
    }

    async function handleSubmit() {
        if(!question.question.toString().trim()) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('userId', authState.data._id);
            formData.append('title', question.title.toString().trim());
            formData.append('question', question.question.toString().trim());
            if(file) formData.append('image', croppedFile);
            formData.append('topic', selectedTopic); 
            if(searchParams.get('repost')) formData.append('repost', searchParams.get('repost'));
            if(isPoll){
                formData.append('options', JSON.stringify(options));
            }
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
        <section className="h-max  bg-gray-950 flex flex-col items-center min-h-screen py-6 justify-center">
            <div className="w-[25rem] sm:w-[50rem] bg-gray-900 rounded-lg shadow md:mt-0 xl:p-0">
                {loading && <Loader />}
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
                    <div onClick={changeComponent} className="w-full py-2 bg-gray-800 px-2 rounded-md">
                        <button className={`${!isPoll ? 'w-[50%] border-r-2 text-[#F2BEA0] font-bold' : 'w-[50%] border-r-2 text-white'}`} onClick={() => setPoll(false)}>Question</button>
                        <button className={`${isPoll ? 'w-[50%] text-[#F2BEA0] font-bold' : 'w-[50%] text-white'}`} onClick={() => setPoll(true)}>Poll</button>
                    </div>
                    <div id="problem" className="space-y-4 md:space-y-6">
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
                    </div>
                    <div id="poll" className="hidden space-y-4 md:space-y-6">
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
                        {options.map((opt, index) => (
                            <input
                            key={index}
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={opt.option}
                            className="textarea w-full"
                            onChange={(e) => handleOptionChange(index, e)}
                            />
                        ))}
                    </div>
                    <button onClick={handleSubmit} className="btn btn-primary bg-gray-700 hover:bg-gray-800 hover:border-transparent border-transparent w-full font-bold text-white">{loading ? 'Uploading question ...' : 'CREATE'}</button>
                </div>
            </div>
        </section>
    )
}

export default Question;