import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    downloadedQuestions: [],
    questionList: [],
    currentQuestion: {}
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

export const unLikeQuestion = createAsyncThunk('question/unLikeQuestion', async(question) => {
    try {
        const response = axiosInstance.post('unLike', question, {
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
            success: 'Successfully created the question',
            loading: 'Creating the question...',
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
            const id = action?.payload?.id;
            state.currentQuestion = state.downloadedQuestions.filter((ques) => ques._id === id);
            state.currentQuestion = JSON.parse(JSON.stringify(state.currentQuestion));
        },
        filterQuestionByUser: (state, action) => {
            const id = action?.payload?.id;
            state.questionList = state.downloadedQuestions.filter((ques) => ques.userId === id);
            state.questionList = JSON.parse(JSON.stringify(state.questionList));
        },
        filterQuestionByTopic: (state, action) => {
            const topic = action?.payload?.topic;
            state.questionList = state.downloadedQuestions.filter((ques) => ques.topic === topic);
            console.log('SLice', state.questionList);
        },
        filterQuestionByUserandTopic: (state, action) => {
            const id = action?.payload?.id;
            const topic = action?.payload?.topic;
            state.questionList = state.downloadedQuestions.filter((ques) => ques.topic === topic && ques.userId === id);
            state.questionList = JSON.parse(JSON.stringify(state.questionList));
        },
        filterQuestionForExplore: (state, action) => {
            const list = state.downloadedQuestions.filter(question => 
                action.payload.includes(question.userId)
            );
            state.questionList = JSON.parse(JSON.stringify(list));
        },
        resetQuestionList: (state) => {
            state.questionList = state.downloadedQuestions;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllQuestions.fulfilled, (state, action) => {
            if(!action?.payload?.data) return;
            state.questionList = action?.payload?.data?.question;
            state.downloadedQuestions = action?.payload?.data?.question.reverse();
        })
        .addCase(createQuestion.fulfilled, (state, action) => {
            if(action?.payload?.data === undefined) return;
            const question = action.payload.data.question;
            state.downloadedQuestions = [question, ...state.downloadedQuestions]
            state.questionList = state.downloadedQuestions;
        })
    }
});

export const { filterQuestionById, resetQuestionList, filterQuestionByUser, filterQuestionByTopic, filterQuestionByUserandTopic, filterQuestionForExplore } = QuestionSlice.actions;

export default QuestionSlice.reducer;