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
  const [openSprintReviewModal, setOpenSprintReviewModal] =
    useState<boolean>(false);

  const sprintCountdown = useRef<number | null>(null);

  // runs when projects are refetched, using the status of each task and whether its been added into sprint...
  // ...it stores these tasks in arrays to be used
  const sprintData = useMemo(() => {
    let allTasks: ITask[] = [];
    let todoTasks: IListData[] = [];
    let inProgressTasks: IListData[] = [];
    let doneTasks: IListData[] = [];

    projects.forEach((project) => {
      project.tasks?.forEach((task) => {
        if (task.inSprint === true) {
          allTasks.push(task);
          const listData = {
            project: { _id: project._id, name: project.name },
            tasks: { ...task },
          };
          if (task.status === "todo") {
            todoTasks.push(listData);
          }
          if (task.status === "inProgress") {
            inProgressTasks.push(listData);
          }
          if (task.status === "done") {
            doneTasks.push(listData);
          }
        }
      });
    });
    return { todoTasks, inProgressTasks, doneTasks, allTasks };
  }, [projects]);

  const onEndSprint = useCallback(
    // UseCallback used to memoize
    async (completed: boolean) => {
      const currentSprint = sprints[0];

      currentSprint.tasks = sprintData.allTasks;
      currentSprint.completed = completed;
      try {
        await updateSprint(currentSprint._id, currentSprint);
        setOpenSprintReviewModal(true);

        // remove tasks from done list
        for (const i in sprintData.doneTasks) {
          const taskObject = sprintData.doneTasks[i];
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
    [projects, router, sprints, sprintData]
  );

  // useEffect determines if there is an ongoing sprint and sets the state accordingly...
  // ...it also stores the number of days left until the sprint is over under the variable name sprintCountdown
  useEffect(() => {
    if (sprints.length > 0) {
      // if there is an ongoing sprint it will always be the first sprit in the array ( as the array is ordered descending date)
      const currentSprint = sprints[0];
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

      // currentSprint.completed is null by default (for an ongoing sprint)
      // currentSprint.completed = true <- not ongoing, completed properly (after 7 days)
      // currentSprint.completed = false <- not ongoing, not completed properly (ended before 7 days)

      if (currentSprint.completed == false) {
        // if the sprint has completed set to false that means it was ended early and is no longer an ongoing sprint
        setSprintInProgress(false);
      } else if (sprintDaysLeft <= 0) {
        // if the days for the sprint have passed, the sprint is ended automatically
        setSprintInProgress(false);
        onEndSprint(true);
      } else if (sprintDaysLeft > 0) {
        // if the days for the sprint have not yet passed, the sprint is determined as ongoing
        setSprintInProgress(true);
      }

      sprintCountdown.current = sprintDaysLeft;
    }
  }, [sprints, onEndSprint]);

  const onStartSprint = async () => {
    // error handeling for starting a new sprint (for the multiple different cases)
    if (sprintInProgress == false) {
      if (
        sprintData.todoTasks.length > 0 ||
        sprintData.inProgressTasks.length > 0
      ) {
        const hideMessage = message.loading("Loading..", 0);
        try {
          // if a sprint is not already in progress and there are tasks either within the todo list or inProgress list
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

  // runs during an ongoing sprint when the user changes the status of a task using left and right icons
  const onChangeStatus = async (
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

  // displayed when todo table is empty to prompt the user
  const displayEmptyTodoTable = () =>
    !sprintInProgress ? (
      <>
        <h5>
          Go through your projects and add in what tasks you want to complete in
          your next sprint
        </h5>
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
        // if a sprint is not in progress only the minus icon is shown to remove the task from the sprint
        // if a sprint is in progress only the left and right arrows are shown to change the status of a task
        return (
          <>
            {sprintInProgress ? (
              <>
                <CaretLeftFilled
                  style={{ color: "#a3a2a2", fontSize: "17px" }}
                  onClick={() => {
                    onChangeStatus(taskObject.project._id, task._id, "left");
                  }}
                />
                <CaretRightFilled
                  style={{ color: "#a3a2a2", fontSize: "17px" }}
                  onClick={() => {
                    onChangeStatus(taskObject.project._id, task._id, "right");
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
                    okType: "danger",
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
              <h2>Todo</h2>
              <ConfigProvider renderEmpty={displayEmptyTodoTable}>
                <Table
                  size="large"
                  dataSource={sprintData.todoTasks}
                  columns={columns}
                  pagination={false}
                />
              </ConfigProvider>
            </Col>
            <ConfigProvider
              renderEmpty={() => {
                return "";
              }}
            >
              <Col span={8}>
                <h2>In Progress</h2>
                <Table
                  size="large"
                  dataSource={sprintData.inProgressTasks}
                  columns={columns}
                  pagination={false}
                />
              </Col>
              <Col span={8}>
                <h2>Done</h2>
                <Table
                  size="large"
                  dataSource={sprintData.doneTasks}
                  columns={columns}
                  pagination={false}
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
        FIXME: Display some data here
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
