import { toast } from "sonner";
const useToast = () => {
  return {
    success: (message: string, options: { description?: string } = {}) => {
      toast.success(message, {
        duration: 3000,
        position: "bottom-right",
        ...(options.description && {
          description: (
            <p className="text-sm text-black">{options.description}</p>
          ),
        }),
      });
    },
    error: (message: string, options: { description?: string } = {}) => {
      toast.error(message, {
        duration: 3000,
        position: "bottom-right",
        ...(options.description && {
          description: (
            <p className="text-sm text-black">{options.description}</p>
          ),
        }),
      });
    },
  };
};

export default useToast;
