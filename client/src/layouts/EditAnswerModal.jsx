import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAnswer } from "../redux/Slices/ans.slice";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function EditAnswerModal({solutionId, solution}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ans, setAns] = useState(solution);

    function handleChange(e) {
        const value = e.target.value;
        setAns(value);
    }

    async function onSubmit() {
        if(ans.toString().trim()){
            console.log(ans);
            const res = await dispatch(updateAnswer({
                id: solutionId,
                solution: {
                    solution: ans.toString().trim()
                }
            }))
            if(res) navigate('/');
        }
    }

    return(
        <dialog id="answerModal" className="modal">
            <section className="h-[90vh] lg:w-[30vw] md:w-[80vw] flex flex-col items-center pt-6 justify-center">
                <div className="modal-box w-full bg-gray-800 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Update your answer</h1>
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your answer</label>
                                <textarea onChange={handleChange} type="text" value={ans} rows={5} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none" required/>
                            </div>
                            <button onClick={onSubmit} id="submitButton" className="w-full text-white bg-gray-800 border py-2 rounded-md hover:bg-gray-900 transition-all ease-in-out">Update answer</button>
                            
                        </div>
                    </div>
                </div>
            </section>
        </dialog>
    )
}

export default EditAnswerModal;