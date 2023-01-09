import { Card, ConfigProvider, List } from "antd";
import axios from "axios";
import { GetStaticProps } from "next";
import PageLayout from "../components/general/PageLayout";
import { ISprint } from "../type";

interface Props {
  sprints: ISprint[];
}
export default function Progress({ sprints }: Props) {
  const displayEmptyList = () => (
    <>
      <h2 style={{ textAlign: "center", fontSize: "15px", fontWeight: "500" }}>
        You have no projects at the moment <br /> Create a new project to start
        exploring all our features FIXME: fix text
      </h2>
    </>
  );
  return (
    <PageLayout>
      <div style={{ marginTop: "40px" }}>
        <h1
          style={{ marginTop: "30px", fontSize: "21px", marginBottom: "13px" }}
        >
          My Sprints
        </h1>

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
            dataSource={sprints}
            renderItem={(sprint) => (
              <List.Item>
                <Card title={"sprint"}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    content
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
