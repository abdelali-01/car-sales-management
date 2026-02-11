import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";

export default function DeleteModal({
  isOpen,
  onClose,
  onClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  itemId: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Confirm Deletion</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Are you sure you want to delete this item?
      </p>

      <div className="flex justify-end mt-6 gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClick}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
