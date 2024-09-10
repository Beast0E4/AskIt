import { useDispatch, useSelector } from "react-redux";
import { getComments } from "../redux/Slices/comment.slice";
import { useEffect } from "react";

function useComments() {
    const commentState = useSelector((state) => state.comment);

    const dispatch = useDispatch();

    async function loadComments() {
        if(commentState.commentList.length === 0) dispatch(getComments());
    }

    useEffect(() => {
        loadComments();
    }, [])

    return [commentState];
}

export default useComments;