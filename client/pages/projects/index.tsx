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
  Modal,
  Row,
  Col,
  Form,
  Input,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  InfoCircleFilled,
  EditFilled,
} from "@ant-design/icons";
import { addProject, deleteProject, updateProject } from "../api";
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
  const [openEditNameModal, setOpenEditNameModal] = useState<boolean>(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);

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

  const onEditProjectName = async (values: { name: string }) => {
    if (editProjectId) {
      const projectIndex = projects.findIndex(
        (project) => project._id === editProjectId
      );
      projects[projectIndex].name = values.name;
      try {
        await updateProject(editProjectId, projects[projectIndex]);
        refreshData(router);
      } catch (error: any) {
        message.error(
          "There seems to have been an issue, please try again.",
          2
        );
      }
    }
    setOpenEditNameModal(false);
  };

  const onCancelEditNameModal = () => {
    setOpenEditNameModal(false);
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
    <h3 style={{ textAlign: "center" }}>
      You have no projects at the moment <br /> Create a new project to start
      exploring all our features
    </h3>
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
                  title={
                    <Space>
                      <EditFilled
                        style={{ color: "#108ee9" }}
                        onClick={() => {
                          setEditProjectId(project._id);
                          setOpenEditNameModal(true);
                        }}
                      />
                      {project.name}
                    </Space>
                  }
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
                        Modal.confirm({
                          title: "Confirmation",
                          icon: <></>,
                          content: (
                            <h3 style={{ marginTop: 0, color: "#4f4e4e" }}>
                              Are you sure you would like to delete this
                              project?
                            </h3>
                          ),
                          onOk: () => {
                            onDeleteProject(project._id);
                          },
                          okText: "Delete",
                          cancelText: "Cancel",
                        });
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
        </ConfigProvider>

        <FormModal
          isOpen={openNewProjectModal}
          onCancel={onCancelNewProjectModal}
          onOk={onCreateProject}
          title={
            <Space style={{ fontSize: "16px" }}>
              <Tooltip
                title={
                  <div>
                    Split your project into tasks and rank them from <b>1-8</b>{" "}
                    based on time and difficulty
                  </div>
                }
                color={"#108ee9"}
              >
                <InfoCircleFilled style={{ color: "#108ee9" }} />
              </Tooltip>
              Time to plan out your project!
            </Space>
          }
          okButtonText={"Add"}
          modalWidth={800}
        >
          <NewProjectModalContent />
        </FormModal>

        <FormModal
          isOpen={openEditNameModal}
          onCancel={onCancelEditNameModal}
          onOk={onEditProjectName}
          title={"Edit project name"}
          okButtonText={"Ok"}
        >
          <Form.Item
            label={<label style={{ fontWeight: "500" }}> Project name </label>}
            rules={[{ required: true, message: "Give this project a name" }]}
            name="name"
          >
            <Input size={"large"} />
          </Form.Item>
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
