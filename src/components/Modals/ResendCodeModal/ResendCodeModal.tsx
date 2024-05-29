import Modal from '@/components/Modals/Modal';
import { RiMessage2Line } from 'react-icons/ri';

type SummaryModalProps = {
  onClose: Function;
  isOpen: boolean;
};

export default function ResendCodeModal({
  isOpen,
  onClose,
}: SummaryModalProps) {
  if (!isOpen) return null;
  return (
    <Modal
      size="sm"
      bgColor="transparent"
      animation="slideInTop"
      onClose={onClose}
    >
      <div className="bg-[#ffffff] bg-{color} p-2 flex flex-col rounded-lg text-[#1F133E] text-center items-center py-8">
        <RiMessage2Line className="text-5xl" />
        <div className="text-3xl">Resent Code</div>
      </div>
    </Modal>
  );
}
