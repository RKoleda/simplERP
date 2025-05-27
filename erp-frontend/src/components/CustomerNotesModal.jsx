import React from 'react';
import { Dialog } from '@headlessui/react';
import CustomerNotes from './CustomerNotes';

const CustomerNotesModal = ({ isOpen, onClose, customer }) => {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
          <Dialog.Title className="text-xl font-bold mb-2">
            Notizen für: {customer.name}
          </Dialog.Title>

          <CustomerNotes customerId={customer.id} />

          <div className="mt-4 text-right">
            <button onClick={onClose} className="text-sm text-gray-500 hover:underline">
              Schließen
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CustomerNotesModal;
