import {
  OptionsObject,
  useSnackbar as useNotistack,
  VariantType,
} from "notistack";

export const useSnackbar = () => {
  const { enqueueSnackbar } = useNotistack();

  const show = (
    message: string,
    variant: VariantType,
    action?: OptionsObject["action"],
  ) => {
    enqueueSnackbar(message, { variant, ...(action && { action }) });
  };

  return {
    success: (msg: string, action?: OptionsObject["action"]) =>
      show(msg, "success", action),
    error: (msg: string, action?: OptionsObject["action"]) =>
      show(msg, "error", action),
    warning: (msg: string, action?: OptionsObject["action"]) =>
      show(msg, "warning", action),
    info: (msg: string, action?: OptionsObject["action"]) =>
      show(msg, "info", action),
  };
};
