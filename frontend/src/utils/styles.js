export const fieldStyles = (colors) => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: colors.white,
      },
      "&:hover fieldset": {
        borderColor: colors.blue,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.blue,
      },
    },
    "& .MuiInputLabel-root": {
      color: colors.blue,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.blue,
    },
    "& .MuiInputBase-input": {
      color: colors.text,
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: colors.blue,
    },
    "& .MuiFormLabel-root": {
      color: colors.white,
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: colors.blue,
    },

  });