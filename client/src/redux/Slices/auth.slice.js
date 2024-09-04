import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    data: JSON.parse(localStorage.getItem("data")) || undefined,
    token: localStorage.getItem("token") || "",
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    selectedUser:{
        email: "",
        image: "",
        name: "",
        registered: [],
        profession: "",
        likedQuestion: [],
        likedSolution: []
    },
    userList: []
};

export const login = createAsyncThunk('/auth/login', async (data) => {    
    try {
        const response = axiosInstance.post("auth/signin", data);
        if(!response) toast.error('Something went wrong, try again');
        return await response;
    } catch (error) {
        console.log(error);
    }
});

export const signup = createAsyncThunk('/auth/signup', async (data) => {     
    try {
        const response = axiosInstance.post("auth/signup", data);
        if(!response) toast.error('Something went wrong, try again');
        return await response;
    } catch (error) {
        console.log(error);
    }
});

export const getUser = createAsyncThunk('auth/getUser', async (id) => {     
    try {
        const response = axiosInstance.get(`users/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(!response) toast.error('Could not fetch the user');
        return await response;
    } catch (error) {
        console.log(error);
    }
});

export const followUser = createAsyncThunk('auth/followUser', async(data) => {
    try {
        const response = axiosInstance.post(`users/follow`, data, {
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

export const unFollowUser = createAsyncThunk('auth/unFollowUser', async(data) => {
    try {
        const response = axiosInstance.patch(`users/unFollow`, data, {
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

export const getUsers = createAsyncThunk('users/getUsers', async () => {     
    try {
        const response = axiosInstance.get(`users`, {
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

export const updateUser = createAsyncThunk('user/updateUser', async(data) => {
    try {
        const response = axiosInstance.patch('users/updateUser', data, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(!response) toast.error('Something went wrong, try again');
        return await response;
    } catch (error) {
        console.log(error);
    }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async(id) => {
    try {
        const response = axiosInstance.delete(`users/deleteUser/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(!response) toast.error('Something went wrong, try again');
        return await response;
    } catch (error) {
        console.log(error);
    }
})

export const getLikedQuestions = createAsyncThunk('user/quesLiked', async(id) => {
    try {
        const response = axiosInstance.get(`likedQuestions/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(!response) toast.error('Something went wrong');
        return await response;
    } catch (error) {
        console.log(error);
    }
})

export const getLikedSolutions = createAsyncThunk('user/solLiked', async(id) => {
    try {
        const response = axiosInstance.get(`likedSolutions/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(!response) toast.error('Something went wrong');
        return await response;
    } catch (error) {
        console.log(error);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.clear();
            state.data = "";
            state.isLoggedIn = false;
            state.token = "";
        }
    }, 
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            if(!action.payload) return;
            state.isLoggedIn = (action.payload.data?.token != undefined);
            state.data = action.payload.data?.userData;
            state.token = action.payload.data?.token;
            localStorage.setItem("token", action.payload.data?.token);
            localStorage.setItem("data", JSON.stringify(action.payload.data?.userData));
            localStorage.setItem("isLoggedIn", (action.payload.data?.token != undefined));
        })
        .addCase(getUser.fulfilled, (state, action) => {
            if(!action?.payload?.data) return;
            state.selectedUser.name = action.payload.data.name;
            state.selectedUser.email = action.payload.data.email;
            state.selectedUser.registered = action.payload.data.createdAt.split('T')[0].split('-');
            state.selectedUser.image = action.payload.data.image;
            state.selectedUser.profession = action.payload.data.profession;
        })
        .addCase(getUsers.fulfilled, (state, action) => {
            if(!action?.payload?.data) return;
            state.userList = action?.payload?.data?.users.reverse();
        })
        .addCase(getLikedQuestions.fulfilled, (state, action) => {
            if(!action.payload) return;
            state.selectedUser.likedQuestion = action.payload?.data?.likedQuestion;
        })
        .addCase(getLikedSolutions.fulfilled, (state, action) => {
            if(!action.payload) return;
            state.selectedUser.likedSolution = action.payload?.data?.likedSolution;
        })
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;