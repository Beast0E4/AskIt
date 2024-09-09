import { Route, Routes } from "react-router-dom";
import SignIn from "../pages/auth/signin";
import SignUp from "../pages/auth/signup";
import Home from "../pages/Home";
import Question from "../pages/createQuestion/Question";
import Profile from "../pages/profile/Profile";
import Answer from "../pages/createAnswer/Answer";
import AnswerPage from "../pages/answers/AnswerPage";
import Following from "../pages/Following/Following";
import Explore from "../pages/explore/Explore";
import Navbar from '../layouts/NavBar'
import LikedQuestions from "../pages/likedQuestions/LikedQuestions";

function MainRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<SignIn/>} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/create-question" element={<Question/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/create-answer" element={<Answer/>}/>
            <Route path="/" element={<><Navbar/><Home/></>} />
            <Route path="/trending" element={<><Navbar/><Home/></>} />
            <Route path="/questions" element={<><Navbar/><Home/></>} />
            <Route path="/answers" element={<><Navbar/><Home/></>} />
            <Route path="/answer" element={<><Navbar/><AnswerPage/></>}/>
            <Route path="/following" element={<><Navbar/><Following/></>} />
            <Route path="/followers" element={<><Navbar/><Following/></>} />
            <Route path="/liked" element={<><Navbar/><LikedQuestions/></>}/>
            <Route path="/explore" element={<><Navbar/><Explore/></>} />
        </Routes>
    )
}

export default MainRoutes;