import { Input } from "@/components/ui/input";
import { Button, IconButton, MenuItem, Paper, Select } from "@mui/material";
import { CloudUploadIcon, TrashIcon } from "lucide-react";

const ExtendApplicationRows = ({ row, setRows, documentType, handleDeleteRow, handleInputChange }: any) => {
    if (Array.isArray(row)) {
        console.error('Expected "row" to be an object, but got an array');
        return null;
    }

    return (
        <div>
            <Paper
                elevation={3}
                style={{
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#fafafa',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    marginBottom: '20px',
                    marginTop: '10px',
                }}

            >

                {/* Header Row */}
                <div
                    key={row.id}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {/* Header for Name */}
                    <div style={{ flex: 1, fontWeight: 'bold', color: '#333' }}>
                        Name
                    </div>
                    {/* Header for Type */}
                    <div style={{ flex: 1, fontWeight: 'bold', color: '#333' }}>
                        Type
                    </div>
                    {/* Header for File */}
                    <div style={{ flex: 1, fontWeight: 'bold', color: '#333' }}>
                        File
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>

                    </div>
                </div>

                {/* Row content */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#f9f9f9',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        transition: 'background-color 0.3s ease',
                    }}
                >
                    {/* Input for Name */}
                    <div style={{ flex: 1, color: '#333' }}>
                        <Input
                            className={`w-[80%] ${row.errors?.name ? 'border-red-500' : ''}`}
                            value={row.name}
                            onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                            placeholder="Enter name"
                        />
                        {row.errors?.name && (
                            <span className="text-red-500 text-sm mt-1">Name is required</span>
                        )}
                    </div>

                    {/* Select for Type */}
                    <div style={{ flex: 1, color: '#333', justifyContent: 'end' }}>
                        <Select
                            value={row.type || ''}
                            onChange={(e) => handleInputChange(row.id, 'type', e.target.value)}
                            displayEmpty
                            sx={{ width: '70%' }}
                        >
                            <MenuItem value="" disabled>
                                Select Type
                            </MenuItem>
                            {documentType.map((option: any) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        {row.errors?.type && (
                            <span className="text-red-500 text-sm mt-1">Type is required</span>
                        )}
                    </div>

                    {/* Upload File Button */}
                    <div style={{ flex: 1, display: 'flex' }}>
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
                    </div>

                    {/* Delete Row Button */}
                    <div style={{ display: 'flex' }}>
                        <IconButton
                            onClick={() => handleDeleteRow(row.id)}
                            aria-label="delete"
                            color="error"
                        >
                            <TrashIcon />
                        </IconButton>
                    </div>
                </div>
            </Paper>
        </div>
    );
};


export default ExtendApplicationRows;

