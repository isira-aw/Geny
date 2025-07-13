import React from "react";

interface Props {
  onConnected: () => void;
}

export const ConnectNetworkModal: React.FC<Props> = ({ onConnected }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl text-center shadow-lg max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">Connect with Network</h2>
        <button
          onClick={onConnected}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Connect with Network
        </button>
      </div>
    </div>
  );
};
