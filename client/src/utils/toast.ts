import toast from 'react-hot-toast';

// Extension du toast pour ajouter la méthode info
export const customToast = {
  ...toast,
  info: (message: string) => {
    return toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
      },
    });
  },
};

export default customToast; 