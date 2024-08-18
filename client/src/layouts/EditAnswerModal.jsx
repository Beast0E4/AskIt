import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAnswer } from "../redux/Slices/ans.slice";

// eslint-disable-next-line react/prop-types
function EditAnswerModal() {

    const dispatch = useDispatch();

    const ansState = useSelector((state) => state.ans);
    const [ans, setAns] = useState(ansState.currentAnswer?.solution);

    useEffect(() => {
        setAns(ansState.currentAnswer?.solution);
    }, [ansState.currentAnswer?.solution])

    function handleChange(e){
        setAns(e.target.value);
    }

    async function onSubmit() {
        if(ans.toString().trim()){
            const res = await dispatch(updateAnswer({
                id: ansState.currentAnswer?._id,
                solution: {
                    solution: ans.toString().trim()
                }
            }))
            if(res) location.reload();
        }
    }

    return(
        <dialog id="answerModal" className="modal">
            <section className="h-[90vh] lg:w-[30vw] md:w-[80vw] flex flex-col items-center pt-6 justify-center">
                <div className="modal-box w-full rounded-lg bg-gray-950 shadow md:mt-0 sm:max-w-md xl:p-0">
                    <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Update your answer</h1>
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your answer</label>
                                <textarea onChange={handleChange} type="text" value={ans} rows={5} className="bg-gray-800 text-white sm:text-sm rounded-lg block w-full p-2.5 resize-none" required/>
                            </div>
                            <button onClick={onSubmit} id="submitButton" className="w-full text-white bg-gray-700 py-2 rounded-md hover:bg-gray-900 transition-all ease-in-out">Update answer</button>
                            
                        </div>
                    </div>
                </div>
            </section>
        </dialog>
    )
}

export default EditAnswerModal;