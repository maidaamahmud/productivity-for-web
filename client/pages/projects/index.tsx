import PageLayout from "../../components/PageLayout";
import axios, { AxiosResponse } from "axios";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { IProject, ITask } from "../../type";
import { useState } from "react";
import NewProjectModal from "../../components/NewProjectModal";
import { Button, message, Card, List, Space, Progress } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { addProject, updateProject, deleteProject } from "../api";

interface Props {
  projects: IProject[]; // comes from getServerSideProps (at bottom of page)
}

export default function Projects({ projects }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const router = useRouter();

  const refreshData = () => {
    // refetches data (projects)
    router.replace(router.asPath);
  };

  const onCancelModal = () => {
    // when modal is closed
    setOpenModal(false);
  };

  const onCreateProject = async (values: Omit<IProject, "_id">) => {
    // loading message appears whilst project is being created, once complete user recieves a response message
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await addProject(values);
      message.success(
        `${res.data.project?.name} has successfully been created!`,
        2
      );
      refreshData(); // data refetched once new project added to database
    } catch (error: any) {
      message.error("There seems to have been an issue, please try again.", 2);
    } finally {
      hideMessage();
    }
    setOpenModal(false);
  };

  const onDeleteProject = async (id: String) => {
    // loading message appears whilst project is being deleted , once complete user recieves a response message
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await deleteProject(id);
      message.success(`${res.data.project?.name} has been deleted!`, 2);
      refreshData(); // data refetched once project has been deleted
    } catch (error: any) {
      message.error(
        "We were unable to delete this project, please try again.",
        2
      );
    } finally {
      hideMessage();
    }
  };

  const findProjectProgress = (projectTasks?: ITask[]): number => {
    let progressPercentage = 0;
    if (projectTasks) {
      let totalRank = 0;
      let userRank = 0;
      projectTasks.forEach((task) => {
        task.status ? (userRank += task.ranking) : null;
        totalRank += task.ranking;
        progressPercentage = Math.round((userRank / totalRank) * 100);
      });
    }
    return progressPercentage;
  };

  return (
    <PageLayout>
      <div>
        <Button
          size="large"
          type="default"
          onClick={() => {
            setOpenModal(true); // this opens the ProjectModal component
          }}
          style={{
            marginBottom: "35px",
            backgroundColor: "#108ee9",
            color: "white",
            border: "none",
          }}
        >
          New Project
        </Button>
        {/* grid attribute in List component determines how many boxes (Card components) should appear in a row depending on the screen size*/}
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
              <Card
                title={project.name}
                actions={[
                  <Space
                    key="view"
                    onClick={() => {
                      router.push("/projects/" + project._id);
                    }}
                  >
                    <EyeOutlined />
                    View
                  </Space>,
                  <Space
                    key="delete"
                    onClick={() => {
                      onDeleteProject(project._id);
                    }}
                  >
                    <DeleteOutlined key="delete" />
                    Delete
                  </Space>,
                ]}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Progress
                    type="circle"
                    width={70}
                    strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                    strokeWidth={8}
                    percent={findProjectProgress(project.tasks)}
                  />
                </div>
              </Card>
            </List.Item>
          )}
        />
        <NewProjectModal
          open={openModal}
          onCreate={onCreateProject}
          handleCancel={onCancelModal}
        />
      </div>
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async () => {
  // fetches projects, and returns them within props under the name projects
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects"); //FIXME: move to api?
  return {
    props: {
      projects: results.data.projects,
    },
  };
};
