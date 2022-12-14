import axios from "axios";
import { GetStaticProps } from "next";
import PageLayout from "../../components/PageLayout";
import { IProject } from "../../type";

interface Props {
  project: IProject; // comes from getServerSideProps (at bottom of page)
}

export default function ViewProject({ project }: Props) {
  return <PageLayout> View me </PageLayout>;
}

export const getServerSideProps: GetStaticProps = async (context) => {
  const { params } = context;
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects/" + params!.id); //FIXME: move to api?
  return {
    props: {
      project: results.data.project,
    },
  };
};
