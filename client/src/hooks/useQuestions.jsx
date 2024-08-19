import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterQuestionById, filterQuestionByTopic, filterQuestionByUser, filterQuestionByUserandTopic, getAllQuestions, resetQuestionList } from "../redux/Slices/ques.slice";
import { useSearchParams } from "react-router-dom";


function useQuestions () {

    const authState = useSelector((state) => state.auth);
    const quesState = useSelector((state) => state.ques);
    const [searchParams] = useSearchParams();

    const dispatch = useDispatch();

    async function loadQuestions(){
        if(quesState.downloadedQuestions.length === 0) await dispatch(getAllQuestions());
        if(searchParams.get('userid') && searchParams.get('topic')) dispatch(filterQuestionByUserandTopic({id: searchParams.get('userid'), topic: searchParams.get('topic')}))
        else if(searchParams.get('userid')) dispatch(filterQuestionByUser({id: searchParams.get('userid')}));
        else if(searchParams.get('question')) dispatch(filterQuestionById({id: searchParams.get('question')}));
        else if(searchParams.get('topic')) dispatch(filterQuestionByTopic({topic: searchParams.get('topic')}));
        else dispatch(resetQuestionList());
    }

    useEffect(() => {
        loadQuestions();
    }, [authState.token, searchParams.get('userid'), searchParams.get('question'), searchParams.get('topic')]);
    
    return [quesState];
}

export default useQuestions;