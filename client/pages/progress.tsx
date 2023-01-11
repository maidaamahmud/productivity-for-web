import { Card, Col, ConfigProvider, List, Modal, Row } from "antd";
import axios from "axios";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import PageLayout from "../components/general/PageLayout";
import { ISprint, ITask } from "../type";

import { Line, G2 } from "@ant-design/plots";

import { each, findIndex } from "@antv/util";
import { SprintOverviewChart } from "../components/SprintOverviewChart";

interface Props {
  sprints: ISprint[];
}
export default function Progress({ sprints }: Props) {
  const router = useRouter();

  const displayReadableDate = (date: string | undefined) => {
    if (date) {
      const sprintStartDate = new Date(date);
      return sprintStartDate.toDateString();
    }
  };

  const findSprintProgress = (sprintTasks: ITask[]) => {
    let sprintProgress = { userRank: 0, totalRank: 0, totalPercentage: 0 };
    if (sprintTasks) {
      sprintTasks.forEach((task) => {
        task.status === "done"
          ? (sprintProgress.userRank += task.ranking)
          : null;
        sprintProgress.totalRank += task.ranking;
      });
    }
    sprintProgress.totalPercentage = Math.round(
      (sprintProgress.userRank / sprintProgress.totalRank) * 100
    );
    return sprintProgress;
  };

  const findAverageProgress = () => {
    let averageProgress = { userRank: 0, totalRank: 0, totalPercentage: 0 };
    sprints.forEach((sprint) => {
      // if (sprint.completed) {
      const result = findSprintProgress(sprint.tasks!);
      averageProgress.userRank += result.userRank;
      averageProgress.totalRank += result.totalRank;
      // }
    });
    averageProgress.totalPercentage = Math.round(
      (averageProgress.userRank / averageProgress.totalRank) * 100
    );
    return averageProgress;
  };

  const findAllSprintProgress = () => {
    let allSprintProgress: { date: string; completed: number }[] = [];
    sprints.forEach((sprint) => {
      // if (sprint.completed) {
      const result = findSprintProgress(sprint.tasks!);
      let sprintProgress = { date: "", completed: 0 };
      sprintProgress.completed = result.totalPercentage
        ? result.totalPercentage
        : 0;
      sprintProgress.date = displayReadableDate(sprint.createdAt)!.slice(4);
      allSprintProgress.push(sprintProgress);
      // }
    });
    return allSprintProgress;
  };

  const onOpenReviewSprint = (sprintId: string, sprintNumber: number) => {
    Modal.info({
      title: `Overview for Sprint ${sprintNumber}`,
      content: <div></div>,
      icon: <></>,
      width: 700,
    });
  };

  const displayEmptyList = () => <h2 style={{ textAlign: "center" }}></h2>;

  return (
    <PageLayout>
      <div style={{ marginTop: "40px" }}>
        <h1 style={{ marginTop: "30px", marginBottom: "35px" }}>
          Sprints Overview
        </h1>
        <SprintOverviewChart data={findAllSprintProgress()} />
        <h1 style={{ marginTop: "30px", marginBottom: "35px" }}>My Sprints</h1>
        <ConfigProvider renderEmpty={displayEmptyList}>
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
            dataSource={sprints}
            renderItem={(sprint) => (
              <List.Item>
                <Card
                  style={{ cursor: "pointer" }}
                  title={
                    <Row>
                      <Col span={8}>
                        {`Sprint ${sprints.length - sprints.indexOf(sprint)}`}
                      </Col>
                      <Col span={8} offset={8}>
                        <div style={{ color: "#108ee9", fontWeight: 500 }}>
                          <>{displayReadableDate(sprint.createdAt)?.slice(4)}</>
                        </div>
                      </Col>
                    </Row>
                  }
                  onClick={() => {
                    onOpenReviewSprint(
                      sprint._id,
                      sprints.length - sprints.indexOf(sprint)
                    );
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  ></div>
                </Card>
              </List.Item>
            )}
          />
        </ConfigProvider>
      </div>
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async () => {
  // fetches projects, and returns them within props under the name projects
  const BASE_URL: string = "http://127.0.0.1:4000";
  const sprintsRes = await axios.get(BASE_URL + "/sprints");
  const sprints = sprintsRes.data.sprints;
  sprints[0]?.completed === null ? sprints.shift() : null;

  return {
    props: {
      sprints: sprints,
    },
  };
};
