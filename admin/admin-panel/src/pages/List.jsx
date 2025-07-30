import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = ({ currency, token }) => {
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');

            if (response.data.success) {
                setList(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const removeProduct = async (id) => {
        try {
            const response = await axios.post(
                backendUrl + '/api/product/remove',
                { id },
                { headers: {
    Authorization: `Bearer ${token}`,
  }}
            );
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <>
            <p className="capitalize mb-2 font-semibold text-lg">All products list</p>

            <div className="flex flex-col gap-2">
                {/* ----list table title */}
                <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-200 text-sm font-semibold">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b className="text-center">Action</b>
                </div>

                {/* ------ product list ------ */}
                {list.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] md:items-center py-2 px-3 bg-gray-50 hover:bg-gray-100 text-sm border"
                    >
                        <img className="w-12 h-12 object-cover rounded" src={item.image[0]} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>
                            {currency}
                            {Number(item?.price || 0).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </p>

                        <div className="flex  md:justify-center gap-3 md:mt-0 mt-2">
                            <button
                                onClick={() => navigate(`/edit-product/${item._id}`)}
                                className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => removeProduct(item._id)}
                                className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default List;
