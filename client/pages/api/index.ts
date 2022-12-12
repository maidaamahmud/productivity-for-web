import axios, { AxiosResponse } from "axios";
import { ApiDataType, IProject } from "../../type";

const BASE_URL: string = "http://127.0.0.1:4000";

export const addProject = async (
  formData: Omit<IProject, "_id">
): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const res: AxiosResponse<ApiDataType> = await axios.post(
      BASE_URL + "/project",
      formData
    );
    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};
