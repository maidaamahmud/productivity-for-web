import PageLayout from "../components/PageLayout";
import axios, { AxiosResponse } from "axios";
import { GetStaticProps } from "next";
import { IProject } from "../type";

export const getStaticProps: GetStaticProps = async () => {
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects");

  return {
    props: {
      projects: results.data.projects,
    },
  };
};

interface Props {
  projects: IProject;
}
export default function Projects({ projects }: Props) {
  {
    projects ? console.log("empty") : console.log("smth inhere");
  }
  return <PageLayout> Projects </PageLayout>;
}
