import { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,

} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

import React from "react";
import { Button } from "@/components/ui/button";
import { IoMdAddCircle } from "react-icons/io";

import { getAllCategories } from "@/services/ApiServices/categoryService";
import AddCategoryModal from "./CategoryManagement/AddCategoryForm";
import EditCategoryModal from "./CategoryManagement/EditCategoryForm";

const ITEMS_PER_PAGE = 5;

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [openAddCategory, setOpenAddCategory] = useState<boolean>(false);

  const [openEditCategory, setOpenEditCategory] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const totalPages = Math.ceil(categories?.length / ITEMS_PER_PAGE);
  const paginatedCategories = categories?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const fetchCategories = () => {
    setLoading(true);
    getAllCategories()
      .then((data) => {
        setCategories(data.data);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderTable = () => (
    <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          fontWeight: 'bold',
          backgroundColor: '#f1f1f1',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '10px',
        }}
      >
        <div style={{ flex: 0.5 }}>ID</div>
        <div style={{ flex: 2 }}>Name</div>
        <div style={{ flex: 2 }}>Description</div>
        <div style={{ flex: 1 }}>Actions</div>
      </div>

      {/* Data Rows */}
      {paginatedCategories.map((account) => (
        <React.Fragment key={account.id}>
          <div
            style={{
              display: 'flex',
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: '#fff',
              borderBottom: '1px solid #ddd',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            <div style={{ flex: 0.5 }}>{account.id}</div>
            <div style={{ flex: 2 }}>{account.name}</div>
            <div style={{ flex: 2 }}>{account.description}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Tooltip title="Edit Category">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the row click event from firing
                      setCurrentCategory(account);
                      setOpenEditCategory(true);
                    }}
                    sx={{ color: 'blue', '&:hover': { color: '#1976d2' } }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
      <div style={{ marginTop: "20px", marginBottom: '10px', display: "flex", justifyContent: "end" }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor: currentPage === index + 1 ? "#419f97" : "#f1f1f1",
              color: currentPage === index + 1 ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </Paper>

  );

  return (
    <>
      <div className="flex justify-between">
        <h2 style={{ marginLeft: "16px", marginBottom: "24px", color: "#3f51b5", fontWeight: "bold" }}>
          Category Management
        </h2>

        <Button onClick={() => setOpenAddCategory(true)} className="gap-2">
          <IoMdAddCircle />
          Add Category
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {renderTable()}
        </>
      )}

      {categories && (
        <AddCategoryModal
          isOpen={openAddCategory}
          setIsOpen={(open: boolean) => setOpenAddCategory(open)}
          fetchCategory={async () => {
            fetchCategories();
          }}
        />
      )}

      {categories && (
        <EditCategoryModal
          isOpen={openEditCategory}
          setIsOpen={(open: boolean) => setOpenEditCategory(open)}
          category={currentCategory}
          fetchCategory={async () => {
            fetchCategories();
          }}
        />
      )}
    </>
  );
};

export default CategoryManagement;

type Category = {
  id: string;
  name: string;
  description: string;
};
