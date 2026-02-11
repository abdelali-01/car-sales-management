import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    error : null 
}

const errorSlice = createSlice({
    name : 'error' ,
    initialState ,
    reducers : {
        setError : (state , action) => {
            state.error = action.payload ;
        },
        removeError : (state) => {
            state.error = null ;
        }
    }
});


export const {setError , removeError} = errorSlice.actions ;
export default errorSlice.reducer ;