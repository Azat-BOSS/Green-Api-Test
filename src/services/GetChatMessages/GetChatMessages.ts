import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../../utils/constants";
import { getCookie } from "../../utils/cookies/cookie";
import { TInitialState, TGetMsgThunk } from "./types";

const idInst: string = getCookie("idInstance")!;
const apiToken: string = getCookie("apiToken")!;

const initialState: TInitialState = {
  dataMessages: [],
  crnMessages: [],
  success: null
}

export const GetChatMessages = createAsyncThunk(
  "message/thunk",
  async({count, chatId}: TGetMsgThunk) => {
    try {
      const response = await fetch(`${API.handler}${idInst}/getChatHistory/${apiToken}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          "chatId": chatId?.toString(),
          "count": count
        }),
      })
      const data = await response.json()
      return data
    } catch (error) {
      if(error instanceof Error) throw new Error(error.message)
    }
  }
)

const GetMsgSlice = createSlice({
  name: "message/slice",
  initialState: initialState,
  reducers: {
    sendMsg(state, action) {
      state.dataMessages = [...state.dataMessages, action.payload]
    },
    changeStatusLoader(state, action) {
      state.success = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetChatMessages.pending, (state) => {
        state.success = false
      })
      .addCase(GetChatMessages.fulfilled, (state, action) => {
        state.success = true
        let reversedArr = [...action.payload]
        state.dataMessages = reversedArr.reverse()
      })
      .addCase(GetChatMessages.rejected, (state) => {
        state.success = false
      })
  } 
})

export const { sendMsg, changeStatusLoader } = GetMsgSlice.actions
export default GetMsgSlice.reducer
