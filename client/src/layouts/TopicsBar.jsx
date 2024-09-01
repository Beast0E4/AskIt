import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function TopicsBar() {

    const navigate = useNavigate();

    const authState = useSelector((state) => state.auth);

    const [topic, setTopic] = useState();
    const location = useLocation();
    const topics = ["All", "Miscellaneous", "Technology", "Science and Mathematics", "Health and Medicine", "Education and Learning", "Business and Finance", "Arts and Culture", "History and Geography", "Entertainment and Media", "Current Affairs and Politics", "Philosophy and Ethics", "Lifestyle", "Psychology", "Legal and Regulatory", "Sports"];

    useEffect(() => {
        if(topic === 'All'){
            if(location.pathname === '/questions') navigate(`${location.pathname}?userid=${authState.data?._id}`);
            else navigate(`${location.pathname}`);
        } 
        else if(topic) {
            if(location.pathname === '/questions') navigate(`${location.pathname}?userid=${authState.data?._id}&topic=${topic}`);
            else navigate(`${location.pathname}?topic=${topic}`);
        }
    }, [topic, location.pathname])

    return (
        <div className="hidden lg:flex flex-col pl-2 items-start w-max mt-2 fixed left-5">
            {topics.map((item) =>
            <button key={item} onClick={() => {
                setTopic(item);
            }} className="flex justify-start w-full my-[0.3rem] text-xs rounded-sm bg-gray-900 p-2 hover:bg-gray-800 hover:cursor-pointer hover:text-[#F2BEA0]">{item}</button>)}
            <div className="mt-3 w-full h-[1px] bg-gray-600"></div>
            <h4 className="w-full flex justify-center text-xs mt-3 text-gray-500">Copyright 2024 © <span className="font-semibold text-gray-400">AskIt</span></h4>
        </div>
    )
}

export default TopicsBar;