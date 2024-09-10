import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    commentList: [],
    commentForQuestion: [[]],
    commentforAnswers: [[]]
}

export const createComment = createAsyncThunk('createComment', async (comment) => {
    try {
        const response = axiosInstance.post(`comment/create`, comment, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(!response) toast.error('Something went wrong');
        else toast.success('Added your comment');
        return await response;
    } catch (error) {
        console.log(error);
    }
});

export const getComments = createAsyncThunk('getComments', async () => {
    try {
        const response = axiosInstance.get('comment');
        if(!response) toast.error('Something went wrong');
        return await response;
    } catch (error) {
        console.log(error);
    }
})

export const deleteComment = createAsyncThunk('deleteComment', async (id) => {
    try {
        const response = axiosInstance.delete(`comment/delete/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(!response) toast.error('Something went wrong');
        return await response;
    } catch (error) {
        console.log(error);
    }
})

const commentSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {}, 
    extraReducers: (builder) => {
        builder
        .addCase(getComments.fulfilled, (state, action) => {
            state.commentList = action.payload?.data?.data;
        })
        
    }
});

export default commentSlice.reducer;