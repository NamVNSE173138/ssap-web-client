import { Input } from "@/components/ui/input";
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import { CloudUploadIcon, TrashIcon } from "lucide-react";

const DocumentRows = ({
  row,
  setRows,
  documentType,
  handleDeleteRow,
  handleInputChange,
}: any) => {
  return (
    <TableRow
      key={row.id}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      {/* Name Input */}
      <TableCell sx={{ width: "25%", minWidth: "150px" }}>
        <Input
          className={`w-full ${row.errors?.name ? "border-red-500" : ""}`}
          value={row.name}
          onChange={(e) => handleInputChange(row.id, "name", e.target.value)}
          placeholder="Enter name"
        />
        {row.errors?.name && (
          <span className="text-red-500 text-sm mt-1">Name is required</span>
        )}
      </TableCell>

      {/* Select Dropdown */}
      <TableCell sx={{ width: "30%", minWidth: "200px" }}>
        <Select
          value={row.type || ""}
          onChange={(e) => handleInputChange(row.id, "type", e.target.value)}
          displayEmpty
          size="small"
          sx={{
            width: "100%",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <MenuItem value="" disabled>
            Select Type
          </MenuItem>
          {documentType.map((option: any) => (
            <MenuItem key={option} value={option}>
              {option.length > 40 ? `${option.slice(0, 40)}...` : option}
            </MenuItem>
          ))}
        </Select>
        {row.errors?.type && (
          <span className="text-red-500 text-sm mt-1">Type is required</span>
        )}
      </TableCell>

      {/* Upload File Button */}
      <TableCell sx={{ width: "25%", minWidth: "150px" }} align="right">
        <Button
          size="small"
          component="label"
          variant="contained"
          sx={{
            backgroundColor: row.errors?.file ? "error.main" : "#1eb2a6",
            "&:hover": {
              backgroundColor: row.errors?.file ? "error.dark" : "#179d8f",
            },
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxWidth: "150px",
          }}
          startIcon={<CloudUploadIcon />}
        >
          {row.fileName && row.fileName.length > 10
            ? `${row.fileName.slice(0, 10)}...`
            : row.fileName || "Upload"}
          <input
            hidden
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setRows((prevRows: any) =>
                  prevRows.map((r: any) =>
                    r.id === row.id
                      ? { ...r, file: file, fileName: file.name }
                      : r
                  )
                );
                handleInputChange(row.id, "file", file);
              }
            }}
          />
        </Button>
      </TableCell>

      {/* Delete Icon */}
      <TableCell sx={{ width: "10%", minWidth: "50px" }} align="right">
        <Tooltip title="Delete row" arrow>
          <IconButton
            onClick={() => handleDeleteRow(row.id)}
            aria-label="delete"
            color="error"
            size="small"
            sx={{ padding: "4px" }}
          >
            <TrashIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default DocumentRows;
