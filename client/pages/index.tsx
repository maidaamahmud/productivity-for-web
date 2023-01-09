import {
  Button,
  Col,
  ConfigProvider,
  Empty,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import axios from "axios";
import { GetStaticProps } from "next/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MinusCircleFilled,
  ClockCircleOutlined,
  CaretLeftFilled,
  CaretRightFilled,
} from "@ant-design/icons";

import PageLayout from "../components/general/PageLayout";

import { IProject, ITask, ISprint } from "../type";
import { refreshData } from "../utils/globalFunctions";
import { updateProject, addSprint, updateSprint } from "./api";
import { useRouter } from "next/router";

interface IListData {
  project: { _id: string; name: string };
  tasks: ITask;
}

interface Props {
  projects: IProject[]; // comes from getServerSideProps (at bottom of page)
  sprints: ISprint[];
}

export default function Home({ projects, sprints }: Props) {
  const router = useRouter();

  const [sprintInProgress, setSprintInProgress] = useState<boolean>(false);
  const [openSprintReviewModal, setOpenSprintReviewModal] = useState(false);

  const sprintCountdown = useRef<number | null>(null);

  // runs when projects are refetched, using the status of each task and whether its been added into sprint...
  // ...it stores these tasks in arrays to be used
  const taskData = useMemo(() => {
    let todoTasks: IListData[] = [];
    let inProgressTasks: IListData[] = [];
    let doneTasks: IListData[] = [];

    projects.forEach((project) => {
      project.tasks?.forEach((task) => {
        if (task.inSprint === true) {
          const taskData = {
            project: { _id: project._id, name: project.name },
            tasks: { ...task },
          };
          if (task.status === "todo") {
            todoTasks.push(taskData);
          }
          if (task.status === "inProgress") {
            inProgressTasks.push(taskData);
          }
          if (task.status === "done") {
            doneTasks.push(taskData);
          }
        }
      });
    });
    return { todoTasks, inProgressTasks, doneTasks };
  }, [projects]);

  const onEndSprint = useCallback(
    // UseCallback used to memoize
    async (completed: boolean) => {
      const currentSprint = sprints[sprints.length - 1];

      const sprintTasks: ITask[] = [];
      taskData.todoTasks.forEach((taskObject) => {
        sprintTasks.push(taskObject.tasks);
      });
      taskData.inProgressTasks.forEach((taskObject) => {
        sprintTasks.push(taskObject.tasks);
      });
      taskData.doneTasks.forEach((taskObject) => {
        sprintTasks.push(taskObject.tasks);
      });

      currentSprint.tasks = sprintTasks;
      currentSprint.completed = completed;
      try {
        await updateSprint(currentSprint._id, currentSprint);
        currentSprint.completed == true ? setOpenSprintReviewModal(true) : null;
        // remove tasks from done list
        for (const i in taskData.doneTasks) {
          const taskObject = taskData.doneTasks[i];
          const projectId = taskObject.project._id;
          const taskId = taskObject.tasks._id;

          const projectIndex = projects.findIndex(
            (project) => project._id === projectId
          );
          const project = projects[projectIndex];
          if (project.tasks) {
            const taskIndex = project.tasks.findIndex(
              (task) => task._id === taskId
            );
            project.tasks[taskIndex].inSprint = false;
          }
          await updateProject(project._id, project);
        }

        // refresh page
        refreshData(router);
      } catch (error: any) {
        message.error(
          "There was an issue ending the sprint, please try again",
          2
        );
      }
    },
    [projects, router, sprints, taskData]
  );
  // useEffect determines if there is an ongoing sprint and sets the state accordingly
  // it also stores the number of days left until the sprint is over under the variable name sprintCountdown
  useEffect(() => {
    if (sprints.length > 0) {
      const currentSprint = sprints[sprints.length - 1];
      const daysInSprint = 7;
      const todayDate = new Date();
      const sprintStartDate = new Date(currentSprint.createdAt!);

      const _MS_PER_DAY = 1000 * 60 * 60 * 24;

      const utcSprintStart = Date.UTC(
        sprintStartDate.getFullYear(),
        sprintStartDate.getMonth(),
        sprintStartDate.getDate()
      );
      const utcToday = Date.UTC(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate()
      );

      const sprintDaysPassed = Math.floor(
        (utcToday - utcSprintStart) / _MS_PER_DAY
      );

      const sprintDaysLeft = daysInSprint - sprintDaysPassed;

      if (currentSprint.completed == false) {
        setSprintInProgress(false);
      } else if (sprintDaysLeft <= 0) {
        setSprintInProgress(false);
        onEndSprint(true);
      } else if (sprintDaysLeft > 0) {
        setSprintInProgress(true);
      }

      sprintCountdown.current = sprintDaysLeft;
    }
  }, [sprints, onEndSprint]);

  const onStartSprint = async () => {
    if (sprintInProgress == false) {
      if (
        taskData.todoTasks.length > 0 ||
        taskData.inProgressTasks.length > 0
      ) {
        // loading message appears whilst project is being created, once complete user recieves a response message
        const hideMessage = message.loading("Loading..", 0);
        try {
          await addSprint();
          setSprintInProgress(true);
          message.success(
            `The sprint has begun, you have one week to try and complete as many of these tasks as you can!`, //FIXME: display in popup
            3
          );
          refreshData(router);
        } catch (error: any) {
          message.error(
            "There seems to have been an issues starting this sprint, please try again.",
            2
          );
        } finally {
          hideMessage();
        }
      } else {
        message.error("You can't start a sprint with no tasks!", 2);
      }
    } else {
      message.error("End the ongoing sprint to start a new one", 2);
    }
  };

  // functions runs when user removes a task from the sprint
  const onRemoveFromSprint = async (projectId: string, taskId: String) => {
    const projectIndex = projects.findIndex(
      (project) => project._id === projectId
    );
    const project = projects[projectIndex];
    if (project.tasks) {
      const taskIndex = project.tasks.findIndex((task) => task._id === taskId);
      project.tasks[taskIndex].inSprint = false;
    }
    try {
      await updateProject(project._id, project);
      refreshData(router);
    } catch (error: any) {
      message.error(
        "There was an issue removing this task from the sprint, please try again",
        2
      );
    }
  };

  const changeStatus = async (
    projectId: string,
    taskId: string,
    direction: string
  ) => {
    const statusArray = ["todo", "inProgress", "done"];
    const projectIndex = projects.findIndex(
      (project) => project._id === projectId
    );
    const project = projects[projectIndex];
    if (project.tasks) {
      const taskIndex = project.tasks.findIndex((task) => task._id === taskId);
      const previousStatus = project.tasks[taskIndex].status;
      let statusIndex = statusArray.indexOf(previousStatus);
      if (direction == "right") {
        if (statusIndex == 2) {
          statusIndex = 0;
        } else {
          statusIndex++;
        }
      } else if (direction == "left") {
        if (statusIndex == 0) {
          statusIndex = 2;
        } else {
          statusIndex--;
        }
      }
      project.tasks[taskIndex].status = statusArray[statusIndex];
      try {
        await updateProject(project._id, project);
        refreshData(router);
      } catch (error: any) {}
    }
  };

  const onReviewSprint = () => {
    setOpenSprintReviewModal(false);
    // FIXME: go to progress
  };

  const displayEmptyTodoTable = () =>
    !sprintInProgress ? (
      <>
        <h4 style={{ fontWeight: "500" }}>
          Go through your projects and add in what tasks you want to complete in
          your next sprint
        </h4>
        <Button
          size="middle"
          type="link"
          style={{
            color: "#108ee9",
          }}
          onClick={() => {
            router.push("/projects");
          }}
        >
          Go to Projects
        </Button>
      </>
    ) : null;

  const columns = [
    {
      title: "Task",
      dataIndex: "tasks",
      render: (task: ITask, taskObject: IListData) => {
        return (
          <>
            {sprintInProgress ? (
              <>
                <CaretLeftFilled
                  style={{ color: "#a3a2a2", fontSize: "17px" }}
                  onClick={() => {
                    changeStatus(taskObject.project._id, task._id, "left");
                  }}
                />
                <CaretRightFilled
                  style={{ color: "#a3a2a2", fontSize: "17px" }}
                  onClick={() => {
                    changeStatus(taskObject.project._id, task._id, "right");
                  }}
                />
              </>
            ) : (
              <Tooltip title="remove from sprint">
                <MinusCircleFilled
                  style={{ color: "#108ee9" }}
                  onClick={() => {
                    onRemoveFromSprint(
                      taskObject.project._id,
                      taskObject.tasks._id
                    );
                  }}
                />
              </Tooltip>
            )}
            &nbsp;&nbsp;
            {task.description}
          </>
        );
      },
      key: "description",
    },
    {
      title: "Ranking",
      dataIndex: "tasks",
      render: (task: ITask) => {
        return task.ranking;
      },
      key: "ranking",
    },
  ];

  return (
    <PageLayout>
      <div style={{ marginTop: "40px" }}>
        {sprintInProgress ? (
          <Row>
            <Col span={8}>
              <Button
                size="large"
                type="default"
                style={{
                  marginBottom: "35px",
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  border: "none",
                }}
                onClick={() => {
                  Modal.confirm({
                    title: "Confirm",
                    icon: <></>,
                    content:
                      "Are you sure you would like to end this sprint early?",
                    onOk: () => {
                      onEndSprint(false);
                    },
                    okText: "End",
                    cancelText: "No",
                  });
                }}
              >
                End Sprint
              </Button>
            </Col>
            <Col span={8} offset={8}>
              <h3
                style={{
                  textAlign: "right",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                <ClockCircleOutlined />
                &nbsp;&nbsp;
                {`${sprintCountdown.current} days`}
              </h3>
            </Col>
          </Row>
        ) : (
          <Button
            size="large"
            type="default"
            onClick={() => {
              onStartSprint();
            }}
            style={{
              marginBottom: "35px",
              backgroundColor: "#108ee9",
              color: "white",
              border: "none",
            }}
          >
            Start Sprint
          </Button>
        )}
        <div>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <h2 style={{ fontSize: "17px" }}>Todo</h2>
              <ConfigProvider renderEmpty={displayEmptyTodoTable}>
                <Table
                  size="large"
                  dataSource={taskData.todoTasks}
                  columns={columns}
                  pagination={false}
                  style={{ marginBottom: "40px" }}
                />
              </ConfigProvider>
            </Col>
            <ConfigProvider
              renderEmpty={() => {
                return "";
              }}
            >
              <Col span={8}>
                <h2 style={{ fontSize: "17px" }}>In Progress</h2>
                <Table
                  size="large"
                  dataSource={taskData.inProgressTasks}
                  columns={columns}
                  pagination={false}
                  style={{ marginBottom: "20px" }}
                />
              </Col>
              <Col span={8}>
                <h2 style={{ fontSize: "17px" }}>Done</h2>
                <Table
                  size="large"
                  dataSource={taskData.doneTasks}
                  columns={columns}
                  pagination={false}
                  style={{ marginBottom: "20px" }}
                />
              </Col>
            </ConfigProvider>
          </Row>
        </div>
      </div>
      <Modal
        title="Review Your Sprint"
        open={openSprintReviewModal}
        onCancel={() => {
          setOpenSprintReviewModal(false);
        }}
        footer={null}
      >
        FIXME: Display some data here (one graph or smth)
        <div style={{ display: " flex", justifyContent: "flex-end" }}>
          <Button
            size="large"
            style={{
              background: "#108ee9",
              color: "white",
              marginTop: "5px",
              width: "10vh",
              border: "none",
            }}
            onClick={onReviewSprint}
          >
            Review
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async () => {
  // fetches projects, and returns them within props under the name projects
  const BASE_URL: string = "http://127.0.0.1:4000";
  const projectsRes = await axios.get(BASE_URL + "/projects");
  const sprintsRes = await axios.get(BASE_URL + "/sprints");
  return {
    props: {
      projects: projectsRes.data.projects,
      sprints: sprintsRes.data.sprints,
    },
  };
};
