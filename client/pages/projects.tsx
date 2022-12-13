import PageLayout from "../components/PageLayout";
import axios, { AxiosResponse } from "axios";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { IProject } from "../type";
import { useState } from "react";
import NewProjectModal from "../components/NewProjectModal";
import { Button, message, Card, List } from "antd";
import { addProject } from "./api";

interface Props {
  projects: IProject[];
}

export default function Projects({ projects }: Props) {
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const onCancelModal = (e: React.MouseEvent<HTMLElement>) => {
    setOpenModal(false);
  };

  const onCreateProject = async (values: Omit<IProject, "_id">) => {
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await addProject(values);
      message.success(
        `${res.data.project?.name} has successfully been created!`,
        3
      );
      refreshData();
    } catch (error: any) {
      message.error("There seems to have been an issue, please try again.", 3);
    } finally {
      hideMessage();
    }
    setOpenModal(false);
  };

  return (
    <PageLayout>
      <Button
        size="large"
        type="default"
        onClick={() => {
          setOpenModal(true);
        }}
        style={{ marginLeft: "25px", marginBottom: "20px" }}
      >
        Create Project
      </Button>
      <List
        grid={{
          gutter: 5,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 4,
        }}
        dataSource={projects}
        renderItem={(project) => (
          <List.Item>
            <Card title={project.name} actions={["Edit project"]}>
              Card content
            </Card>
          </List.Item>
        )}
      />
      <NewProjectModal
        open={openModal}
        onCreate={onCreateProject}
        handleCancel={onCancelModal}
      />
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async () => {
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects"); //FIXME: move to api?
  return {
    props: {
      projects: results.data.projects,
    },
  };
};
