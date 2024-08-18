import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../../redux/Slices/ques.slice";
import toast from "react-hot-toast";

function Question() {

    const authState = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState({
        question: ""
    })

    function handleONChange(e) {
        const {name, value} = e.target;
        setQuestion({
            ...question,
            [name]: value
        })
    }

    async function handleSubmit() {
        setLoading(true);
        try {
            if(!question.question.toString().trim()) throw 'Error';
            await dispatch(createQuestion({
                userId: authState.data._id,
                question: question.question.toString().trim()
            }));
        } catch (error) {
            toast.error('Could not create your question'); setLoading(false);
        } finally {
            navigate('/'); setLoading(false);
        }
    }

    useEffect(() => {
        if(!authState.isLoggedIn){
            navigate('/login'); return;
        }
    }, []);

    return (
        <section className="h-[90vh] bg-gray-950 flex flex-col items-center min-h-screen pt-6 justify-center">
            <div className="w-[20rem] sm:w-[30rem] bg-gray-900 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
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
                    <textarea name="question" onChange={handleONChange} value={question.question} className="textarea textarea-bordered w-full resize-none" rows={5}></textarea>
                    <button onClick={handleSubmit} className="btn btn-primary bg-gray-700 hover:bg-gray-800 hover:border-transparent border-transparent w-full font-bold text-white">{loading ? 'Uploading question ...' : 'CREATE'}</button>
                </div>
            </div>
        </section>
    )
}

export default Question;