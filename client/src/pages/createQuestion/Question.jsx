import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../../redux/Slices/ques.slice";
import toast from "react-hot-toast";

function Question() {

    const authState = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        if(!question.question.toString().trim()) return;
        const response = await dispatch(createQuestion({
            userId: authState.data._id,
            question: question.question.toString().trim()
        }));
        if(response){
            toast.custom((t) => (
                <div
                  className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                  } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Please reload the page
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-l border-gray-200">
                    <button
                      onClick={() => location.reload()}
                      className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Reload
                    </button>
                  </div>
                </div>
              ), {
                position: "top-center"
              })
            navigate('/');
        }
    }

    useEffect(() => {
        if(!authState.isLoggedIn) navigate('/login');
    }, []);

    return (
        <section className="h-[90vh] flex flex-col items-center pt-6 justify-center">
            <div className="w-full bg-gray-800 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-3xl uppercase font-bold">Create your question</h1>
                    <div className="my-4 bg-gray-500 py-5 px-2">
                        <label>Tips on getting good answers quickly</label>
                        <ul className="list-disc ml-4 text-sm">
                            <li>Make sure your question has not been asked already</li>
                            <li>Keep your question short and to the point</li>
                            <li>Double-check grammar and spelling</li>
                        </ul>
                    </div>
                    <h3 className="mt-10">Add question here</h3>
                    <textarea name="question" onChange={handleONChange} value={question.question} className="textarea textarea-bordered w-full resize-none" rows={5}></textarea>
                    <button onClick={handleSubmit} className="btn btn-primary bg-gray-300 hover:bg-gray-400 hover:border-transparent border-transparent w-full font-bold text-black">CREATE</button>
                </div>
            </div>
        </section>
    )
}

export default Question;