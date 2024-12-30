import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, IconButton, Tooltip, Select, MenuItem } from '@mui/material';
import { CloudUploadIcon, TrashIcon } from 'lucide-react';

function EditableTable({ documents, rows, setRows, handleDeleteRow, handleInputChange }: any) {
    const typeOptions =
        [
            ...documents.map((doc: any) => !doc.isRequired && ({ value: doc.type, label: doc.type, isRequired: false })),
            { value: 'Other', label: 'Other', isRequired: false },
        ];
    return (
        <>
      {rows && rows.length > 0 && (
        <Paper
          elevation={3}
          style={{
            padding: '30px',
            borderRadius: '12px',
            backgroundColor: '#fafafa',
            width:'100%',
            boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'flex',
              fontWeight: 'bold',
              backgroundColor: '#f1f1f1',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '18px',
            }}
          >
            <div style={{ flex: 1, marginRight:'40px' }}>Document Name</div>
            <div style={{ flex: 1, marginRight:'25px' }}>Type</div>
            <div style={{ flex: 1, marginRight:'25px' }}>File</div>
            <div style={{ flex: 0.1 }}></div>
          </div>

          {/* Rows */}
          {rows.map((row: any) => (
            <div
              key={row.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f9f9f9',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '20px',
                transition: 'background-color 0.3s ease',
                fontSize: '16px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e3f2fd')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
            >
              <div style={{ flex: 1, marginRight:'40px' }}>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                  placeholder="Enter document name"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: row.errors?.name ? '2px solid red' : '2px solid #ccc',
                  }}
                />
              </div>

              <div style={{ flex: 1, marginRight:'25px' }}>
                {row.isRequired ? (
                  <div style={{ fontSize: '16px' }}>
                    {row.type} <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                  </div>
                ) : (
                  <select
                    value={row.type || ''}
                    onChange={(e) => handleInputChange(row.id, 'type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: row.errors?.type ? '2px solid red' : '2px solid #ccc',
                    }}
                  >
                    <option value="" disabled>Select Type</option>
                    {typeOptions.map((option: any) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ flex: 1, marginRight:'25px' }}>
                <Tooltip title="Upload file">
                  <label
                    style={{
                      display: 'block',
                      padding: '12px 18px',
                      backgroundColor: row.errors?.file ? 'red' : '#1eb2a6',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      width:'80%'
                    }}
                  >
                    {row.fileName || 'Upload file'}
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
                          handleInputChange(row.id, 'file', file);
                        }
                      }}
                    />
                  </label>
                </Tooltip>
              </div>

              <div style={{ flex: 0.1 }} className='flex justify-end'>
                <Tooltip title="Delete row">
                  <IconButton
                    disabled={row.isRequired != null}
                    onClick={() => handleDeleteRow(row.id)}
                    aria-label="delete"
                    color="error"
                    style={{
                      padding: '12px',
                      fontSize: '18px',
                    }}
                  >
                    <TrashIcon style={{ fontSize: '20px' }} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          ))}
        </Paper>
      )}
    </>
    );
}

export default EditableTable;
