import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
	name: 'User',
	initialState: null,
	reducers: {
		setUser: (state, action) => {
			if (action.payload === null) {
				localStorage.removeItem('token');
			} else {
				if (action.payload.token) {
					localStorage.setItem('token', action.payload.token);
				}
			}
			return action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
