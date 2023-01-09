import { Card, ConfigProvider, List } from "antd";
import axios from "axios";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "../../components/general/PageLayout";
import { ISprint } from "../../type";

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

  const displayEmptyList = () => <h2 style={{ textAlign: "center" }}></h2>;

  return (
    <PageLayout>
      <div style={{ marginTop: "40px" }}>
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
                  title={`Sprint ${sprints.length - sprints.indexOf(sprint)}`}
                  onClick={() => {
                    router.push("/progress/" + sprint._id);
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <b>{displayReadableDate(sprint.createdAt)}</b>
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
  return {
    props: {
      sprints: sprintsRes.data.sprints,
    },
  };
};
