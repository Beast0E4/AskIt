import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterQuestionById, filterQuestionByTopic, filterQuestionByUser, filterQuestionByUserandTopic, filterQuestionForExplore, getAllQuestions, resetQuestionList } from "../redux/Slices/ques.slice";
import { useSearchParams } from "react-router-dom";


function useQuestions () {

    const authState = useSelector((state) => state.auth);
    const quesState = useSelector((state) => state.ques);
    const [searchParams] = useSearchParams();

    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);

    async function loadQuestions(){
        if(quesState.downloadedQuestions.length === 0) await dispatch(getAllQuestions());
        if(location.pathname === '/explore'){
            const newUsers = [];
            authState.data?.following?.forEach(id => newUsers.push(id));
            newUsers.push(authState.data?._id);
            setUsers(users => [...users, ...newUsers]);
        }
        if(searchParams.get('userid') && searchParams.get('topic')) dispatch(filterQuestionByUserandTopic({id: searchParams.get('userid'), topic: searchParams.get('topic')}))
        else if(searchParams.get('userid')) dispatch(filterQuestionByUser({id: searchParams.get('userid')}));
        else if(searchParams.get('question')) dispatch(filterQuestionById({id: searchParams.get('question')}));
        else if(searchParams.get('topic')) dispatch(filterQuestionByTopic({topic: searchParams.get('topic')}));
        else await dispatch(resetQuestionList());
    }

    async function filterForYou() {
        await dispatch(filterQuestionForExplore(users));
    }

    useEffect(() => {
        if(users.length > 0) filterForYou();
    }, [users])

    useEffect(() => {
        loadQuestions();
    }, [authState.token, searchParams.get('userid'), searchParams.get('question'), searchParams.get('topic')]);
    
    return [quesState];
}

export default useQuestions;