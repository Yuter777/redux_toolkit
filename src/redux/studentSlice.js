import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async () => {
    const response = await axios.get("http://localhost:3000/students");
    return response.data;
  }
);

export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (newStudent) => {
    const response = await axios.post(
      "http://localhost:3000/students",
      newStudent
    );
    return response.data;
  }
);

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async (updatedStudent) => {
    const { id, ...data } = updatedStudent;
    const response = await axios.put(
      `http://localhost:3000/students/${id}`,
      data
    );
    return response.data;
  }
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id) => {
    await axios.delete(`http://localhost:3000/students/${id}`);
    return id;
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    filteredStudents: [],
    status: "idle",
    error: null,
  },
  reducers: {
    filterStudents: (state, action) => {
      const { searchText, group } = action.payload;
      let filtered = state.students;

      if (searchText) {
        filtered = filtered.filter(
          (student) =>
            student.firstName
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      if (group) {
        filtered = filtered.filter((student) => student.group === group);
      }
      state.filteredStudents = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students = action.payload;
        state.filteredStudents = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
        state.filteredStudents.push(action.payload);
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(
          (student) => student.id === action.payload.id
        );
        state.students[index] = action.payload;
        state.filteredStudents[index] = action.payload;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(
          (student) => student.id !== action.payload
        );
        state.filteredStudents = state.filteredStudents.filter(
          (student) => student.id !== action.payload
        );
      });
  },
});

export const { filterStudents } = studentSlice.actions;

export default studentSlice.reducer;
