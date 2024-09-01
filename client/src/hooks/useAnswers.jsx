import { useDispatch, useSelector } from "react-redux";
import useQuestions from "./useQuestions";
import { getAllSolutions, getSolutionByQuestion } from "../redux/Slices/ans.slice";
import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

function useAnswers() {

    const ansState = useSelector((state) => state.ans);
    const [quesState] = useQuestions();

    const dispatch = useDispatch();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    async function loadSolutions(){
        let array = [];
        let n = quesState.questionList?.length;
        for(let i = 0; i < n; i ++){
            const ans = await dispatch(getSolutionByQuestion(quesState.questionList[i]._id));
            array[i] = ans?.payload?.data?.data;
        }
        await dispatch(getAllSolutions(array));
    }

    useEffect(() => {
        loadSolutions();
    }, [quesState.questionList?.length, location.pathname, searchParams.toString()])

    return [ansState];
}

export default useAnswers;