import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterQuestionById, filterQuestionByTopic, filterQuestionByUser, filterQuestionByUserandTopic,  getAllQuestions, resetQuestionList, sortQuestionForTrending } from "../redux/Slices/ques.slice";
import { useSearchParams } from "react-router-dom";

function useQuestions () {
    const authState = useSelector((state) => state.auth);
    const quesState = useSelector((state) => state.ques);
    const [searchParams] = useSearchParams();

    const dispatch = useDispatch();

    async function loadQuestions() {
        if(!quesState.downloadedQuestions.length) dispatch(getAllQuestions());

        if (location.pathname === '/trending') {
            dispatch(sortQuestionForTrending());
            if (searchParams.get('topic')) {
                dispatch(filterQuestionByTopic({ topic: searchParams.get('topic') }));
            }
            return;
        }
        if (searchParams.get('userid') && searchParams.get('topic')) {
            dispatch(filterQuestionByUserandTopic({ id: searchParams.get('userid'), topic: searchParams.get('topic') }));
        } else if (searchParams.get('userid')) {
            dispatch(filterQuestionByUser({ id: searchParams.get('userid') }));
        } else if (searchParams.get('question')) {
            dispatch(filterQuestionById({ id: searchParams.get('question') }));
        } else if (searchParams.get('topic')) {
            dispatch(filterQuestionByTopic({ topic: searchParams.get('topic') }));
        } else if(location.pathname === '/' && !searchParams.get('topic')) {
            dispatch(resetQuestionList());
        }
    }

    useEffect(() => {
        loadQuestions();
    }, [authState.token, searchParams.get('userid'), searchParams.get('topic'), searchParams.get('question'), location.pathname]);

    return [quesState];
}

export default useQuestions;
