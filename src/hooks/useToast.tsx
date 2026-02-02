import { toast } from "sonner";
const useToast = () => {
  return {
    success: (message: string, options: { description?: string } = {}) => {
      toast.success(message, {
        duration: 3000,
        position: "top-right",
        description: options.description,
      });
    },
    error: (message: string, options: { description?: string } = {}) => {
      toast.error(message, {
        duration: 3000,
        position: "top-right",
        description: options.description,
      });
    },
  };
};

export default useToast;
