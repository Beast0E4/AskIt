import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterQuestionById, filterQuestionByTopic, filterQuestionByUser, filterQuestionByUserandTopic, filterQuestionForExplore, getAllQuestions, resetQuestionList, sortQuestionForTrending } from "../redux/Slices/ques.slice";
import { useSearchParams } from "react-router-dom";

function useQuestions () {
    const authState = useSelector((state) => state.auth);
    const quesState = useSelector((state) => state.ques);
    const [searchParams] = useSearchParams();

    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);

    async function loadQuestions() {
        if(!quesState.downloadedQuestions.length) await dispatch(getAllQuestions());

        // if(location.pathname === '/') re

        if (location.pathname === '/explore') {
            const newUsers = [];
            authState.data?.following?.forEach(id => newUsers.push(id));
            setUsers(users => [...users, ...newUsers]);
        }

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
        } else {
            dispatch(resetQuestionList());
        }
    }

    async function filterForYou() {
        if (users.length > 0) {
            await dispatch(filterQuestionForExplore(users));
        }
    }

    useEffect(() => {
        filterForYou();
    }, [users]);

    useEffect(() => {
        loadQuestions();
    }, [authState.token, searchParams.get('userid'), searchParams.get('topic'), searchParams.get('question'), location.pathname]);

    return [quesState];
}

export default useQuestions;
