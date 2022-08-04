import { Box, Button } from "@mui/material";
import { FC } from "react";
import { ISizes } from "../../interfaces";

interface Props {
  selectedSize?: ISizes;
  sizes: ISizes[];
  onSelectSize: (size: ISizes) => void;
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectSize }) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          key={size}
          size="small"
          color={size === selectedSize ? "primary" : "info"}
          onClick={() => onSelectSize(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
