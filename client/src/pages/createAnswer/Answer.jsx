import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAnswer } from "../../redux/Slices/ans.slice";
import useQuestions from "../../hooks/useQuestions";
import toast from "react-hot-toast";

function Answer() {

    const authState = useSelector((state) => state.auth);
    const [quesState] = useQuestions();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [ans, setAns] = useState({
        userId: authState.data?._id,
        solution: "",
        questionId: searchParams.get('question')
    })

    function handleChange(e){
        const {name, value} = e.target;
        setAns({
            ...ans,
            [name]: value.charAt(0).toUpperCase() + value.slice(1)
        });
    }

    async function onSubmit(){
        setLoading(true);
        try {
            if(!ans.solution.toString().trim()) throw 'Error';
            await dispatch(createAnswer(ans));
        } catch (error) {
            toast.error('Could not create your answer'); setLoading(false);
        } finally {
            navigate('/'); setLoading(false);
        }
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
                    <h1 className="text-3xl uppercase font-bold">Create your answer</h1>
                    <div>
                        <p className="my-2 py-3 px-2">
                            {quesState?.currentQuestion[0]?.question}
                        </p>
                        {quesState?.currentQuestion[0]?.image && <a href={quesState?.currentQuestion[0]?.image} className="flex justify-center"><img src={quesState?.currentQuestion[0]?.image} /></a>}
                    </div>
                    <h3 className="mt-10">Add answer here</h3>
                    <textarea onChange={handleChange} name="solution" value={ans.solution} className="textarea textarea-bordered w-full resize-none" rows={10}></textarea>
                    <button onClick={onSubmit} className="btn btn-primary bg-gray-700 hover:bg-gray-800 hover:border-transparent border-transparent w-full font-bold text-white">{loading ? 'Uploading answer ...' : 'CREATE'}</button>
                </div>
            </div>
        </section>
    )
}

export default Answer;