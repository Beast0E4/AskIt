import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Answer from "../../layouts/Answer";

function AnswerPage() {

    const quesState = useSelector((state) => state.ques);
    const authState = useSelector((state) => state.auth);
    const ansState = useSelector((state) => state.ans);

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [idx, setIdx] = useState();

    function loadUser() {
        const user = authState.userList.find((user) => user._id === quesState.currentQuestion.ques.userId)
        const index = quesState.questionList.findIndex((question) => question._id === quesState.currentQuestion.ques._id);
        setIdx(index);
        const dt = quesState?.currentQuestion?.ques?.createdAt?.split('T')[0].split('-')
        setDate(dt[2] + "-" + dt[1] + "-" + dt[0]);

        setName(user.name);
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <div className="w-full p-4">
            <article className="mb-4 break-inside p-6 bg-gray-800 border-2 flex flex-col bg-clip-border">
                <div className="flex pb-6 items-center justify-between">
                <div className="flex">
                    {/* <a className="inline-block mr-4" href="#">
                    <img className="rounded-full max-w-none w-14 h-14" src="https://randomuser.me/api/portraits/men/33.jpg" />
                    </a> */}
                    <div className="flex flex-col">
                    <div className="flex items-center">
                        <a className="inline-block text-lg font-bold mr-2 text-md" href="#">{name}</a>
                    </div>
                    <div className="text-slate-500 text-sm dark:text-slate-300">
                        {date}
                    </div>
                    </div>
                </div>
                </div>
                <hr className="bg-white"/>
                {/* <div className="py-4">
                <div className="flex justify-between gap-1 mb-1">
                    <a className="flex" href="#">
                    <img className="max-w-full rounded-l-lg"
                        src="https://images.pexels.com/photos/2128028/pexels-photo-2128028.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
                    </a>
                    <a className="flex" href="#">
                    <img className="max-w-full rounded-r-lg"
                        src="https://images.pexels.com/photos/6145852/pexels-photo-6145852.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
                    </a>
                </div>
                </div> */}
                {/* <h2 className="text-3xl font-extrabold">
                Web Design templates Selection
                </h2> */}
                <div className="py-4">
                <p>
                    {quesState.currentQuestion.ques.question}
                </p>
                </div>
            </article>
            <div className="flex flex-col items-end">
                {!ansState.solutionList[idx]?.length ? (
                    <h2 className="text-white font-thin italic">No answers yet</h2>
                ):ansState.solutionList[idx]?.map((sol) => {
                    let date = sol?.createdAt?.split('T')[0].split('-');
                    date = date[2] + "-" + date[1] + "-" + date[0];
                    return (<Answer key={sol._id} solId={sol._id} creator={sol.userId} solution={sol.solution} createdAt={date}/>)
                })}
            </div>
        </div>
    )
}

export default AnswerPage;