import { Divider, Button, Space, Table, Typography } from "antd";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import axios from "axios";
import { GetStaticProps } from "next";
import PageLayout from "../../components/PageLayout";
import { IProject, ITask } from "../../type";

interface Props {
  project: IProject; // comes from getServerSideProps (at bottom of page)
}

export default function ViewProject({ project }: Props) {
  const { Text } = Typography;

  const completeTasks = project.tasks?.filter((task) => {
    return task.status;
  });
  const incompleteTasks = project.tasks?.filter((task) => {
    return !task.status;
  });

  const columns = [
    {
      title: "Task",
      dataIndex: "description",
      render: (tasks: ITask[], task: ITask) => {
        return (
          <Space size={"large"}>
            {task.status ? (
              <Text
                onClick={() => {
                  console.log("HELLO");
                }}
              >
                <MinusCircleTwoTone style={{ fontSize: "20px" }} />
              </Text>
            ) : (
              <CheckCircleTwoTone
                style={{ fontSize: "20px" }}
                twoToneColor={"#6dc76d"}
              />
            )}
            {task.description}
          </Space>
        );
      },
      key: "description",
    },
    {
      title: "Ranking",
      dataIndex: "ranking",
      key: "ranking",
    },
  ];
  return (
    <PageLayout>
      <Divider orientation="left">Todo</Divider>
      <Table
        size="large"
        dataSource={incompleteTasks}
        columns={columns}
        pagination={false}
        style={{ marginBottom: "20px" }}
      />
      <Divider orientation="left">Complete</Divider>
      <Table
        size="large"
        dataSource={completeTasks}
        columns={columns}
        pagination={false}
        style={{ marginBottom: "20px" }}
      />
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async (context) => {
  const { params } = context; // params contains the dynamic variables in the route (id)
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects/" + params!.id); //FIXME: move to api?
  return {
    props: {
      project: results.data.project,
    },
  };
};
