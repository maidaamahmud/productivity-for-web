import { Space } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { GetStaticProps } from "next";
import PageLayout from "../../components/general/PageLayout";
import { ISprint } from "../../type";
import { useRouter } from "next/router";

interface Props {
  sprint: ISprint;
}

export default function ViewSprint({ sprint }: Props) {
  const router = useRouter();

  return (
    <PageLayout>
      <Space
        style={{
          fontWeight: "600",
          cursor: "pointer",
          marginTop: "10px",
          marginLeft: "-25px",
        }}
        onClick={() => {
          router.back();
        }}
      >
        <LeftOutlined />
        Back
      </Space>

      <h1 style={{ marginTop: "30px", marginBottom: "8px" }}>overview</h1>
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async (context) => {
  const { params } = context; // params contains the dynamic variables in the route (id)
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/sprints/" + params!.id);
  return {
    props: {
      sprint: results.data.sprint,
    },
  };
};
