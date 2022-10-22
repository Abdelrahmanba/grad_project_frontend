import { createSlice } from "@reduxjs/toolkit"

const initState = {
  user: {},
  token: "",
}

const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {
    signIn: (state, action) => (state = action.payload),
    signOut: (state) => (state = initState),
    setUser: (state, action) => void (state.user = action.payload),
  },
})

export default userSlice.reducer
export const { signIn, signOut, setUser } = userSlice.actions
