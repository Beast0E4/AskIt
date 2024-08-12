import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    downloadedQuestions: [],
    questionList: [],
    currentQuestion: {
        ques: ""
    }
};

export const likeQuestion = createAsyncThunk('question/likeQuestion', async(question) => {
    try {
        const response = axiosInstance.post('like', question, {
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

export const unLikeQuestion = createAsyncThunk('question/unLikeQuestion', async(questionId, id) => {
    try {
        const response = axiosInstance.post('unLike', {
            quesId : questionId,
            userId: id
        }, {
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

export const getAllQuestions = createAsyncThunk('questions/getAllQuestions', async () => {
    try {
        const response = axiosInstance.get('question', {
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

export const currQues = createAsyncThunk('currQues', async (data) => {
    try {
        const response = axiosInstance.get(`question/${data}`, {
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

export const deleteQues = createAsyncThunk('/ques/delete', async(id) => {
    try {
        const response = axiosInstance.delete(`question/deleteQuestion/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        toast.promise(response, {
            loading: 'Deleting the question',
            success: 'Successfully deleted the question',
            error: 'Something went wrong, try again'
        });
        return await response;
    } catch (error) {
        console.log(error);
    }
})

export const createQuestion = createAsyncThunk('question/createQuestion', async (question) => {
    try {
        const response = axiosInstance.post(`question`, question, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        toast.promise(response, {
            success: 'Successfully created the Question',
            loading: 'Creating the Question...',
            error: 'Something went wrong'
        });
        return await response;
    } catch (error) {
        console.log(error);
    }
});

const QuestionSlice = createSlice({
    name: 'Questions',
    initialState,
    reducers: {
        filterQuestionById: (state, action) => {
            console.log(action);
            const id = action?.payload?.id;
            state.questionList = state.downloadedQuestions.filter((ques) => ques._id == id);
        },
        filterQuestionByUser: (state, action) => {
            const id = action?.payload?.id;
            state.questionList = state.downloadedQuestions.filter((ques) => ques.userId == id);
        },
        resetQuestionList: (state) => {
            state.questionList = state.downloadedQuestions;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllQuestions.fulfilled, (state, action) => {
            if(!action?.payload?.data) return;
            state.questionList = action?.payload?.data?.question.reverse();
            state.downloadedQuestions = action?.payload?.data?.question;
        })
        .addCase(currQues.fulfilled, (state, action) => {
            if(!action?.payload?.data) return;
            state.currentQuestion.ques = action.payload.data.question;
        })
        .addCase(createQuestion.fulfilled, (state, action) => {
            if(action?.payload?.data === undefined) return;
            const question = action.payload.data.question;
            state.downloadedQuestions.push(question); 
            state.questionList = state.downloadedQuestions;
        })
    }
});

export const { filterQuestionById, resetQuestionList, filterQuestionByUser } = QuestionSlice.actions;

export default QuestionSlice.reducer;