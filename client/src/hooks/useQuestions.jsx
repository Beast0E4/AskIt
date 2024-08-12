import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterQuestionById, filterQuestionByUser, getAllQuestions, resetQuestionList } from "../redux/Slices/ques.slice";
import { useSearchParams } from "react-router-dom";


function useQuestions () {

    const authState = useSelector((state) => state.auth);
    const quesState = useSelector((state) => state.ques);
    const [searchParams] = useSearchParams();

    const dispatch = useDispatch();

    async function loadQuestions(){
        if(quesState.downloadedQuestions.length === 0) await dispatch(getAllQuestions());
        if(searchParams.get('id')) dispatch(filterQuestionById({id: searchParams.get('id')}));
        else if(searchParams.get('userid')) dispatch(filterQuestionByUser({id: searchParams.get('userid')}));
        else dispatch(resetQuestionList());
    }

    useEffect(() => {
        loadQuestions();
    }, [authState.token, searchParams.get("id"), searchParams.get('userid')]);
    return [quesState];
}

export default useQuestions;