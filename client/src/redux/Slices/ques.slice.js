import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    downloadedQuestions: [],
    questionList: [],
    currentList: [],
    currentQuestion: {}
};

export const like = createAsyncThunk('like', async(data) => {
    try {
        const response = axiosInstance.post('like', data, {
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

export const unLike = createAsyncThunk('unlike', async(data) => {
    try {
        const response = axiosInstance.post('unLike', data, {
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
        if(!response) toast.error('Something went wrong');
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
        if(!response) toast.error('Something went wrong');
        return await response;
    } catch (error) {
        console.log(error);
    }
});

export const voteQuestion = createAsyncThunk('question/vote', async({quesId, req}) => {
    try {
        const response = axiosInstance.patch(`question/votes/${quesId}`, req, {
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

export const getQuestion = createAsyncThunk('questionById', async(id) => {
    try {
        const response = axiosInstance.get(`question/${id}`);
        if(!response) toast.error('Something went wrong');
        return await response;
    } catch (error) {
        console.log(error);
    }
})

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
            state.questionList = JSON.parse(JSON.stringify(state.currentList)).filter((ques) => ques.topic === topic);
            state.questionList = JSON.parse(JSON.stringify(state.questionList));
        },
        filterQuestionByUserandTopic: (state, action) => {
            const id = action?.payload?.id;
            const topic = action?.payload?.topic;
            state.questionList = state.currentList.filter((ques) => (ques.topic === topic && ques.userId === id));
        },
        filterQuestionForExplore: (state, action) => {
            state.currentList = state.downloadedQuestions.filter(question => 
                action.payload.includes(question.userId)
            );
            state.questionList = state.currentList;
        },
        sortQuestionForTrending: (state) => {
            const list = [...state.downloadedQuestions];
            if (list.length > 0) {
                list.sort((quesA, quesB) => {
                    return quesB.likes - quesA.likes;
                });
            }
            state.currentList = list;
            state.questionList = state.currentList;
        },
        filterQuestionForSaved: (state, action) => {
            state.currentList = state.downloadedQuestions?.filter(question => action.payload?.includes(question._id));
            state.questionList = JSON.parse(JSON.stringify(state.currentList));
        },
        resetQuestionList: (state) => {
            state.questionList = state.downloadedQuestions;
            state.currentList = state.questionList
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllQuestions.fulfilled, (state, action) => {
            if(!action?.payload?.data) return;
            state.downloadedQuestions = action?.payload?.data?.question.reverse();
            state.questionList = state.downloadedQuestions;
            state.currentList = state.downloadedQuestions;
        })
        .addCase(createQuestion.fulfilled, (state, action) => {
            if(action?.payload?.data === undefined) return;
            const question = action.payload.data.question;
            state.downloadedQuestions = [question, ...state.downloadedQuestions]
            state.questionList = state.downloadedQuestions;
        })
    }
});

export const { filterQuestionById, resetQuestionList, filterQuestionByUser, filterQuestionByTopic, filterQuestionByUserandTopic, filterQuestionForExplore, sortQuestionForTrending, filterQuestionForSaved } = QuestionSlice.actions;

export default QuestionSlice.reducer;