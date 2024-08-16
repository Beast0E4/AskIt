import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAnswer } from "../../redux/Slices/ans.slice";
import useQuestions from "../../hooks/useQuestions";

function Answer() {

    const authState = useSelector((state) => state.auth);
    const [quesState] = useQuestions();

    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    const [ans, setAns] = useState({
        answer: ""
    })

    function handleChange(e){
        const {name, value} = e.target;
        setAns({
            ...ans,
            [name]: value
        });
    }

    async function onSubmit(){
        if(!ans.answer.toString().trim()) return;
        const response = await dispatch(createAnswer({
            userId: authState.data._id,
            solution: ans.answer.toString().trim(),
            questionId: quesState.currentQuestion.ques._id
        }));
        console.log(response);
        if(response) navigate('/');
    }

    useEffect(() => {
        if(!authState.isLoggedIn) navigate('/login');
    }, []);

    return(
        <section className="h-full flex flex-col items-center pt-6 justify-center">
            <div className="w-[90vw] h-full bg-gray-800 rounded-lg shadow dark:border md:mt-0 xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-3xl uppercase font-bold">Create your answer</h1>
                    <p className="my-2 bg-gray-600 py-3 px-2">
                        {quesState?.questionList[0]?.question}
                    </p>
                    <h3 className="mt-10">Add answer here</h3>
                    <textarea onChange={handleChange} name="answer" value={ans.answer} className="textarea textarea-bordered w-full resize-none" rows={10}></textarea>
                    <button onClick={onSubmit} className="btn btn-primary bg-gray-300 hover:bg-gray-400 hover:border-transparent border-transparent w-full font-bold text-black">CREATE</button>
                </div>
            </div>
        </section>
    )
}

export default Answer;