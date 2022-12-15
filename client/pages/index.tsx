import { Button, ConfigProvider, Empty, Table } from "antd";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { GetStaticProps } from "next/types";
import { useEffect, useMemo, useState } from "react";
import {
  forEachChild,
  getAllJSDocTagsOfKind,
  isAsteriskToken,
} from "typescript";
import PageLayout from "../components/PageLayout";
import SprintModal from "../components/SprintModal";
import styles from "../styles/Home.module.css";
import { IProject, ITask } from "../type";

interface IListData extends ITask {
  project: String;
}

interface Props {
  projects: IProject[]; // comes from getServerSideProps (at bottom of page)
}

export default function Home({ projects }: Props) {
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

  const listData = useMemo(() => {
    let todayData: IListData[] = [];
    let sprintData: IListData[] = [];

    projects.forEach((project) => {
      project.tasks?.forEach((task) => {
        if (task.lists.includes("sprint")) {
          sprintData.push({ project: project.name, ...task });
        }
        if (task.lists.includes("today")) {
          todayData.push({ project: project.name, ...task });
        }
      });
    });

    return { todayData, sprintData };
  }, [projects]);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const onCancelModal = () => {
    // when modal is closed
    setOpenModal(false);
  };

  const onStartSprint = () => {
    setOpenModal(false);
  };

  const displayEmptyTable = () => (
    <div style={{ textAlign: "center" }}>No Tasks</div> //FIXME: add meaningful empty state (no tasks? create a sprint)
  );

  return (
    <PageLayout>
      <div>
        <Button
          size="large"
          type="default"
          onClick={() => {
            setOpenModal(true);
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
            <h2 style={{ fontSize: "17px", color: "black" }}>Today</h2>
            <Table
              size="large"
              dataSource={listData.todayData}
              columns={columns}
              pagination={false}
              style={{ marginBottom: "40px" }}
            />
            <h2 style={{ fontSize: "17px", color: "black" }}>Sprint</h2>
            <Table
              size="large"
              dataSource={listData.sprintData}
              columns={columns}
              pagination={false}
              style={{ marginBottom: "20px" }}
            />
          </ConfigProvider>
        </div>
        <SprintModal
          open={openModal}
          handleCancel={onCancelModal}
          onStartSprint={onStartSprint}
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
