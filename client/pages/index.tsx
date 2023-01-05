import { Button, Col, ConfigProvider, Empty, Row, Space, Table } from "antd";
import axios from "axios";
import { GetStaticProps } from "next/types";
import { useMemo, useState } from "react";
import FormModal from "../components/general/FormModal";

import PageLayout from "../components/general/PageLayout";

import { IProject, ITask } from "../type";

// const onChangeStatus = async (taskId: String, status: boolean) => {
//   if (project && project.tasks) {
//     const taskIndex = project.tasks.findIndex((task) => task._id === taskId);
//     project.tasks[taskIndex].status = status;
//   }
//   try {
//     await updateProject(project._id, project);
//     refreshData(); // data refetched once project has been deleted
//   } catch (error: any) {
//     message.error("There was an issue moving the task, please try again", 2);
//   }
// };

// render: (tasks: ITask[], task: ITask) => {
//   return (
//     <Space size={"large"}>
//       {task.status ? (
//         <Text
//           onClick={() => {
//             onChangeStatus(task._id, false);
//           }}
//         >
//           <MinusCircleTwoTone style={{ fontSize: "20px" }} />
//         </Text>
//       ) : (
//         <CheckCircleTwoTone
//           onClick={() => {
//             onChangeStatus(task._id, true);
//           }}
//           style={{ fontSize: "20px" }}
//           twoToneColor={"#6dc76d"}
//         />
//       )}
//       {task.description}
//     </Space>
//   );
// },

const columns = [
  {
    title: "Task",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Ranking",
    dataIndex: "ranking",
    key: "ranking",
  },
  {
    title: "Project",
    dataIndex: "project",
    key: "project",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

interface IListData extends ITask {
  project: String;
}

interface Props {
  projects: IProject[]; // comes from getServerSideProps (at bottom of page)
}

export default function Home({ projects }: Props) {
  const [openSprintModal, setOpenSprintModal] = useState<boolean>(false);

  const tableData = useMemo(() => {
    let todoTasks: IListData[] = [];
    let inProgressTasks: IListData[] = [];
    let doneTasks: IListData[] = [];

    projects.forEach((project) => {
      project.tasks?.forEach((task) => {
        if (task.isSprint === true) {
          if (task.status === "todo") {
            todoTasks.push({ project: project.name, ...task });
          }
          if (task.status === "inProgress") {
            inProgressTasks.push({ project: project.name, ...task });
          }
          if (task.status === "done") {
            doneTasks.push({ project: project.name, ...task });
          }
        }
      });
    });
    return { todoTasks, inProgressTasks, doneTasks };
  }, [projects]);

  const onStartSprint = () => {
    setOpenSprintModal(false);
  };

  const onCancelSprintModal = () => {
    // when modal is closed
    setOpenSprintModal(false);
  };

  const displayEmptyTable = () => (
    <div style={{ textAlign: "center" }}>No Tasks</div> //FIXME: add meaningful empty state (no tasks? create a sprint)
  );

  return (
    <PageLayout>
      <div style={{ marginTop: "40px" }}>
        <Button
          size="large"
          type="default"
          onClick={() => {
            setOpenSprintModal(true);
          }}
          style={{
            marginBottom: "35px",
            backgroundColor: "#108ee9",
            color: "white",
            border: "none",
          }}
        >
          Create Sprint
        </Button>
        <div>
          <ConfigProvider renderEmpty={displayEmptyTable}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <h2 style={{ fontSize: "17px" }}>Todo</h2>
                <Table
                  size="large"
                  dataSource={tableData.todoTasks}
                  columns={columns}
                  pagination={false}
                  style={{ marginBottom: "40px" }}
                />
              </Col>
              <Col span={8}>
                <h2 style={{ fontSize: "17px" }}>In Progress</h2>
                <Table
                  size="large"
                  dataSource={tableData.inProgressTasks}
                  columns={columns}
                  pagination={false}
                  style={{ marginBottom: "20px" }}
                />
              </Col>
              <Col span={8}>
                <h2 style={{ fontSize: "17px" }}>Done</h2>
                <Table
                  size="large"
                  dataSource={tableData.doneTasks}
                  columns={columns}
                  pagination={false}
                  style={{ marginBottom: "20px" }}
                />
              </Col>
            </Row>
          </ConfigProvider>
          {/* <FormModal
            isOpen={openSprintModal}
            onCancel={onCancelSprintModal}
            onOk={hi}
            title={"Create Sprint"}
          >
            hi
          </FormModal> */}
        </div>
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
