import axios, { AxiosResponse } from "axios";
import { ApiDataType, IProject } from "../../type";

const BASE_URL: string = "http://127.0.0.1:4000";

export const addProject = async (
  formData: Omit<IProject, "_id">
): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.post(
    BASE_URL + "/add-project",
    formData
  );
  return res;
};

export const updateProject = async (
  id: String,
  formData: Omit<IProject, "_id">
): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.put(
    BASE_URL + "/update-project/" + id,
    formData
  );
  return res;
};

export const deleteProject = async (
  id: String
): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.delete(
    BASE_URL + "/delete-project/" + id
  );
  return res;
};

export const addTask = async (
  id: String,
  formData: { description: String; ranking: number }
): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.put(
    BASE_URL + "/projects/" + id + "/add-task",
    formData
  );
  return res;
};
