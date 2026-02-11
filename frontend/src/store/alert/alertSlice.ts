import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    successAlert : null 
}

const alertSlice = createSlice({
    name : 'alert' ,
    initialState ,
    reducers : {
        setSuccessAlert : (state , action)=>{
            state.successAlert = action.payload
        }
    }
});

export const {setSuccessAlert} = alertSlice.actions ;
export default alertSlice.reducer ;