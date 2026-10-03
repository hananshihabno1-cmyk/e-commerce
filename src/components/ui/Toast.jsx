import { useNotification } from '../../context/NotificationContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error: <AlertCircle size={18} className="text-red-500 shrink-0" />,
  info: <Info size={18} className="text-blue-500 shrink-0" />,
};

const bgColors = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
};

export default function Toast() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg toast-enter ${bgColors[n.type] || bgColors.info}`}
        >
          {icons[n.type] || icons.info}
          <p className="text-sm text-gray-800 flex-1 font-medium">{n.message}</p>
          <button
            onClick={() => removeNotification(n.id)}
            className="shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors"
          >
            <X size={14} className="text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
