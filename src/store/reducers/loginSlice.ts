import { createSlice,createAsyncThunk } from  '@reduxjs/toolkit';
import api from "../../../src/restApi/index";
const apiobj = new api();
//check user password and username

export const fetchUserById = createAsyncThunk<
	// Return type of the payload creator
	any,
	// First argument to the payload creator
	number,
	{}
>(
      'login/fetchUserById',
      async (id: number = 0, thunkApi) => {
     	var userInfoData: any={};
		 try {
			const response: any = await apiobj.request("users/"+id+"", {}, "get");
			userInfoData.info = response.data[0];
			userInfoData.login = true;
			return userInfoData;
		  }catch(error: any){
			console.log(error);
			userInfoData.info ={}
			userInfoData.login = false;
			return userInfoData;
		  }
		    
	  }
);


const loginSlice = createSlice({ 
          name: 'login',
		  initialState: { userinfo: {} , isLogin : false},
		  reducers: {
			setLogin: (state) => {
				state.isLogin = true;
			  },
			setLogout: (state) => {
				state.isLogin = false;
				state.userinfo = {};
			  },
		    // standard reducer logic, with auto-generated action types per reducer
		  },
		  extraReducers: (builder) => {
		    // Add reducers for additional action types here, and handle loading state as needed
		    builder.addCase(fetchUserById.fulfilled, (state, action) => {
		      // Add user to the state array
		      state.userinfo = action.payload.info;
			  state.isLogin = action.payload.login
		    })
		  },
	});

// Action creators are generated for each case reducer function
export const { setLogin, setLogout } = loginSlice.actions

export default loginSlice.reducer