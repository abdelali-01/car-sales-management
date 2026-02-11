import { User } from "@/components/auth/SignUpForm";
import { createSlice } from "@reduxjs/toolkit";

const initialState : {
    accounts : User[] | null;
} = {
    accounts : null
}

const accountsSlice = createSlice({
    name : 'accounts' ,
    initialState ,
    reducers : {
        setAccounts : (state , action)=> {
            state.accounts = action.payload 
        }
    }
});

export const {setAccounts} = accountsSlice.actions ;
export default accountsSlice.reducer ;