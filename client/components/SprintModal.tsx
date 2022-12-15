import { Modal } from "antd";

interface Props {
  open: boolean;
  onStartSprint: () => void;
  handleCancel: () => void;
}

export default function SprintModal({
  open,
  handleCancel,
  onStartSprint,
}: Props) {
  return (
    <Modal
      title="Sprint planning"
      open={open}
      onOk={onStartSprint}
      onCancel={() => {
        handleCancel();
      }}
      width={800}
    ></Modal>
  );
}
