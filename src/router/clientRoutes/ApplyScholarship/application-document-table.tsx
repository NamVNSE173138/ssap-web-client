import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, IconButton, Tooltip, Select, MenuItem } from '@mui/material';
import { CloudUploadIcon, TrashIcon } from 'lucide-react';

function EditableTable({ documents ,rows, setRows, handleDeleteRow, handleInputChange }: any) {
/*const typeOptions = [
    { value: 'Academic Transcript', label: 'Academic Transcript' },
    { value: 'Recommendation Letter', label: 'Recommendation Letter' },
    { value: 'Personal Statement', label: 'Personal Statement' },
    { value: 'CV/Resume', label: 'CV/Resume' },
    { value: 'Research Proposal', label: 'Research Proposal' },
    { value: 'Portfolio', label: 'Portfolio' },
    { value: 'Certification', label: 'Certification' },
    { value: 'Exam Scores', label: 'Exam Scores' },
    { value: 'Financial Report', label: 'Financial Report' },
];*/
const typeOptions = /*documents?.map((document:any) => 
({ value: document.type, label: document.type, isRequired: document.isRequired })) ||*/
[
    { value: 'Other', label: 'Other', isRequired: false },
];
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>File</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row:any) => {
                        return (
                        <TableRow key={row.id}>
                            <TableCell>
                                    <TextField
                                        error={row.errors?.name}
                                        value={row.name}
                                        onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                                        placeholder="Enter name"
                                    />
                            </TableCell>
                            <TableCell>
                                {row.isRequired && 
                                    <div>
                                        {row.type}
                                        {<span style={{ color: 'red', marginLeft: 4 }}>*</span>}
                                    </div>
                                }
                                {!row.isRequired && 
                                    <div>
                                        {row.type}
                                    </div>
                                }
                                {/*row.isRequired == null && 
                                    <div>
                                        {row.type}
                                    </div>
                                }*/}
                                {/*<Select
                                    value={row.type || ''}
                                    error={row.errors?.type}
                                    onChange={(e) => handleInputChange(row.id, 'type', e.target.value)}
                                    displayEmpty
                                    sx={{ width: '100%' }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Type
                                    </MenuItem>
                                    {typeOptions.map((option:any) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>*/}
                                    {/*<TextField
                                        error={row.errors?.type}
                                        value={row.type}
                                        onChange={(e) => handleInputChange(row.id, 'type', e.target.value)}
                                        placeholder="Enter type"
                                    />*/}
                            </TableCell>

                            <TableCell>
                                <Button
                                  component="label"
                                  variant="contained"
                                  sx={{
                                    backgroundColor: row.errors?.file ? 'error.main' : '#1eb2a6',
                                    '&:hover': {
                                      backgroundColor: row.errors?.file ? 'error.dark' : '#179d8f', 
                                    },
                                  }}
                                  tabIndex={-1}
                                  startIcon={<CloudUploadIcon />}
                                >
                                  {row.fileName || "Upload file" }
                                  <input
                                    hidden
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setRows((prevRows:any) => prevRows.map((r:any) => (r.id === row.id ? 
                                            { ...r, file: file, fileName: file.name } : r)));
                                            handleInputChange(row.id, 'file', file);
                                        } 
                                    }}
                                    />
                                </Button>
                            </TableCell>
                             <TableCell>
                                <Tooltip title="Delete row">
                                    <IconButton disabled={row.isRequired != null} onClick={() => handleDeleteRow(row.id)} aria-label="delete" color="error">
                                        <TrashIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>

                        </TableRow>
                    )})}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default EditableTable;
