import { useDispatch, useSelector } from "react-redux";
import { getLikedQuestions, getLikedSolutions } from "../redux/Slices/auth.slice";
import { useEffect } from "react";

function useLikes() {

    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    async function getLiked(){
        if(authState.isLoggedIn){
            await dispatch(getLikedQuestions(authState.data?._id));
            await dispatch(getLikedSolutions(authState.data?._id));
        }
    }

    useEffect(() => {
        getLiked();
    }, [authState.data?._id]);

    return [authState];

}

export default useLikes;