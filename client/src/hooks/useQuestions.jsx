import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterQuestionById, filterQuestionByTopic, filterQuestionByUser, filterQuestionByUserandTopic, filterQuestionForExplore, filterQuestionForSaved, getAllQuestions, resetQuestionList, sortQuestionForTrending } from "../redux/Slices/ques.slice";
import { useSearchParams } from "react-router-dom";

function useQuestions () {
    const authState = useSelector((state) => state.auth);
    const quesState = useSelector((state) => state.ques);
    const [searchParams] = useSearchParams();

    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);

    async function loadQuestions() {
        if(!quesState.downloadedQuestions.length) await dispatch(getAllQuestions());

        if (location.pathname === '/trending') {
            dispatch(sortQuestionForTrending());
            if (searchParams.get('topic')) {
                dispatch(filterQuestionByTopic({ topic: searchParams.get('topic') }));
            }
            return;
        }

        if(location.pathname === '/explore' && !searchParams.get('topic')){
            const newUsers = [];
            authState.data?.following?.forEach(id => newUsers.push(id));
            setUsers(users => [...users, ...newUsers]); return;
        }

        if(location.pathname === '/saved' && !searchParams.get('topic')){
            dispatch(filterQuestionForSaved(authState.data?.savedQuestions)); return;
        }

        if (searchParams.get('userid') && searchParams.get('topic')) {
            dispatch(filterQuestionByUserandTopic({ id: searchParams.get('userid'), topic: searchParams.get('topic') }));
        } else if (searchParams.get('userid')) {
            dispatch(filterQuestionByUser({ id: searchParams.get('userid') }));
        } else if (searchParams.get('question')) {
            dispatch(filterQuestionById({ id: searchParams.get('question') }));
        } else if (searchParams.get('topic')) {
            dispatch(filterQuestionByTopic({ topic: searchParams.get('topic') }));
        } else {
            dispatch(resetQuestionList());
        }
    }

    async function filterForYou() {
        await dispatch(filterQuestionForExplore(users));
    }

    useEffect(() => {
        if(users?.length > 0){
            filterForYou();
        }
    }, [users]);

    useEffect(() => {
        loadQuestions();
    }, [authState.token, searchParams.get('userid'), searchParams.get('topic'), searchParams.get('question'), location.pathname]);

    return [quesState];
}

export default useQuestions;
