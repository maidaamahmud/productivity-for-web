import { Form, Modal, Button } from "antd";
import { ReactNode } from "react";

// CHECK PROPS TO SEE WHAT IS NEEDED
// componenet renders a form in a modal and handles client-side form validation
// children should contain form input fields
interface Props {
  children: any;
  isOpen: boolean;
  onOk: any;
  onCancel: any;
  title: ReactNode;
  okButtonText?: string;
  modalWidth?: number;
}

export default function FormModal({
  children,
  isOpen,
  onCancel,
  onOk,
  title,
  okButtonText,
  modalWidth,
}: Props) {
  const [form] = Form.useForm();

  const onSubmitForm = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width={modalWidth}
      footer={null}
    >
      <Form
        layout={"vertical"}
        requiredMark={"optional"}
        form={form}
        autoComplete="off"
        style={{ paddingTop: "15px" }}
      >
        {children}
      </Form>
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
          onClick={onSubmitForm}
        >
          {okButtonText ? okButtonText : "Ok"}
        </Button>
      </div>
    </Modal>
  );
}
