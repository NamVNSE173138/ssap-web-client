import { Input } from "@/components/ui/input";
import { Button, IconButton, MenuItem, Select, TableCell, TableRow, Tooltip } from "@mui/material";
import { CloudUploadIcon, TrashIcon } from "lucide-react";

// const typeOptions = [
//     { value: 'Academic Transcript', label: 'Academic Transcript' },
//     { value: 'Financial Report', label: 'Financial Report' },
// ];

const ExtendApplicationRows = ({ row, setRows, documentType, handleDeleteRow, handleInputChange }: any) => {
    return (
        <TableRow
            key={row.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" scope="row">
                <Input
                    className={`w-2/3 ${row.errors?.name ? 'border-red-500' : ''}`}
                    value={row.name}
                    onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                    placeholder="Enter name"
                />
                {row.errors?.name && (
                    <span className="text-red-500 text-sm mt-1">Name is required</span>
                )}
            </TableCell>
            <TableCell>
                <Select
                    value={row.type || ''}
                    onChange={(e) => handleInputChange(row.id, 'type', e.target.value)}
                    displayEmpty
                    sx={{ width: '100%' }}
                >
                    <MenuItem value="" disabled>
                        Select Type
                    </MenuItem>
                    {documentType.map((option:any) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
                {row.errors?.type && (
                    <span className="text-red-500 text-sm mt-1">Type is required</span>
                )}
            </TableCell>
            <TableCell align="right">
                <Button
                    component="label"
                    variant="contained"
                    sx={{
                        backgroundColor: row.errors?.file ? 'error.main' : '#1eb2a6',
                        '&:hover': {
                            backgroundColor: row.errors?.file ? 'error.dark' : '#179d8f',
                        },
                    }}
                    startIcon={<CloudUploadIcon />}
                >
                    {row.fileName || 'Upload file*'}
                    <input
                        hidden
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setRows((prevRows: any) =>
                                    prevRows.map((r: any) =>
                                        r.id === row.id ? { ...r, file: file, fileName: file.name } : r
                                    )
                                );
                                handleInputChange(row.id, 'file', file);
                            }
                        }}
                    />
                </Button>
            </TableCell>
            <TableCell align="right">
                <Tooltip title="Delete row">
                    <IconButton onClick={() => handleDeleteRow(row.id)} aria-label="delete" color="error">
                        <TrashIcon />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};

export default ExtendApplicationRows;

