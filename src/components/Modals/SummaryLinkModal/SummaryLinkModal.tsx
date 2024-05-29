import Modal from '@/components/Modals/Modal';
import { MdAddLink } from 'react-icons/md';


type SummaryModalProps = {
    onClose: Function;
    isOpenShareModal: boolean;
};

export default function SummaryLinkModal({ onClose, isOpenShareModal }: SummaryModalProps) {
    if (!isOpenShareModal) return null;
    return (
        <Modal size="sm" bgColor='transparent' animation="slideInTop" onClose={onClose}>
            <div className="bg-[#1F133E] p-2 flex flex-col rounded-lg text-white text-center items-center py-16 opacity-75">
                <MdAddLink className='text-5xl' />
                <div className='text-3xl'>
                    Plannet Link Copied
                </div>
            </div>
        </Modal>
    );
}
