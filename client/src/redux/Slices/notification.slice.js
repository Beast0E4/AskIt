import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const initialState = {
    notificationList: [],
    readCount: localStorage.getItem("readNotifications") || 0
}

export const getNotifications = createAsyncThunk('getNotifications', async (userId) => {
    try {
        const response = axiosInstance.get (`notification/getNotifications/${userId}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(!response) toast.error('Something went wrong');
        return await response;
    } catch (error) {
        console.log(error);
    }
});


const notificationSlice = createSlice ({
    name: 'notification',
    initialState,
    reducers: {
        readNotifications: (state) => {
            state.readCount = 0;
            localStorage.setItem("readNotifications", 0);
        },
        insertNotification: (state, action) => {
            const authState = useSelector ((state) => state.auth);
            console.log (action.payload);
            if (authState.data?._id !== action.payload.sender) state.notificationList = [action.payload, ...state.notificationList];
        }
    }, 
    extraReducers: (builder) => {
        builder
        .addCase(getNotifications.fulfilled, (state, action) => {
            state.notificationList = action.payload?.data?.data;
        })
    }
});

export const { readNotifications, insertNotification } = notificationSlice.actions;

export default notificationSlice.reducer;