import { Card, Col, ConfigProvider, List, Row, Progress } from "antd";
import axios from "axios";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import PageLayout from "../components/general/PageLayout";
import { ISprint, ITask } from "../type";
import { SprintOverviewChart } from "../components/SprintOverviewChart";

interface Props {
  sprints: ISprint[];
}
export default function SprintProgress({ sprints }: Props) {
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
      if (sprint.completed) {
        const result = findSprintProgress(sprint.tasks!);
        averageProgress.userRank += result.userRank;
        averageProgress.totalRank += result.totalRank;
      }
    });
    averageProgress.totalPercentage = Math.round(
      (averageProgress.userRank / averageProgress.totalRank) * 100
    );
    return averageProgress;
  };

  const findAllSprintProgress = () => {
    let allSprintProgress: { date: string; completed: number }[] = [];
    sprints.forEach((sprint) => {
      if (sprint.completed) {
        const result = findSprintProgress(sprint.tasks!);
        let sprintProgress = { date: "", completed: 0 };
        sprintProgress.completed = result.totalPercentage
          ? result.totalPercentage
          : 0;
        sprintProgress.date = displayReadableDate(sprint.createdAt)!.slice(4);
        allSprintProgress.push(sprintProgress);
      }
    });
    return allSprintProgress.reverse();
  };

  const displayEmptyList = () => <h2 style={{ textAlign: "center" }}></h2>;

  return (
    <PageLayout>
      <div style={{ marginTop: "40px" }}>
        <h1 style={{ marginTop: "30px", marginBottom: 0 }}>Sprints Overview</h1>
        <Row>
          <Col span={8}>
            <h6 style={{ marginBottom: "35px", marginTop: "10px" }}>
              *Sprints that were ended early are not included in this overview
            </h6>
          </Col>
          <Col span={8} offset={8}>
            <h2 style={{ textAlign: "right", padding: 0, margin: 0 }}>
              <span style={{ color: "#fa4141" }}>
                {findAverageProgress().totalPercentage}%
              </span>{" "}
              completed on average
            </h2>
          </Col>
        </Row>
        <SprintOverviewChart data={findAllSprintProgress()} />
        <h1 style={{ marginTop: "30px", marginBottom: 0 }}>My Sprints</h1>
        <h6 style={{ marginBottom: "35px", marginTop: "10px" }}>
          *Sprints that were ended early are marked with red
        </h6>
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
                  title={
                    <Row>
                      <Col span={8}>
                        {`Sprint ${sprints.length - sprints.indexOf(sprint)}`}
                      </Col>
                      <Col span={8} offset={8}>
                        <div
                          style={{
                            color: sprint.completed ? "#108ee9" : "#fa4141",
                            fontWeight: 500,
                          }}
                        >
                          <>{displayReadableDate(sprint.createdAt)?.slice(4)}</>
                        </div>
                      </Col>
                    </Row>
                  }
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Progress
                      type="circle"
                      width={65}
                      strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                      strokeWidth={8}
                      percent={
                        findSprintProgress(sprint.tasks!).totalPercentage
                      }
                    />
                  </div>
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
