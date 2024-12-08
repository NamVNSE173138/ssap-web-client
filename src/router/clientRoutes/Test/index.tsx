"use client";

import { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import axios from "axios";
import { Search } from "lucide-react";

const BASE_API_URL = import.meta.env.BASE_URL;

export default function SearchBox() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length > 1) {
        setLoading(true);
        try {
          const response = await axios.get(
            `${BASE_API_URL}/api/scholarship-programs/suggest`,
            {
              params: { input },
            },
          );
          setSuggestions(response.data.data);
        } catch (error) {
          console.error("Error fetching suggestions", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(debounceTimer);
  }, [input]);

  return (
    <div className="w-full max-w-md mx-auto">
      <Autocomplete
        freeSolo
        options={suggestions}
        loading={loading}
        onInputChange={(_event, newInputValue) => {
          setInput(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search scholarships"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: <Search className="text-gray-400 mr-2" />,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} className="px-4 py-2 hover:bg-gray-100">
            {option}
          </li>
        )}
      />
    </div>
  );
}
