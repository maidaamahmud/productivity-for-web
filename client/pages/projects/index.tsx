import PageLayout from "../../components/general/PageLayout";
import axios from "axios";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { IProject, ITask } from "../../type";
import { useState } from "react";
import {
  Button,
  message,
  Card,
  List,
  Space,
  Progress,
  ConfigProvider,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { addProject, deleteProject } from "../api";
import { refreshData } from "../../utils/globalFunctions";
import FormModal from "../../components/general/FormModal";
import NewProjectModalContent from "../../components/NewProjectModalContent";

interface Props {
  projects: IProject[]; // comes from getServerSideProps (at bottom of page)
}

export default function Projects({ projects }: Props) {
  const router = useRouter();

  const [openNewProjectModal, setOpenNewProjectModal] =
    useState<boolean>(false);

  const onCreateProject = async (values: Omit<IProject, "_id">) => {
    // loading message appears whilst project is being created, once complete user recieves a response message
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await addProject(values);
      message.success(
        `${res.data.project?.name} has successfully been created!`,
        2
      );
      refreshData(router);
    } catch (error: any) {
      message.error("There seems to have been an issue, please try again.", 2);
    } finally {
      hideMessage();
    }
    setOpenNewProjectModal(false);
  };

  const onDeleteProject = async (id: String) => {
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await deleteProject(id);
      message.success(`${res.data.project?.name} has been deleted!`, 2);
      refreshData(router);
    } catch (error: any) {
      message.error(
        "We were unable to delete this project, please try again.",
        2
      );
    } finally {
      hideMessage();
    }
  };

  const onCancelNewProjectModal = () => {
    setOpenNewProjectModal(false);
  };

  const findProjectProgress = (projectTasks?: ITask[]): number => {
    let progressPercentage = 0;
    if (projectTasks) {
      let totalRank = 0;
      let userRank = 0;
      projectTasks.forEach((task) => {
        task.status === "done" ? (userRank += task.ranking) : null;
        totalRank += task.ranking;
        progressPercentage = Math.round((userRank / totalRank) * 100);
      });
    }
    return progressPercentage;
  };

  const displayEmptyList = () => (
    <>
      <h2 style={{ textAlign: "center", fontSize: "15px", fontWeight: "500" }}>
        You have no projects at the moment <br /> Add new projects to start
        exploring all our features
      </h2>
    </>
  );

  return (
    <PageLayout>
      <div style={{ marginTop: "40px" }}>
        <Button
          size="large"
          type="default"
          onClick={() => {
            setOpenNewProjectModal(true);
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

        <ConfigProvider renderEmpty={displayEmptyList}>
          {/* grid attribute in List component determines how many boxes (Card components) should appear in a row 
          depending on the screen size*/}
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
                    <Popconfirm
                      icon={<></>}
                      key="delete"
                      title="Are you sure you would like to delete this project?"
                      onConfirm={() => {
                        onDeleteProject(project._id);
                      }}
                      onCancel={() => {}}
                      okText="Delete"
                      okType={"danger"}
                      cancelText="No"
                    >
                      <Space key="delete">
                        <DeleteOutlined key="delete" />
                        Delete
                      </Space>
                    </Popconfirm>,
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
        </ConfigProvider>

        <FormModal
          isOpen={openNewProjectModal}
          onCancel={onCancelNewProjectModal}
          onOk={onCreateProject}
          title={
            <Space style={{ fontSize: "17px", fontWeight: "500" }}>
              <Tooltip
                title={
                  <div>
                    Split your project into tasks and rank them from <b>1-8</b>{" "}
                    based on time and difficulty
                  </div>
                }
                color={"#108ee9"}
                key={"#108ee9"}
              >
                <InfoCircleOutlined style={{ color: "#108ee9" }} />
              </Tooltip>
              Time to plan out your project!
            </Space>
          }
          okButtonText={"Add"}
          modalWidth={800}
        >
          <NewProjectModalContent />
        </FormModal>
      </div>
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async () => {
  // fetches projects, and returns them within props under the name projects
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects");
  return {
    props: {
      projects: results.data.projects,
    },
  };
};
