import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as API from '../../api';

const MESSAGES_SLICE_NAME = 'messages';

export const getMessagesThunk = createAsyncThunk(
  `${MESSAGES_SLICE_NAME}/get`,
  async (payload, thunkAPI) => {
    try {
      const response = await API.getMessages(payload);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: err.message });
    }
  }
);

const initialState = {
  messages: [],
  isFetching: false,
  error: null,
  limit: 100,
};

const messagesSlice = createSlice({
  name: MESSAGES_SLICE_NAME,
  initialState,
  reducers: {
    newMessagePending (state) {
      state.isFetching = true;
      state.error = null;
    },
    newMessageSuccess (state, { payload }) {
      state.isFetching = false;
      if (state.messages.length >= state.limit) {
        state.messages.splice(0, 1);
      }
      state.messages.push(payload);
    },
    newMessageError (state, { payload }) {
      state.isFetching = false;
      state.error = payload;
    },
    deleteMessageSuccess (state, { payload: { id } }) {
      state.messages = state.messages.filter(message => message._id !== id);
    },
  },
  extraReducers: builder => {
    builder.addCase(getMessagesThunk.pending, state => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(getMessagesThunk.fulfilled, (state, { payload }) => {
      state.messages = [];
      state.isFetching = false;
      state.messages.push(...payload.reverse());
    });
    builder.addCase(getMessagesThunk.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = payload;
    });
  },
});

export const {
  newMessagePending,
  newMessageSuccess,
  newMessageError,
  deleteMessageSuccess,
} = messagesSlice.actions;
export default messagesSlice.reducer;
