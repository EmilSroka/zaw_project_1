import React from "react";
import useEnv from "./useEnv";
import { useUser } from "./useUser";
import axios from "axios";

const CategoriesContext = React.createContext();

export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const { user: { apiKey } } = useUser();
    const backendUrl = useEnv('BACKEND_URL');

    const config = {
        headers: {
            Authorization: apiKey
        }
    };
        
    const fetchCategories = async () => {
        setLoading(true);
        try {
           const response = await axios.get(`${backendUrl}/categories`);
           setCategories(response.data);
        } catch (error) {
          console.error('Fetching categories failed:', error.response ? error.response.data : error.message);
          throw error;
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (data) => {
        try {
            await axios.post(`${backendUrl}/categories`, data, config);
            fetchCategories();
        } catch (error) {
            console.error('Adding category failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const updateCategory = async (data) => {
        try {
          await axios.put(`${backendUrl}/categories/${data.category_id}`, data, config);
          fetchCategories();
        } catch (error) {
          console.error('Delete category failed:', error.response ? error.response.data : error.message);
          throw error;
        }
    };

    const deleteCategory = async (id) => {
        try {
          await axios.delete(`${backendUrl}/categories/${id}`, config);
          fetchCategories();
        } catch (error) {
          console.error('Delete category failed:', error.response ? error.response.data : error.message);
          throw error;
        }
    };

    return (
        <CategoriesContext.Provider value={{ categories, loading, fetchCategories, deleteCategory, updateCategory, addCategory, isReady: backendUrl !== ''  }}>
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = () => React.useContext(CategoriesContext);
