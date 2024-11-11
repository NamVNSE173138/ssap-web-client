import React, { useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, IconButton, Tooltip } from '@mui/material';
import { CloudUploadIcon, TrashIcon } from 'lucide-react';

function EditableTable({ rows, setRows, handleDeleteRow, handleInputChange }: any) {

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
                                    <TextField
                                        error={row.errors?.type}
                                        value={row.type}
                                        onChange={(e) => handleInputChange(row.id, 'type', e.target.value)}
                                        placeholder="Enter type"
                                    />
                            </TableCell>

                            <TableCell>
                                <Button
                                  component="label"
                                  variant="contained"
                                  color={row.errors?.file ? 'error' : 'primary'}
                                  tabIndex={-1}
                                  startIcon={<CloudUploadIcon />}
                                >
                                  {row.fileName || "Upload file*" }
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
                                    <IconButton onClick={() => handleDeleteRow(row.id)} aria-label="delete" color="error">
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
