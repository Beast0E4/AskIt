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
        let n = quesState.downloadedQuestions?.length;
        for(let i = 0; i < n; i ++){
            const ans = await dispatch(getSolutionByQuestion(quesState.downloadedQuestions[i]._id));
            array[i] = ans?.payload?.data?.data;
        }
        await dispatch(getAllSolutions(array));
    }

    useEffect(() => {
        loadSolutions();
    }, [quesState.downloadedQuestions?.length, location.pathname, searchParams.get('userid'), searchParams.get('question')])

    return [ansState];
}

export default useAnswers;